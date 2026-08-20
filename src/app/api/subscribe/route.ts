import { NextResponse } from "next/server";
import { activeSubscriptionFor, subscriptionsReady } from "@/lib/dailyPrayer";
import { LEGAL_VERSION } from "@/lib/legal";
import { getDailySubscription } from "@/lib/pricing";
import { getStripe, subscriptionLineItem } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";
import { firstError, subscribeSchema } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * Iscrizione alla Preghiera del Giorno.
 *
 * Route separata da `/api/checkout` e non un ramo dentro di essa: là si vende
 * un bene una volta, qui si apre un rapporto che si rinnova da sé. Cambiano
 * la modalità Stripe (`subscription` invece di `payment`), i consensi
 * richiesti, gli eventi del webhook e cosa significa "già comprato". Tenerle
 * insieme vorrebbe dire tre `if` in ogni punto della funzione.
 */
export async function POST(req: Request) {
  const sub = getDailySubscription();
  if (!sub.enabled) {
    return NextResponse.json({ error: "Abbonamento non disponibile" }, { status: 404 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  const parsed = subscribeSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: firstError(parsed.error) }, { status: 400 });
  }

  const user = await getSessionUser();
  const email = (parsed.data.email || user?.email || "").trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Serve un indirizzo email" }, { status: 400 });

  // Le tabelle ci sono? Se le migrazioni non sono state applicate, questo
  // controllo è l'unica cosa fra un rilascio incompleto e un addebito
  // ricorrente che non consegna niente.
  if (!(await subscriptionsReady())) {
    console.error("[subscribe] tabella subscriptions assente: applicare la migrazione 008");
    return NextResponse.json(
      {
        error:
          "L'abbonamento non è ancora attivo su questo sito. Riprova più tardi: non è stato addebitato nulla.",
      },
      { status: 503 }
    );
  }

  // Chi è già abbonato non deve poter pagare due volte lo stesso servizio: il
  // vincolo in database lo impedirebbe comunque, ma dopo l'addebito, e un
  // rimborso è peggio di un messaggio.
  const existing = await activeSubscriptionFor(email);
  if (existing) {
    return NextResponse.json(
      {
        error: "Questo indirizzo riceve già la preghiera del giorno.",
        manageUrl: `/preghiera-del-giorno/gestisci?token=${existing.manage_token}`,
      },
      { status: 409 }
    );
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

  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || new URL(req.url).origin;
  const { consent } = parsed.data;

  // L'ordine nasce prima del pagamento anche qui: è il posto dove resta la
  // prova del consenso, e deve esistere pure se il checkout viene abbandonato.
  const { data: order, error: orderErr } = await db
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      email,
      product_id: sub.id,
      product_name: sub.name,
      credits: 0,
      cadence: "subscription",
      status: "pending",
      amount_cents: sub.amountCents,
      currency: "eur",
      draft: null,
      consent_special_data: consent.specialData,
      consent_terms: consent.terms,
      // Non c'è nessun dato di terzi da dichiarare in un abbonamento: la
      // colonna resta a false ed è la risposta onesta, non una dimenticanza.
      consent_third_party: false,
      consent_immediate: consent.immediate,
      consent_at: new Date().toISOString(),
      consent_version: LEGAL_VERSION,
    })
    .select("id")
    .single<{ id: string }>();

  if (orderErr || !order) {
    return NextResponse.json(
      { error: `Impossibile registrare l'iscrizione: ${orderErr?.message ?? "errore DB"}` },
      { status: 500 }
    );
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [subscriptionLineItem(sub)],
      customer_email: email,
      client_reference_id: order.id,
      metadata: { order_id: order.id, product_id: sub.id, email, user_id: user?.id ?? "" },
      // I metadata della sessione non arrivano sull'oggetto `subscription`:
      // vanno ricopiati qui, o gli eventi di rinnovo e disdetta non avrebbero
      // modo di risalire all'ordine.
      subscription_data: {
        metadata: { order_id: order.id, product_id: sub.id, email },
        ...(sub.trialDays > 0 ? { trial_period_days: sub.trialDays } : {}),
      },
      success_url: `${base}/grazie?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/preghiera-del-giorno?annullato=1`,
      locale: "it",
      // Utile per il lancio e per i codici di recupero: senza questo il campo
      // del codice sconto non compare proprio, e un codice distribuito
      // risulterebbe non funzionante.
      allow_promotion_codes: true,
    });

    await db.from("orders").update({ stripe_checkout_session_id: session.id }).eq("id", order.id);

    return NextResponse.json({ url: session.url, orderId: order.id });
  } catch (err) {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore Stripe" },
      { status: 500 }
    );
  }
}
