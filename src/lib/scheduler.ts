import "server-only";
import { raiseAlert } from "./alerts";
import { generatePrayer } from "./generate";
import { createAdminClient } from "./supabase/admin";
import { availableCredits, type Bundle, type Prayer, type PrayerDraft } from "./types";

/** Quante preghiere generare al massimo in un giro di cron. */
function batchSize(): number {
  const raw = Number.parseInt(process.env.CRON_BATCH_SIZE || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 8;
}

/** Secondi oltre i quali il giro si ferma, per non farsi uccidere a metà. */
function timeBudget(): number {
  const raw = Number.parseInt(process.env.CRON_TIME_BUDGET_SECONDS || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 240;
}

type BundleWithDelivery = Bundle & {
  auto_deliver: boolean;
  template: PrayerDraft | null;
  last_delivered_on: string | null;
};

export type CronReport = {
  enqueued: number;
  generated: number;
  failed: number;
  skipped: string[];
  stoppedEarly: boolean;
};

/** Data di oggi in formato `YYYY-MM-DD`, per l'idempotenza giornaliera. */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Mette in coda la preghiera del giorno per ogni pacchetto che ne ha diritto.
 *
 * Un pacchetto è "dovuto" se ha la consegna automatica accesa, un modello
 * salvato (la sua prima preghiera), almeno un credito sbloccato e non ha già
 * ricevuto nulla oggi. L'ultima condizione rende l'operazione ripetibile: il
 * cron può girare ogni quarto d'ora senza generare doppioni.
 */
export async function enqueueDueBundles(): Promise<number> {
  const db = createAdminClient();
  const day = today();

  const { data: bundles } = await db
    .from("bundles")
    .select("*")
    .eq("auto_deliver", true)
    .not("template", "is", null)
    .or(`last_delivered_on.is.null,last_delivered_on.lt.${day}`)
    .returns<BundleWithDelivery[]>();

  let enqueued = 0;

  for (const bundle of bundles ?? []) {
    if (availableCredits(bundle) < 1) continue;

    const template = bundle.template;
    if (!template) continue;

    // Scala il credito con controllo di concorrenza: se un'altra istanza del
    // cron (o l'utente dalla dashboard) l'ha già usato, qui non passa.
    const { data: charged } = await db
      .from("bundles")
      .update({
        used_credits: bundle.used_credits + 1,
        last_delivered_on: day,
      })
      .eq("id", bundle.id)
      .eq("used_credits", bundle.used_credits)
      .or(`last_delivered_on.is.null,last_delivered_on.lt.${day}`)
      .select("id")
      .maybeSingle();

    if (!charged) continue;

    const sequenceIndex = bundle.used_credits + 1;

    const { error } = await db.from("prayers").insert({
      user_id: bundle.user_id,
      email: bundle.email,
      bundle_id: bundle.id,
      religion: template.religion,
      tradition: template.tradition ?? null,
      prayer_type: template.prayer_type,
      intention: template.intention,
      recipient_name: template.recipient_name ?? null,
      language: template.language ?? "it",
      tone: template.tone ?? "solenne",
      sequence_index: sequenceIndex,
      sequence_total: bundle.total_credits,
      status: "queued",
    });

    if (error) {
      // Restituisci il credito: non è colpa di chi ha pagato.
      await db
        .from("bundles")
        .update({ used_credits: bundle.used_credits, last_delivered_on: bundle.last_delivered_on })
        .eq("id", bundle.id);

      await raiseAlert({
        kind: "fulfillment_failed",
        message: `Preghiera automatica non creata: ${error.message}`,
        email: bundle.email,
        context: { pacchetto: bundle.id, prodotto: bundle.product_id, giorno: sequenceIndex },
      });
      continue;
    }

    enqueued += 1;
  }

  return enqueued;
}

/**
 * Genera le preghiere ferme in coda, poche alla volta.
 *
 * Include anche quelle rimesse in `queued` da un tentativo fallito: il cron è
 * la rete di sicurezza per chi ha chiuso la pagina prima che finisse.
 */
export async function drainQueue(): Promise<{ generated: number; failed: number; stoppedEarly: boolean }> {
  const db = createAdminClient();
  const deadline = Date.now() + timeBudget() * 1000;

  const { data: queued } = await db
    .from("prayers")
    .select("id, email")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(batchSize())
    .returns<Pick<Prayer, "id" | "email">[]>();

  let generated = 0;
  let failed = 0;
  let stoppedEarly = false;

  for (const prayer of queued ?? []) {
    // Una generazione dura 20-40 s: senza margine il processo verrebbe
    // ucciso a metà, lasciando la preghiera in `generating`.
    if (Date.now() > deadline - 60_000) {
      stoppedEarly = true;
      break;
    }

    try {
      const result = await generatePrayer(prayer.id);
      if (result.status === "ready") generated += 1;
      else failed += 1;
    } catch {
      // `generatePrayer` ha già registrato l'errore e, se ha esaurito i
      // tentativi, mandato l'allerta. Qui si prosegue col prossimo.
      failed += 1;
    }
  }

  return { generated, failed, stoppedEarly };
}

/** Un giro completo: prima riempi la coda, poi svuotala. */
export async function runScheduledDelivery(): Promise<CronReport> {
  const skipped: string[] = [];

  let enqueued = 0;
  try {
    enqueued = await enqueueDueBundles();
  } catch (err) {
    skipped.push("enqueue");
    await raiseAlert({
      kind: "fulfillment_failed",
      message: `Accodamento automatico fallito: ${err instanceof Error ? err.message : err}`,
    });
  }

  const { generated, failed, stoppedEarly } = await drainQueue();

  return { enqueued, generated, failed, skipped, stoppedEarly };
}
