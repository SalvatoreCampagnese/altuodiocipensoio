import "server-only";
import { sendAdminAlert } from "./mailer";
import { createAdminClient } from "./supabase/admin";

export type AlertKind =
  | "generation_failed"
  | "generation_stuck"
  | "fulfillment_failed"
  | "candle_wall_full";

export type AlertInput = {
  kind: AlertKind;
  message: string;
  severity?: "info" | "warning" | "error";
  prayerId?: string | null;
  orderId?: string | null;
  /** Email dell'utente coinvolto, non del gestore. */
  email?: string | null;
  context?: Record<string, unknown>;
};

/** Indirizzo del gestore a cui arrivano le allerte. */
export function alertRecipient(): string {
  return process.env.ALERT_EMAIL?.trim() || "salvatore.campagnese@gmail.com";
}

/**
 * Registra un guasto e avvisa il gestore.
 *
 * Doppio canale apposta: la riga su Supabase resta anche se l'email non parte
 * (o se Resend non è configurato), così nulla si perde. La funzione non
 * solleva mai eccezioni: un problema nel segnalare un problema non deve
 * peggiorare la situazione di chi ha pagato.
 */
export async function raiseAlert(input: AlertInput): Promise<void> {
  const severity = input.severity ?? "error";
  console.error(`[alert:${input.kind}]`, input.message, input.context ?? "");

  let notified = false;
  try {
    notified = await sendAdminAlert({
      to: alertRecipient(),
      kind: input.kind,
      severity,
      message: input.message,
      prayerId: input.prayerId ?? null,
      userEmail: input.email ?? null,
      context: input.context,
    });
  } catch {
    // ignorata: resta la riga su Supabase
  }

  try {
    await createAdminClient()
      .from("alerts")
      .insert({
        kind: input.kind,
        severity,
        message: input.message.slice(0, 2000),
        prayer_id: input.prayerId ?? null,
        order_id: input.orderId ?? null,
        email: input.email ?? null,
        context: input.context ?? null,
        notified,
      });
  } catch (err) {
    console.error("[alert] impossibile registrare l'allerta:", err);
  }
}
