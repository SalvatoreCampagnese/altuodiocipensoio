import { NextResponse } from "next/server";
import { subscriptionByToken } from "@/lib/dailyPrayer";
import { sendSubscriptionCanceled } from "@/lib/mailer";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Disdetta.
 *
 * Un clic, il token che l'utente ha già in fondo a ogni email, nessuna
 * domanda sul perché e nessuna offerta per farlo restare. Non è generosità:
 * un'iscrizione difficile da annullare finisce come "segnala come spam", e
 * una segnalazione danneggia la consegna di tutte le email successive — anche
 * quelle di chi vuole riceverle.
 *
 * Si disdice a fine periodo e non subito: il periodo è pagato, e togliere
 * il servizio prima della sua scadenza sarebbe trattenere denaro per niente.
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
  if (!sub) return NextResponse.json({ error: "Abbonamento non trovato" }, { status: 404 });

  // Già disdetto: rispondi come se fosse andata bene. Un secondo clic sul
  // link dell'email non deve mostrare un errore a chi ha solo ricontrollato.
  if (sub.status === "canceled" || sub.cancel_at_period_end) {
    return NextResponse.json({ ok: true, until: sub.current_period_end });
  }

  const db = createAdminClient();

  try {
    if (sub.stripe_subscription_id) {
      await getStripe().subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: true,
      });
    }
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Errore Stripe" },
      { status: 500 }
    );
  }

  // Lo stato resta `active` fino alla scadenza: la preghiera continua ad
  // arrivare fino all'ultimo giorno pagato, ed è `customer.subscription.deleted`
  // a chiudere davvero. Qui si segna solo che non si rinnoverà.
  await db
    .from("subscriptions")
    .update({ cancel_at_period_end: true, canceled_at: new Date().toISOString() })
    .eq("id", sub.id);

  await sendSubscriptionCanceled({
    to: sub.email,
    until: sub.current_period_end
      ? new Date(sub.current_period_end).toLocaleDateString("it-IT", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null,
  });

  return NextResponse.json({ ok: true, until: sub.current_period_end });
}
