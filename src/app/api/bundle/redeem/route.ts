import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";
import { availableCredits, nextUnlockDate, type Bundle } from "@/lib/types";
import { firstError, prayerDraftSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Consuma un credito del bundle e mette in coda una nuova preghiera. */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Devi accedere per usare i tuoi crediti" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  // Normalizzata come al checkout: è la chiave che lega gli acquisti da ospite.
  const email = user.email?.trim().toLowerCase() ?? "";

  const parsed = prayerDraftSchema.safeParse({ ...(payload as object), email });
  if (!parsed.success) {
    return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  }
  const draft = parsed.data;

  const db = createAdminClient();

  // Bundle più vecchio con crediti disponibili: si consumano in ordine d'acquisto.
  const { data: bundles } = await db
    .from("bundles")
    .select("*")
    .or(`user_id.eq.${user.id},email.eq.${email}`)
    .order("created_at", { ascending: true })
    .returns<Bundle[]>();

  const usable = (bundles ?? []).find((b) => availableCredits(b) > 0);

  if (!usable) {
    const pending = (bundles ?? [])
      .map(nextUnlockDate)
      .filter((d): d is Date => d !== null)
      .sort((a, b) => a.getTime() - b.getTime())[0];

    return NextResponse.json(
      {
        error: pending
          ? `Hai già usato la preghiera di questo mese. La prossima si sblocca il ${pending.toLocaleDateString("it-IT")}.`
          : "Non hai crediti disponibili.",
        nextUnlock: pending?.toISOString() ?? null,
      },
      { status: 409 }
    );
  }

  // Scalo del credito con controllo di concorrenza: se un'altra richiesta ha
  // già consumato lo stesso credito, l'update non trova la riga e si annulla.
  const { data: charged } = await db
    .from("bundles")
    .update({ used_credits: usable.used_credits + 1 })
    .eq("id", usable.id)
    .eq("used_credits", usable.used_credits)
    .select("id")
    .maybeSingle();

  if (!charged) {
    return NextResponse.json(
      { error: "Credito già in uso, riprova tra un istante." },
      { status: 409 }
    );
  }

  const { data: prayer, error } = await db
    .from("prayers")
    .insert({
      user_id: user.id,
      email,
      bundle_id: usable.id,
      religion: draft.religion,
      tradition: draft.tradition ?? null,
      prayer_type: draft.prayer_type,
      intention: draft.intention,
      recipient_name: draft.recipient_name ?? null,
      language: draft.language,
      tone: draft.tone,
      scheduled_for: draft.scheduled_for ?? null,
      status: "queued",
      sequence_index: usable.used_credits + 1,
      sequence_total: usable.total_credits,
    })
    .select("id, access_token")
    .single<{ id: string; access_token: string }>();

  if (error || !prayer) {
    // Rimborsa il credito: non è colpa dell'utente.
    await db
      .from("bundles")
      .update({ used_credits: usable.used_credits })
      .eq("id", usable.id);
    return NextResponse.json({ error: `Creazione fallita: ${error?.message}` }, { status: 500 });
  }

  // La prima preghiera del pacchetto diventa il modello delle successive:
  // una novena è la stessa intenzione ripetuta per nove giorni, non nove
  // preghiere diverse. Da qui in poi il cron le manda da solo.
  const today = new Date().toISOString().slice(0, 10);

  if (!usable.template) {
    await db
      .from("bundles")
      .update({
        template: {
          religion: draft.religion,
          tradition: draft.tradition ?? null,
          prayer_type: draft.prayer_type,
          intention: draft.intention,
          recipient_name: draft.recipient_name ?? null,
          language: draft.language,
          tone: draft.tone,
          email,
        },
        last_delivered_on: today,
      })
      .eq("id", usable.id);
  } else {
    await db.from("bundles").update({ last_delivered_on: today }).eq("id", usable.id);
  }

  return NextResponse.json({ prayerId: prayer.id, token: prayer.access_token });
}
