import { NextResponse } from "next/server";
import { subscriptionByToken } from "@/lib/dailyPrayer";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Apre il portale di fatturazione di Stripe.
 *
 * Serve per il caso che la sola disdetta non copre: la carta è scaduta,
 * l'addebito è stato rifiutato e l'abbonamento è `past_due`. Dirgli
 * "aggiorna la carta" senza dargli dove farlo lo lascerebbe con una sola
 * strada praticabile — disdire — e quella la perdiamo del tutto.
 *
 * Il portale lo ospita Stripe: nessun dato di carta passa da qui, e non
 * serve costruire un modulo di pagamento nostro.
 */
export async function POST(req: Request) {
  let payload: { token?: string };
  try {
    payload = (await req.json()) as { token?: string };
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  const token = payload.token?.trim();
  if (!token) return NextResponse.json({ error: "Token mancante" }, { status: 400 });

  const sub = await subscriptionByToken(token);
  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: "Abbonamento non trovato" }, { status: 404 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(req.url).origin;

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${base}/preghiera-del-giorno/gestisci?token=${encodeURIComponent(sub.manage_token)}`,
      locale: "it",
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Il portale va abilitato una volta sola dal cruscotto Stripe: finché non
    // lo è, l'API risponde con un errore esplicito che è bene far vedere.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore Stripe" },
      { status: 500 }
    );
  }
}
