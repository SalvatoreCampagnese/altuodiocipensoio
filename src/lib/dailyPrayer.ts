import "server-only";

import { raiseAlert } from "./alerts";
import { estimateDuration, synthesizePrayer } from "./elevenlabs";
import { dailyPrayerEmail, sendBulk, type BulkMessage } from "./mailer";
import { writeDailyPrayer } from "./openai";
import { getDailySubscription } from "./pricing";
import { AUDIO_BUCKET, createAdminClient } from "./supabase/admin";
import type { DailyPrayer, DailySubscription } from "./types";

/**
 * La Preghiera del Giorno.
 *
 * Due momenti, due funzioni, due chiamate di cron distinte:
 *   `composeDailyPrayer()` alle 7 — scrive il testo e lo fa recitare
 *   `deliverDailyPrayer()` alle 9 — lo spedisce a chi è abbonato
 *
 * Separate di proposito. Se stessero insieme, un guasto di ElevenLabs alle
 * nove meno un minuto significherebbe nessuna email quel giorno; così invece
 * la composizione ha due ore di margine e due tentativi prima che qualcuno
 * apra la posta.
 *
 * Entrambe sono idempotenti: la data è unica in `daily_prayers`, e ogni
 * abbonato porta il giorno della sua ultima consegna. Il cron può ripassare
 * quante volte vuole senza scrivere due preghiere né spedire due email.
 */

/* ---------------------------------------------------------------------------
 * Il giorno
 * ------------------------------------------------------------------------- */

/**
 * La data di oggi a Roma, in `YYYY-MM-DD`.
 *
 * Non `toISOString().slice(0,10)`: quella è la data UTC, e a Roma d'estate
 * sono le due ore in cui il server crede sia ancora ieri. Una preghiera "del
 * giorno" generata alle 7 del mattino con la data sbagliata sarebbe un
 * doppione del giorno prima. `en-CA` è la scorciatoia per avere il formato
 * ISO da `Intl` senza montarlo a mano.
 */
