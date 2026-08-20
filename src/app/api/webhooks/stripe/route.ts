import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { fulfillPaidSession, mapStripeStatus } from "@/lib/fulfillment";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
// Il body deve arrivare grezzo per la verifica della firma.
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET mancante" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante" }, { status: 400 });
  }

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "firma non valida";
    return NextResponse.json({ error: `Webhook non verificato: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await fulfillPaidSession(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed":
        await markFailed(event.data.object as Stripe.Checkout.Session);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      // --- Abbonamento alla Preghiera del Giorno --------------------------
      // Lo stato dell'abbonamento non lo decidiamo noi: lo decide se la carta
      // passa, e questo lo sa solo Stripe. Qui ci limitiamo a rispecchiarlo,
      // perché è da quella colonna che il cron delle 9 decide a chi spedire.
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;

      // Il rinnovo è andato: nuovo periodo pagato, nuova scadenza.
      case "invoice.paid":
        await touchPeriod(event.data.object as Stripe.Invoice, "active");
        break;

      // La carta è stata rifiutata. NON si spegne niente: Stripe riprova per
      // giorni, e chi ha solo cambiato carta non deve restare senza preghiera
      // nel frattempo. Quando si arrende manda `subscription.deleted`.
      case "invoice.payment_failed":
        await touchPeriod(event.data.object as Stripe.Invoice, "past_due");
        break;
    }
  } catch (err) {
    // Errore nostro: rispondi 500 così Stripe riprova con backoff.
    const message = err instanceof Error ? err.message : "errore";
    console.error("[stripe-webhook]", event.type, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function markFailed(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id ?? session.client_reference_id;
  if (!orderId) return;
  await createAdminClient()
    .from("orders")
    .update({ status: "failed" })
    .eq("id", orderId)
    .eq("status", "pending");
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
  if (!paymentIntentId) return;
  await createAdminClient()
    .from("orders")
    .update({ status: "refunded" })
    .eq("stripe_payment_intent_id", paymentIntentId);
}

/**
 * Rispecchia sullo stato locale quello che Stripe ha deciso.
 *
 * L'aggiornamento è cercato per `stripe_subscription_id` e non per email: la
 * stessa persona può aver disdetto e riabbonato, e in quel caso ci sono due
 * righe con lo stesso indirizzo di cui una sola è quella dell'evento.
 */
async function syncSubscription(sub: Stripe.Subscription) {
  const status = mapStripeStatus(sub.status);

  await createAdminClient()
    .from("subscriptions")
    .update({
      status,
      cancel_at_period_end: sub.cancel_at_period_end,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
    })
    .eq("stripe_subscription_id", sub.id);
}

/** Rinnovo riuscito o fallito: sposta la scadenza e lo stato. */
async function touchPeriod(invoice: Stripe.Invoice, status: "active" | "past_due") {
  const subscriptionId =
    typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
  if (!subscriptionId) return;

  const db = createAdminClient();

  // Su una fattura pagata la nuova scadenza sta nel periodo delle sue righe:
  // `period_end` della fattura è la fine del periodo appena fatturato.
  const periodEnd = invoice.lines?.data?.[0]?.period?.end ?? invoice.period_end;

  await db
    .from("subscriptions")
    .update({
      status,
      ...(status === "active" && periodEnd
        ? { current_period_end: new Date(periodEnd * 1000).toISOString() }
        : {}),
    })
    .eq("stripe_subscription_id", subscriptionId);
}
