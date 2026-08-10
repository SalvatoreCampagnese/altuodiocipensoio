import { NextResponse } from "next/server";
import { runScheduledDelivery } from "@/lib/scheduler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Ogni preghiera richiede 20-40 s: il giro ne fa poche e si ferma per tempo.
export const maxDuration = 300;

/**
 * Consegna automatica dei pacchetti.
 *
 * Lo chiama Vercel Cron (vedi `vercel.json`) oppure pg_cron da Supabase
 * (snippet in `supabase/migrations/005_auto_delivery.sql`). In entrambi i casi
 * l'autenticazione è lo stesso bearer token.
 *
 * Il giro è idempotente: può girare ogni quarto d'ora senza creare doppioni,
 * perché ogni pacchetto segna il giorno in cui ha già consegnato.
 */
async function handle(req: Request) {
  const secret = process.env.CRON_SECRET;

  // Senza CRON_SECRET l'endpoint resta chiuso: meglio un cron che non parte
  // di uno che chiunque può far girare a spese tue.
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET non configurato: endpoint disabilitato" },
      { status: 503 }
    );
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    const report = await runScheduledDelivery();
    const seconds = Math.round((Date.now() - startedAt) / 1000);

    console.log("[cron:prayers]", { ...report, seconds });
    return NextResponse.json({ ok: true, ...report, seconds });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto";
    console.error("[cron:prayers]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

// Vercel Cron invia GET; pg_net è più comodo in POST. Accettiamo entrambi.
export const GET = handle;
export const POST = handle;
