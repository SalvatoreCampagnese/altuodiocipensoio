import { AUDIO_BUCKET, createAdminClient } from "./supabase/admin";
import { estimateDuration, synthesizePrayer } from "./elevenlabs";
import { writePrayer } from "./openai";
import { sendPrayerReady } from "./mailer";
import { raiseAlert } from "./alerts";
import type { Prayer } from "./types";

/** Quanti tentativi prima di dichiarare fallita una preghiera. */
function maxAttempts(): number {
  const raw = Number.parseInt(process.env.GENERATION_MAX_ATTEMPTS || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 3;
}

/** Dopo quanti minuti una preghiera ferma in `generating` si considera piantata. */
function staleMinutes(): number {
  const raw = Number.parseInt(process.env.GENERATION_STALE_MINUTES || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 5;
}

/**
 * Pipeline completa: testo (OpenAI) -> voce (ElevenLabs) -> Storage -> DB.
 *
 * Asincrona e autoriparante. L'utente non ha nulla da premere:
 *  - due invocazioni concorrenti non generano due volte (lock ottimistico);
 *  - un processo morto a metà non lascia la preghiera bloccata per sempre
 *    (le `generating` più vecchie di `staleMinutes` tornano prendibili);
 *  - un errore rimette la preghiera in coda finché restano tentativi, e solo
 *    all'ultimo la dichiara fallita avvisando il gestore.
 */
export async function generatePrayer(prayerId: string): Promise<Prayer> {
  const db = createAdminClient();

  const { data: existing, error: readErr } = await db
    .from("prayers")
    .select("*")
    .eq("id", prayerId)
    .single<Prayer>();

  if (readErr || !existing) throw new Error(`Preghiera ${prayerId} non trovata`);
  if (existing.status === "ready") return existing;

  const attempts = existing.attempts ?? 0;
  const limit = maxAttempts();

  // Esauriti i tentativi non si insiste: ogni giro costa OpenAI + ElevenLabs.
  if (existing.status === "failed" && attempts >= limit) return existing;

  const staleBefore = new Date(Date.now() - staleMinutes() * 60_000).toISOString();

  // Lock ottimistico: passa a `generating` solo chi trova la preghiera in uno
  // stato prendibile. Chi arriva secondo esce a mani vuote e non duplica.
  const { data: locked } = await db
    .from("prayers")
    .update({
      status: "generating",
      attempts: attempts + 1,
      last_attempt_at: new Date().toISOString(),
      error_message: null,
    })
    .eq("id", prayerId)
    .eq("attempts", attempts) // nessun altro ha incrementato nel frattempo
    .or(
      [
        "status.in.(draft,queued,failed)",
        `and(status.eq.generating,last_attempt_at.lt.${staleBefore})`,
        "and(status.eq.generating,last_attempt_at.is.null)",
      ].join(",")
    )
    .select("*")
    .maybeSingle<Prayer>();

  if (!locked) return existing; // qualcun altro la sta già generando

  try {
    const { title, body } = await writePrayer(locked);

    const { audio, voiceId } = await synthesizePrayer({
      text: body,
      religionId: locked.religion,
      language: locked.language,
      tone: locked.tone,
    });

    const audioPath = `${locked.id}/preghiera.mp3`;
    const { error: uploadErr } = await db.storage
      .from(AUDIO_BUCKET)
      .upload(audioPath, audio, { contentType: "audio/mpeg", upsert: true });

    if (uploadErr) throw new Error(`Upload audio fallito: ${uploadErr.message}`);

    const { data: updated, error: updateErr } = await db
      .from("prayers")
      .update({
        status: "ready",
        title,
        body,
        audio_path: audioPath,
        audio_duration: estimateDuration(body),
        voice_id: voiceId,
        generated_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", prayerId)
      .select("*")
      .single<Prayer>();

    if (updateErr || !updated) throw new Error(updateErr?.message ?? "Salvataggio fallito");

    // Consegna via email. Non blocca né compromette la generazione: se non
    // parte, la preghiera resta comunque raggiungibile dal suo link privato.
    await sendPrayerReady({
      to: updated.email,
      title,
      body,
      prayerId: updated.id,
      accessToken: updated.access_token,
      recipientName: updated.recipient_name,
    });

    return updated;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    const used = attempts + 1;
    const exhausted = used >= limit;

    // Finché restano tentativi torna in coda: il polling della pagina la
    // riprende da solo, senza che l'utente debba fare nulla.
    await db
      .from("prayers")
      .update({
        status: exhausted ? "failed" : "queued",
        error_message: message.slice(0, 500),
      })
      .eq("id", prayerId);

    if (exhausted) {
      await raiseAlert({
        kind: "generation_failed",
        message,
        prayerId,
        orderId: locked.order_id,
        email: locked.email,
        context: {
          tentativi: used,
          religione: locked.religion,
          tipo: locked.prayer_type,
          lingua: locked.language,
          ordine: locked.order_id,
          pacchetto: locked.bundle_id,
        },
      });
    }

    throw err;
  }
}

/** Signed URL per riprodurre/scaricare l'mp3 (bucket privato). */
export async function getAudioUrl(audioPath: string, expiresIn = 60 * 60 * 24): Promise<string | null> {
  const db = createAdminClient();
  const { data, error } = await db.storage.from(AUDIO_BUCKET).createSignedUrl(audioPath, expiresIn);
  if (error || !data) return null;
  return data.signedUrl;
}
