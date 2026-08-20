import type Stripe from "stripe";
import { createAdminClient } from "./supabase/admin";
import { loadDailyPrayer, romeToday } from "./dailyPrayer";
import { sendSubscriptionWelcome } from "./mailer";
import { getDailySubscription } from "./pricing";
import { getProduct } from "./pricing";
import { lightCandle } from "./lucernario";
import { getStripe } from "./stripe";
import type { DailySubscription, Order, PrayerDraft } from "./types";

export type FulfillmentResult = {
  order: Order;
  prayerId?: string;
  bundleId?: string;
  candleSlot?: number | null;
  subscriptionId?: string;
};

/**
 * Trasforma un pagamento riuscito nel bene acquistato.
 *
 * Idempotente e chiamabile da due punti: il webhook Stripe (canale primario) e
 * la pagina di ringraziamento (rete di sicurezza quando il webhook è lento o
 * non configurato, tipico in sviluppo locale).
 */
export async function fulfillPaidSession(
  session: Stripe.Checkout.Session
): Promise<FulfillmentResult | null> {
  // Un abbonamento con prova gratuita non è "paid": è "no_payment_required",
  // e scartarlo qui significherebbe non attivare mai chi ha una prova.
  const settled =
    session.payment_status === "paid" ||
    (session.mode === "subscription" && session.payment_status === "no_payment_required");
  if (!settled) return null;

  const db = createAdminClient();
  const orderId = session.metadata?.order_id ?? session.client_reference_id;
  if (!orderId) throw new Error("Checkout session senza order_id");

  const { data: order } = await db.from("orders").select("*").eq("id", orderId).single<Order>();
  if (!order) throw new Error(`Ordine ${orderId} non trovato`);

  if (order.status !== "paid") {
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    await db
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: paymentIntentId,
        stripe_checkout_session_id: session.id,
      })
      .eq("id", order.id);

    order.status = "paid";
  }

  // Lucernario: si accende una candela e basta.
  if (order.product_id === "lucernario") {
    const draft = (order.draft ?? {}) as Record<string, unknown>;
    const slot = await lightCandle({
      slot: Number(draft.slot) || 1,
      orderId: order.id,
      userId: order.user_id,
      email: order.email,
      donorName: (draft.donorName as string) ?? null,
      intention: (draft.intention as string) ?? null,
      religion: (draft.religion as string) ?? null,
      amountCents: order.amount_cents,
    });
    return { order, candleSlot: slot };
  }

  // Abbonamento: non c'è nulla da generare adesso, si apre un rapporto.
  if (order.cadence === "subscription") {
    return { order, subscriptionId: await ensureSubscription(order, session) };
  }

  // Una sola preghiera: si crea subito. Pacchetto: si creano i crediti.
  if (order.credits <= 1) {
    return { order, prayerId: await ensurePrayer(order) };
  }
  return { order, bundleId: await ensureBundle(order) };
}

/** Come sopra, partendo dal solo id di sessione (la pagina /grazie ha solo quello). */
export async function fulfillBySessionId(sessionId: string): Promise<FulfillmentResult | null> {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  return fulfillPaidSession(session);
}

