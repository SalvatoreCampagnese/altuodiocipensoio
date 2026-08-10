import type Stripe from "stripe";
import { createAdminClient } from "./supabase/admin";
import { getProduct } from "./pricing";
import { lightCandle } from "./lucernario";
import { getStripe } from "./stripe";
import type { Order, PrayerDraft } from "./types";

export type FulfillmentResult = {
  order: Order;
  prayerId?: string;
  bundleId?: string;
  candleSlot?: number | null;
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
  if (session.payment_status !== "paid") return null;

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
