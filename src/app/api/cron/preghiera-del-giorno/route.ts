import { NextResponse } from "next/server";
import { composeDailyPrayer, deliverDailyPrayer, romeToday } from "@/lib/dailyPrayer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Comporre testo e voce richiede 20-40 s; l'invio di un lotto di cento email
// pochi secondi. Il margine è per le mattine storte.
export const maxDuration = 300;

/**
 * I due appuntamenti della Preghiera del Giorno.
 *
 *   ?step=genera  → 07:00 Roma, compone il testo e lo fa recitare
 *   ?step=invia   → 09:00 Roma, spedisce a chi è abbonato
 *
 * Li pianifica pg_cron da Supabase (`009_pg_cron_daily_prayer.sql`) con lo
 * stesso bearer token del cron dei pacchetti.
 *
 * Un solo endpoint con due passi invece di due route: il contratto — segreto,
 * autorizzazione, formato della risposta, gestione degli errori — è identico,
 * e duplicarlo significherebbe correggerlo in due posti ogni volta.
 *
 * Senza `step` fa entrambe le cose nell'ordine giusto: è la forma comoda per
 * provare il giro a mano, o per recuperare un giorno saltato.
 */
async function handle(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET non configurato: endpoint disabilitato" },
      { status: 503 }
    );
  }

  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const url = new URL(req.url);
  const step = url.searchParams.get("step") ?? "tutto";
  // Consente di recuperare un giorno perso: ?giorno=2026-08-19
  const date = url.searchParams.get("giorno") || romeToday();

  const startedAt = Date.now();

  try {
    const report: Record<string, unknown> = { giorno: date, step };

    if (step === "genera" || step === "tutto") {
      report.composizione = await composeDailyPrayer(date);
    }
    if (step === "invia" || step === "tutto") {
      report.consegna = await deliverDailyPrayer(date);
    }
    if (step !== "genera" && step !== "invia" && step !== "tutto") {
      return NextResponse.json(
        { error: "step non valido: usa genera, invia, o ometti per fare entrambi" },
        { status: 400 }
      );
    }

    const seconds = Math.round((Date.now() - startedAt) / 1000);
    console.log("[cron:preghiera-del-giorno]", { ...report, seconds });
    return NextResponse.json({ ok: true, ...report, seconds });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("[cron:preghiera-del-giorno]", step, message);
    // `composeDailyPrayer` ha già registrato l'allerta e, se restano
    // tentativi, rimesso il giorno in coda: il 500 serve solo perché pg_net
    // lo registri fra le risposte.
    return NextResponse.json({ ok: false, giorno: date, step, error: message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