async function ensurePrayer(order: Order): Promise<string> {
  const db = createAdminClient();

  const { data: already } = await db
    .from("prayers")
    .select("id")
    .eq("order_id", order.id)
    .maybeSingle<{ id: string }>();
  if (already) return already.id;

  const draft = order.draft as PrayerDraft | null;
  if (!draft) throw new Error(`Ordine ${order.id} senza contenuto della preghiera`);

  const { data, error } = await db
    .from("prayers")
    .insert({
      user_id: order.user_id,
      email: order.email,
      order_id: order.id,
      religion: draft.religion,
      tradition: draft.tradition ?? null,
      prayer_type: draft.prayer_type,
      intention: draft.intention,
      recipient_name: draft.recipient_name ?? null,
      language: draft.language ?? "it",
      tone: draft.tone ?? "solenne",
      scheduled_for: draft.scheduled_for ?? null,
      status: "queued",
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) throw new Error(`Creazione preghiera fallita: ${error?.message}`);
  return data.id;
}

async function ensureBundle(order: Order): Promise<string> {
  const db = createAdminClient();

  const { data: already } = await db
    .from("bundles")
    .select("id")
    .eq("order_id", order.id)
    .maybeSingle<{ id: string }>();
  if (already) return already.id;

  // L'ordine porta con sé crediti e ritmo: se il listino cambia dopo
  // l'acquisto, chi ha già pagato tiene le condizioni del suo momento.
  const product = getProduct(order.product_id);

  const { data, error } = await db
    .from("bundles")
    .insert({
      order_id: order.id,
      user_id: order.user_id,
      email: order.email,
      product_id: order.product_id,
      product_name: order.product_name ?? product?.name ?? null,
      total_credits: order.credits,
      cadence: order.cadence,
      used_credits: 0,
      starts_at: new Date().toISOString(),
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) throw new Error(`Creazione pacchetto fallita: ${error?.message}`);
  return data.id;
}

/**
 * Apre l'abbonamento alla Preghiera del Giorno.
 *
 * Idempotente su `stripe_subscription_id`, che è unico in tabella: il webhook
 * e la pagina di ringraziamento possono arrivarci entrambi senza aprire due
 * abbonamenti sulla stessa email — e quel vincolo esiste proprio perché due
 * abbonamenti significherebbero due addebiti e due email identiche ogni
 * mattina.
 */
async function ensureSubscription(
  order: Order,
  session: Stripe.Checkout.Session
): Promise<string> {
  const db = createAdminClient();
  const config = getDailySubscription();

  const stripeSubId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  if (stripeSubId) {
    const { data: already } = await db
      .from("subscriptions")
      .select("id")
      .eq("stripe_subscription_id", stripeSubId)
      .maybeSingle<{ id: string }>();
    if (already) return already.id;
  }

  // Lo stato vero lo dice Stripe, non la sessione: con una prova gratuita
  // l'abbonamento è già `trialing`, e con un 3-D Secure in sospeso è ancora
  // `incomplete`. Registrare `active` a scatola chiusa vorrebbe dire mandare
  // la preghiera a chi non l'ha pagata.
  let status: DailySubscription["status"] = "active";
  let currentPeriodEnd: string | null = null;

  if (stripeSubId) {
    try {
      const stripeSub = await getStripe().subscriptions.retrieve(stripeSubId);
      currentPeriodEnd = new Date(stripeSub.current_period_end * 1000).toISOString();
      status = mapStripeStatus(stripeSub.status);
    } catch {
      // Stripe non risponde: si parte da `active` — il pagamento è
      // confermato dalla sessione — e il webhook correggerà.
    }
  }

  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

  const { data, error } = await db
    .from("subscriptions")
    .insert({
      order_id: order.id,
      user_id: order.user_id,
      email: order.email,
      product_id: order.product_id,
      status,
      stripe_customer_id: customerId,
      stripe_subscription_id: stripeSubId,
      amount_cents: order.amount_cents,
      currency: order.currency,
      interval: config.interval,
      current_period_end: currentPeriodEnd,
      started_at: new Date().toISOString(),
      consent_special_data: true,
      consent_terms: true,
      consent_immediate: true,
      consent_at: order.created_at,
    })
    .select("id, manage_token")
    .single<{ id: string; manage_token: string }>();

  if (error || !data) {
    // Vincolo di unicità: fra il controllo qui sopra e l'inserimento è
    // arrivato un secondo webhook. Non è un guasto, è la concorrenza.
    const { data: raced } = await db
      .from("subscriptions")
      .select("id")
      .eq("email", order.email)
      .in("status", ["active", "past_due"])
      .maybeSingle<{ id: string }>();
    if (raced) return raced.id;

    throw new Error(`Apertura abbonamento fallita: ${error?.message}`);
  }

  // Benvenuto con dentro la preghiera di oggi, se a quest'ora c'è già.
  // Chi si abbona alle otto la legge subito; chi si abbona alle tre di notte
  // la riceve alle nove col giro normale, e per questo `last_sent_on` resta
  // vuoto in quel caso.
  const today = romeToday();
  const todays = await loadDailyPrayer(today);
  const deliverable = todays?.status === "ready" && todays.body && todays.title;

  await sendSubscriptionWelcome({
    to: order.email,
    perDay: `${(config.perDayCents / 100).toFixed(2).replace(".", ",")} €`,
    billing: `${(config.amountCents / 100).toFixed(2).replace(".", ",")} € ${
      { day: "al giorno", week: "a settimana", month: "al mese" }[config.interval]
    }`,
    hour: config.deliveryHour,
    manageToken: data.manage_token,
    today: deliverable ? { title: todays!.title!, body: todays!.body! } : null,
  });

  if (deliverable) {
    await db.from("subscriptions").update({ last_sent_on: today }).eq("id", data.id);
  }

  return data.id;
}

/** Gli stati di Stripe, ridotti ai quattro che ci servono. */
export function mapStripeStatus(status: Stripe.Subscription.Status): DailySubscription["status"] {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    // `unpaid` è lo stato in cui Stripe ha smesso di riprovare ma non ha
    // ancora chiuso: il servizio resta acceso finché non chiude davvero.
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "incomplete";
  }
}
