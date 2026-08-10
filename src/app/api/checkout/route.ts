import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";
import { getProduct } from "@/lib/pricing";
import { getStripe, lineItemFor } from "@/lib/stripe";
import { checkoutSchema, firstError } from "@/lib/validation";

export const runtime = "nodejs";

function siteUrl(req: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(req.url).origin;
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  }

  const { productId, draft } = parsed.data;

  const product = getProduct(productId);
  if (!product) {
    return NextResponse.json({ error: "Prodotto non disponibile" }, { status: 404 });
  }

  const user = await getSessionUser();
  // Normalizzata: è la chiave con cui ricolleghiamo gli acquisti da ospite.
  const email = (draft?.email ?? parsed.data.email ?? user?.email)?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Serve un indirizzo email" }, { status: 400 });
  }
  // I prodotti da una sola preghiera si comprano già compilati; i pacchetti no.
  if (product.credits === 1 && !draft) {
    return NextResponse.json({ error: "Manca il contenuto della preghiera" }, { status: 400 });
  }

  let db: ReturnType<typeof createAdminClient>;
  try {
    db = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Servizio non ancora configurato: mancano le chiavi Supabase." },
      { status: 503 }
    );
  }

  const base = siteUrl(req);

  // 1. Ordine in stato pending: il draft resta qui finché non arriva il pagamento.
  const { data: order, error: orderErr } = await db
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email,
      product_id: product.id,
      product_name: product.name,
      credits: product.credits,
      cadence: product.cadence,
      status: "pending",
      amount_cents: product.amountCents,
      currency: "eur",
      draft: product.credits === 1 ? draft : null,
    })
    .select("id")
    .single<{ id: string }>();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: `Impossibile creare l'ordine: ${orderErr?.message ?? "errore DB"}` },
      { status: 500 }
    );
  }

  // 2. Checkout Stripe.
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItemFor(product)],
      customer_email: email,
      client_reference_id: order.id,
      metadata: { order_id: order.id, product_id: product.id, email, user_id: user?.id ?? "" },
      payment_intent_data: { metadata: { order_id: order.id, product_id: product.id } },
      success_url: `${base}/grazie?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/${product.credits === 1 ? "nuova-preghiera" : "pacchetti"}?annullato=1`,
      locale: "it",
    });

    await db.from("orders").update({ stripe_checkout_session_id: session.id }).eq("id", order.id);

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (err) {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id);
    const message = err instanceof Error ? err.message : "Errore Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
