import { NextResponse } from "next/server";
import { getLucernario } from "@/lib/pricing";
import { freeSlots } from "@/lib/lucernario";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { firstError, lucernarioSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function siteUrl(req: Request): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(req.url).origin;
}

/** Acquisto a importo libero di una candela del lucernario. */
export async function POST(req: Request) {
  const config = getLucernario();
  if (!config.enabled) {
    return NextResponse.json({ error: "Il lucernario è chiuso" }, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  const parsed = lucernarioSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  }

  const { slot, amountCents, donorName, intention, religion } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  if (slot > config.slots) {
    return NextResponse.json({ error: "Questa candela non esiste" }, { status: 400 });
  }
  if (amountCents < config.minCents) {
    return NextResponse.json(
      { error: `L'importo minimo è di ${(config.minCents / 100).toFixed(2).replace(".", ",")} €` },
      { status: 400 }
    );
  }
  if (amountCents > config.maxCents) {
    return NextResponse.json({ error: "Importo troppo alto" }, { status: 400 });
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

  // La postazione si verifica ora e si riverifica al pagamento: qui è solo
  // cortesia, per non mandare al checkout chi ha scelto una candela già accesa.
  const free = await freeSlots();
  if (free.length === 0) {
    return NextResponse.json(
      { error: "Il lucernario è tutto acceso. Riprova più tardi: le candele si spengono a turno." },
      { status: 409 }
    );
  }
  if (!free.includes(slot)) {
    return NextResponse.json(
      { error: "Qualcuno ha appena acceso questa candela. Scegline un'altra." },
      { status: 409 }
    );
  }

  const user = await getSessionUser();

  const { data: order, error: orderErr } = await db
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email,
      product_id: "lucernario",
      product_name: "Lucernario — una candela accesa",
      credits: 0,
      cadence: "instant",
      status: "pending",
      amount_cents: amountCents,
      currency: "eur",
      draft: { slot, donorName: donorName ?? null, intention: intention ?? null, religion: religion ?? null },
    })
    .select("id")
    .single<{ id: string }>();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: `Impossibile registrare l'ordine: ${orderErr?.message ?? "errore DB"}` },
      { status: 500 }
    );
  }

  try {
    const base = siteUrl(req);
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amountCents,
            product_data: {
              name: `Lucernario — candela n. ${slot}`,
              description: `Importo libero. La candela resterà accesa per ${config.hours} ore.`,
            },
          },
        },
      ],
      customer_email: email,
      client_reference_id: order.id,
      metadata: { order_id: order.id, product_id: "lucernario", slot: String(slot), email },
      payment_intent_data: { metadata: { order_id: order.id, product_id: "lucernario" } },
      success_url: `${base}/grazie?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/lucernario?annullato=1`,
      locale: "it",
    });

    await db.from("orders").update({ stripe_checkout_session_id: session.id }).eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore Stripe" },
      { status: 500 }
    );
  }
}