export function romeToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** "giovedì 20 agosto 2026" — come si legge una data in fondo a una preghiera. */
export function dateLabel(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ---------------------------------------------------------------------------
 * I temi
 * ------------------------------------------------------------------------- */

/**
 * Il filo conduttore del giorno.
 *
 * Senza un tema imposto, un modello a cui si chiede "una preghiera per oggi"
 * scrive trecentosessantacinque volte la stessa preghiera sulla luce del
 * mattino. Il tema è il vincolo che costringe a cambiare argomento.
 *
 * Sono trentuno — un numero primo — perché con trenta il ciclo cadrebbe
 * sempre di lunedì e ogni lunedì avrebbe lo stesso tema. Con trentuno la
 * rotazione scivola sui giorni della settimana e non si nota.
 */
export const THEMES: { id: string; label: string }[] = [
  { id: "gratitudine", label: "La gratitudine per ciò che non abbiamo chiesto" },
  { id: "fatica", label: "La fatica del lavoro e chi lo fa senza che si veda" },
  { id: "paura", label: "La paura che arriva di notte e resta al mattino" },
  { id: "malati", label: "Chi è malato, e chi lo assiste senza riposo" },
  { id: "pazienza", label: "La pazienza con le persone difficili" },
  { id: "perdono", label: "Il perdono che non riusciamo a dare" },
  { id: "lontani", label: "Le persone lontane, e chi è partito" },
  { id: "figli", label: "I figli, e la paura di sbagliare con loro" },
  { id: "pace", label: "La pace, dove è rotta e dove sta per rompersi" },
  { id: "poveri", label: "Chi non arriva a fine mese e non lo dice" },
  { id: "memoria", label: "I morti, e la memoria che resta di loro" },
  { id: "scelta", label: "Una decisione che non si può più rimandare" },
  { id: "silenzio", label: "Il silenzio, e l'imbarazzo di stare senza parole" },
  { id: "corpo", label: "Il corpo che invecchia e cambia" },
  { id: "amicizia", label: "Gli amici, e quelli che si sono persi per strada" },
  { id: "rabbia", label: "La rabbia, e cosa farne" },
  { id: "lavoro-perso", label: "Chi ha perso il lavoro o teme di perderlo" },
  { id: "casa", label: "La casa, e chi non ce l'ha" },
  { id: "solitudine", label: "La solitudine di chi vive solo" },
  { id: "speranza", label: "La speranza quando non ci sono ragioni" },
  { id: "giustizia", label: "L'ingiustizia vista e non impedita" },
  { id: "attesa", label: "L'attesa di una risposta che non arriva" },
  { id: "gioia", label: "Una gioia piccola, da non lasciar passare" },
  { id: "stranieri", label: "Chi è arrivato da un altro paese" },
  { id: "vergogna", label: "Una cosa di cui ci vergogniamo" },
  { id: "creato", label: "La terra, le stagioni, gli animali" },
  { id: "chi-decide", label: "Chi ha responsabilità sugli altri" },
  { id: "fede-debole", label: "I giorni in cui non si riesce a credere" },
  { id: "riconciliazione", label: "Una frattura in famiglia" },
  { id: "notte", label: "Chi lavora di notte mentre gli altri dormono" },
  { id: "cominciare", label: "Ricominciare da capo, di nuovo" },
];

/**
 * Il tema di una data. Deterministico: la stessa data dà sempre lo stesso
 * tema, così rigenerare un giorno perduto non produce un testo scollegato da
 * quello che i lettori si aspettavano.
 */
export function themeForDate(date: string): { id: string; label: string } {
  const days = Math.floor(Date.parse(`${date}T12:00:00Z`) / 86_400_000);
  return THEMES[((days % THEMES.length) + THEMES.length) % THEMES.length];
}

/* ---------------------------------------------------------------------------
 * Lettura
 * ------------------------------------------------------------------------- */

export async function loadDailyPrayer(date: string): Promise<DailyPrayer | null> {
  try {
    const { data } = await createAdminClient()
      .from("daily_prayers")
      .select("*")
      .eq("prayer_date", date)
      .maybeSingle<DailyPrayer>();
    return data ?? null;
  } catch {
    // Servizio non configurato: la pagina mostra comunque l'offerta.
    return null;
  }
}

/** I giorni scorsi, per l'elenco in fondo alla pagina e per non ripetersi. */
export async function recentDailyPrayers(limit = 7, before?: string): Promise<DailyPrayer[]> {
  try {
    let q = createAdminClient()
      .from("daily_prayers")
      .select("*")
      .eq("status", "ready")
      .order("prayer_date", { ascending: false })
      .limit(limit);

    if (before) q = q.lt("prayer_date", before);

    const { data } = await q.returns<DailyPrayer[]>();
    return data ?? [];
  } catch {
    return [];
  }
}

/**
 * Il primo paragrafo, che è quanto vede chi non è abbonato.
 *
 * Non è una scelta di layout: è dove passa la linea fra ciò che si regala e
 * ciò che si vende. Abbastanza da capire se questa preghiera parla di te,
 * non abbastanza da non aver bisogno del resto.
 */
export function teaser(body: string): string {
  return body.split(/\n{2,}/)[0]?.trim() ?? "";
}

/** Quanti paragrafi restano oltre l'assaggio: "e altri 3 paragrafi". */
export function hiddenParagraphs(body: string): number {
  return Math.max(0, body.split(/\n{2,}/).filter((p) => p.trim()).length - 1);
}

/* ---------------------------------------------------------------------------
 * Composizione — il giro delle 7
 * ------------------------------------------------------------------------- */

function maxAttempts(): number {
  const raw = Number.parseInt(process.env.GENERATION_MAX_ATTEMPTS || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 3;
}

function staleMinutes(): number {
  const raw = Number.parseInt(process.env.GENERATION_STALE_MINUTES || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 5;
}

export type ComposeResult = {
  date: string;
  status: DailyPrayer["status"];
  title: string | null;
  /** C'era già: il cron è ripassato e non ha rifatto nulla. */
  reused: boolean;
};

/**
 * Compone la preghiera del giorno, una volta sola.
 *
 * La riga del giorno si crea con `on conflict do nothing`: chi vince
 * l'inserimento è l'unico che può generare, e due cron sovrapposti non
 * producono due testi. Da lì in poi vale lo stesso lock ottimistico delle
 * preghiere su misura.
 */
export async function composeDailyPrayer(date = romeToday()): Promise<ComposeResult> {
  const db = createAdminClient();
  const theme = themeForDate(date);

  const religion = process.env.DAILY_PRAYER_RELIGION?.trim() || "cattolica";
  const language = process.env.DAILY_PRAYER_LANGUAGE?.trim() || "it";
  const tone = process.env.DAILY_PRAYER_TONE?.trim() || "solenne";

  // Prenota il giorno. `ignoreDuplicates` è l'`on conflict do nothing` di
  // supabase-js: il secondo cron che arriva non solleva errore né sovrascrive
  // il testo già scritto, trova la riga e prosegue a leggerla.
  await db.from("daily_prayers").upsert(
    {
      prayer_date: date,
      religion,
      language,
      tone,
      theme: theme.id,
      theme_label: theme.label,
      status: "queued",
    },
    { onConflict: "prayer_date", ignoreDuplicates: true }
  );

  const existing = await loadDailyPrayer(date);
  if (!existing) throw new Error(`Impossibile creare la preghiera del ${date}`);
  if (existing.status === "ready") {
    return { date, status: "ready", title: existing.title, reused: true };
  }

  const attempts = existing.attempts ?? 0;
  if (existing.status === "failed" && attempts >= maxAttempts()) {
    return { date, status: "failed", title: null, reused: true };
  }

  const staleBefore = new Date(Date.now() - staleMinutes() * 60_000).toISOString();

  const { data: locked } = await db
    .from("daily_prayers")
    .update({
      status: "generating",
      attempts: attempts + 1,
      last_attempt_at: new Date().toISOString(),
      error_message: null,
    })
    .eq("prayer_date", date)
    .eq("attempts", attempts)
    .or(
      [
        "status.in.(draft,queued,failed)",
        `and(status.eq.generating,last_attempt_at.lt.${staleBefore})`,
        "and(status.eq.generating,last_attempt_at.is.null)",
      ].join(",")
    )
    .select("*")
    .maybeSingle<DailyPrayer>();

  // Qualcun altro la sta già scrivendo: va bene così.
  if (!locked) return { date, status: existing.status, title: existing.title, reused: true };

  try {
    const recent = await recentDailyPrayers(5, date);

    const { title, body } = await writeDailyPrayer({
      date,
      religion: locked.religion,
      language: locked.language,
      tone: locked.tone,
      theme: locked.theme ?? theme.id,
      themeLabel: locked.theme_label ?? theme.label,
      recentTitles: recent.map((p) => p.title).filter((t): t is string => Boolean(t)),
    });

    // La voce è un di più, non il prodotto: l'email porta il testo. Se
    // ElevenLabs è giù la preghiera esce lo stesso, muta, e alle nove parte.
    let audioPath: string | null = null;
    let audioDuration: number | null = null;
    let voiceId: string | null = null;

    try {
      const { audio, voiceId: usedVoice } = await synthesizePrayer({
        text: body,
        religionId: locked.religion,
        language: locked.language,
        tone: locked.tone,
      });

      const path = `giorno/${date}.mp3`;
      const { error: uploadErr } = await db.storage
        .from(AUDIO_BUCKET)
        .upload(path, audio, { contentType: "audio/mpeg", upsert: true });

      if (uploadErr) throw new Error(uploadErr.message);

      audioPath = path;
      audioDuration = estimateDuration(body);
      voiceId = usedVoice;
    } catch (err) {
      await raiseAlert({
        kind: "generation_failed",
        severity: "warning",
        message: `Preghiera del ${date}: testo riuscito, voce no — ${err instanceof Error ? err.message : err}`,
        context: { giorno: date, tema: locked.theme },
      });
    }

    const { data: ready } = await db
      .from("daily_prayers")
      .update({
        status: "ready",
        title,
        body,
        audio_path: audioPath,
        audio_duration: audioDuration,
        voice_id: voiceId,
        generated_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("prayer_date", date)
      .select("*")
      .single<DailyPrayer>();

    return { date, status: "ready", title: ready?.title ?? title, reused: false };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    const used = attempts + 1;
    const exhausted = used >= maxAttempts();

    await db
      .from("daily_prayers")
      .update({
        status: exhausted ? "failed" : "queued",
        error_message: message.slice(0, 500),
      })
      .eq("prayer_date", date);

    // Questa allerta è più urgente di quella di una preghiera su misura: là
    // resta senza il suo testo una persona, qui restano senza tutti gli
    // abbonati, e alle nove se ne accorgono insieme.
    await raiseAlert({
      kind: "fulfillment_failed",
      severity: exhausted ? "error" : "warning",
      message: `Preghiera del giorno ${date} non composta (tentativo ${used}): ${message}`,
      context: { giorno: date, tema: theme.id, tentativi: used },
    });

    throw err;
  }
}

/* ---------------------------------------------------------------------------
 * Consegna — il giro delle 9
 * ------------------------------------------------------------------------- */

/** Quanti indirizzi per giro. Il batch di Resend ne accetta 100 per chiamata. */
function mailBatch(): number {
  const raw = Number.parseInt(process.env.CRON_MAIL_BATCH || "", 10);
  return Math.min(100, Number.isFinite(raw) && raw > 0 ? raw : 100);
}

export type DeliveryResult = {
  date: string;
  sent: number;
  /** Restano abbonati da servire: il giro dopo li prende. */
  pending: boolean;
  skipped?: string;
};

/**
 * Spedisce la preghiera del giorno agli abbonati che oggi non l'hanno ancora
 * ricevuta.
 *
 * L'ordine delle operazioni è: prima si segna la consegna, poi si spedisce.
 * Sembra sbagliato, ed è deliberato. Fra i due errori possibili — una persona
 * riceve due volte la stessa preghiera, oppure un giorno non la riceve — il
 * primo è molto peggio: un doppione ogni mattina è il motivo per cui la gente
 * segna un mittente come spam, mentre un buco isolato si nota appena. Se poi
 * l'invio fallisce del tutto, la marcatura si annulla e il giro dopo riprova.
 */
export async function deliverDailyPrayer(date = romeToday()): Promise<DeliveryResult> {
  const db = createAdminClient();

  const prayer = await loadDailyPrayer(date);
  if (!prayer || prayer.status !== "ready" || !prayer.body || !prayer.title) {
    return { date, sent: 0, pending: true, skipped: "preghiera del giorno non ancora pronta" };
  }

  const { data: due } = await db
    .from("subscriptions")
    .select("id, email, manage_token, last_sent_on")
    .in("status", ["active", "past_due"])
    .or(`last_sent_on.is.null,last_sent_on.lt.${date}`)
    .order("created_at", { ascending: true })
    .limit(mailBatch())
    .returns<Pick<DailySubscription, "id" | "email" | "manage_token" | "last_sent_on">[]>();

  const recipients = due ?? [];
  if (recipients.length === 0) {
    if (!prayer.sent_at) {
      await db
        .from("daily_prayers")
        .update({ sent_at: new Date().toISOString() })
        .eq("prayer_date", date);
    }
    return { date, sent: 0, pending: false };
  }

  // Rivendica il giro in una sola query: l'`or` ripetuto è la condizione di
  // concorrenza — passa solo chi oggi non era ancora stato preso — e le righe
  // che tornano sono esattamente quelle diventate nostre. Farlo un abbonato
  // alla volta sarebbero cento andate e ritorni verso il database per ogni
  // giro, e il giro delle nove ne fa più d'uno.
  const { data: claimedRows } = await db
    .from("subscriptions")
    .update({ last_sent_on: date })
    .in(
      "id",
      recipients.map((s) => s.id)
    )
    .or(`last_sent_on.is.null,last_sent_on.lt.${date}`)
    .select("id")
    .returns<{ id: string }[]>();

  const claimedIds = new Set((claimedRows ?? []).map((r) => r.id));
  const claimed = recipients.filter((s) => claimedIds.has(s.id));

  if (claimed.length === 0) return { date, sent: 0, pending: false };

  const label = dateLabel(date);
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

  const messages: BulkMessage[] = claimed.map((sub) =>
    dailyPrayerEmail({
      to: sub.email,
      title: prayer.title!,
      body: prayer.body!,
      dateLabel: label,
      themeLabel: prayer.theme_label,
      // Alla pagina, non a un link firmato che scade: il token dell'abbonato
      // vale finché vale l'abbonamento, e la pagina rigenera l'audio ogni volta.
      audioUrl: prayer.audio_path
        ? `${siteUrl}/preghiera-del-giorno?token=${encodeURIComponent(sub.manage_token)}`
        : null,
      manageToken: sub.manage_token,
    })
  );

  const accepted = await sendBulk(messages);

  if (accepted === 0) {
    // Niente è partito: restituisci il giorno a tutti, il giro dopo riprova.
    await db
      .from("subscriptions")
      .update({ last_sent_on: null })
      .in(
        "id",
        claimed.map((s) => s.id)
      )
      .eq("last_sent_on", date);

    await raiseAlert({
      kind: "fulfillment_failed",
      message: `Preghiera del ${date}: invio fallito per ${claimed.length} abbonati, rimessi in coda`,
      context: { giorno: date, destinatari: claimed.length },
    });

    return { date, sent: 0, pending: true, skipped: "invio non riuscito" };
  }

  if (accepted < claimed.length) {
    // Resend ne ha presi solo una parte e non dice quali. Qui NON si annulla
    // la marcatura: rimetterli tutti in coda rispedirebbe a chi ha già
    // ricevuto. Meglio la segnalazione e un intervento a mano sui pochi
    // rimasti fuori.
    await raiseAlert({
      kind: "fulfillment_failed",
      severity: "warning",
      message: `Preghiera del ${date}: accettate ${accepted} email su ${claimed.length}`,
      context: { giorno: date, accettate: accepted, richieste: claimed.length },
    });
  }

  // Somma letta e riscritta: due giri sovrapposti possono perdersi un
  // incremento a vicenda. È accettabile perché `sent_count` è una statistica
  // da guardare, non ciò che decide chi riceve — quello è `last_sent_on`
  // sull'abbonato, ed è rivendicato con controllo di concorrenza.
  await db
    .from("daily_prayers")
    .update({
      sent_at: new Date().toISOString(),
      sent_count: (prayer.sent_count ?? 0) + accepted,
    })
    .eq("prayer_date", date);

  return { date, sent: accepted, pending: claimed.length >= mailBatch() };
}

/* ---------------------------------------------------------------------------
 * Abbonamenti
 * ------------------------------------------------------------------------- */

/**
 * L'impianto dell'abbonamento esiste davvero in database?
 *
 * Serve a impedire il peggior esito possibile di un rilascio: il codice è
 * online ma le migrazioni 008/009 non sono state applicate, qualcuno si
 * abbona, Stripe incassa, e il webhook non trova la tabella dove scrivere
 * l'abbonamento. Il risultato è un addebito ricorrente a fronte di nessuna
 * email — cioè la cosa peggiore che questo sito possa fare a qualcuno.
 *
 * Meglio quindi accorgersene PRIMA del checkout e rispondere che il servizio
 * non è ancora disponibile. Un'iscrizione mancata si recupera; un rimborso
 * con delle scuse, molto meno.
 */
export async function subscriptionsReady(): Promise<boolean> {
  try {
    const { error } = await createAdminClient()
      .from("subscriptions")
      .select("id", { count: "exact", head: true });
    return !error;
  } catch {
    return false;
  }
}

/** L'abbonamento attivo di un'email, se c'è. */
export async function activeSubscriptionFor(email: string): Promise<DailySubscription | null> {
  if (!email) return null;
  try {
    const { data } = await createAdminClient()
      .from("subscriptions")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .in("status", ["active", "past_due"])
      .maybeSingle<DailySubscription>();
    return data ?? null;
  } catch {
    return null;
  }
}

/** L'abbonamento dietro al token del link in fondo alle email. */
export async function subscriptionByToken(token: string): Promise<DailySubscription | null> {
  if (!token || token.length < 16) return null;
  try {
    const { data } = await createAdminClient()
      .from("subscriptions")
      .select("*")
      .eq("manage_token", token)
      .maybeSingle<DailySubscription>();
    return data ?? null;
  } catch {
    return null;
  }
}

/** Quante persone ricevono la preghiera ogni mattina. */
export async function subscriberCount(): Promise<number> {
  try {
    const { count } = await createAdminClient()
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .in("status", ["active", "past_due"]);
    return count ?? 0;
  } catch {
    return 0;
  }
}

/** Riassunto pubblico dell'abbonamento, per le pagine. */
export function describeSubscription(sub: DailySubscription): string {
  const config = getDailySubscription();
  const until = sub.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  if (sub.status === "canceled") {
    return "Abbonamento disdetto. Non riceverai altre email e non ci saranno altri addebiti.";
  }
  if (sub.cancel_at_period_end) {
    return until
      ? `Disdetto. Ricevi la preghiera fino al ${until}, poi si ferma. Nessun altro addebito.`
      : "Disdetto: non ci saranno altri addebiti.";
  }
  if (sub.status === "past_due") {
    return "L'ultimo addebito non è andato a buon fine. Continui a ricevere la preghiera mentre Stripe riprova: aggiorna la carta per non interrompere.";
  }
  return until
    ? `Attivo. Prossimo addebito il ${until}, ${(sub.amount_cents / 100).toFixed(2).replace(".", ",")} €.`
    : `Attivo. ${config.perDayCents / 100} € al giorno.`;
}
