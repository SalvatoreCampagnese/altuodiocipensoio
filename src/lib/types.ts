import type { Cadence } from "./pricing";

export type PrayerStatus = "draft" | "queued" | "generating" | "ready" | "failed";
export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export type PrayerDraft = {
  religion: string;
  tradition?: string | null;
  prayer_type: string;
  intention: string;
  recipient_name?: string | null;
  language: string;
  tone: string;
  scheduled_for?: string | null;
  email: string;
};

export type Prayer = {
  id: string;
  user_id: string | null;
  email: string;
  order_id: string | null;
  bundle_id: string | null;
  religion: string;
  tradition: string | null;
  prayer_type: string;
  intention: string;
  recipient_name: string | null;
  language: string;
  tone: string;
  scheduled_for: string | null;
  status: PrayerStatus;
  title: string | null;
  body: string | null;
  audio_path: string | null;
  audio_duration: number | null;
  voice_id: string | null;
  error_message: string | null;
  attempts: number;
  last_attempt_at: string | null;
  /** Posizione nella sequenza del pacchetto: "3 di 9". */
  sequence_index: number | null;
  sequence_total: number | null;
  access_token: string;
  created_at: string;
  updated_at: string;
  generated_at: string | null;
};

export type Bundle = {
  id: string;
  order_id: string | null;
  user_id: string | null;
  email: string;
  product_id: string;
  product_name: string | null;
  cadence: Cadence;
  total_credits: number;
  used_credits: number;
  starts_at: string;
  created_at: string;
  /** Consegna automatica della preghiera del giorno. */
  auto_deliver: boolean;
  /** Modello ricavato dalla prima preghiera: le successive nascono da qui. */
  template: PrayerDraft | null;
  /** Giorno dell'ultima consegna automatica, per l'idempotenza del cron. */
  last_delivered_on: string | null;
};

export type Order = {
  id: string;
  user_id: string | null;
  email: string;
  product_id: string;
  product_name: string | null;
  credits: number;
  cadence: Cadence;
  status: OrderStatus;
  amount_cents: number;
  currency: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  draft: PrayerDraft | null;
  created_at: string;
  paid_at: string | null;
};

type UnlockInput = Pick<Bundle, "total_credits" | "starts_at" | "cadence">;

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Crediti sbloccati finora.
 *  - instant: tutti subito
 *  - daily:   1 subito, poi 1 per ogni giorno trascorso (novena, trigesimo)
 *  - monthly: 1 subito, poi 1 per ogni mese trascorso (l'anno)
 */
export function unlockedCredits(bundle: UnlockInput): number {
  if (bundle.cadence === "instant") return bundle.total_credits;

  const start = new Date(bundle.starts_at);
  const now = new Date();

  const elapsed =
    bundle.cadence === "daily"
      ? Math.floor((now.getTime() - start.getTime()) / DAY_MS)
      : (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth()) -
        (now.getDate() < start.getDate() ? 1 : 0);

  return Math.min(bundle.total_credits, 1 + Math.max(0, elapsed));
}

export function availableCredits(bundle: Bundle): number {
  return Math.max(0, unlockedCredits(bundle) - bundle.used_credits);
}

/** Quando si sblocca il prossimo credito (null se sono già tutti disponibili). */
export function nextUnlockDate(bundle: Bundle): Date | null {
  const unlocked = unlockedCredits(bundle);
  if (unlocked >= bundle.total_credits) return null;

  const next = new Date(bundle.starts_at);
  if (bundle.cadence === "daily") {
    next.setDate(next.getDate() + unlocked);
  } else {
    next.setMonth(next.getMonth() + unlocked);
  }
  return next;
}
