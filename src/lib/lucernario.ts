import "server-only";
import { getLucernario } from "./pricing";
import { createAdminClient } from "./supabase/admin";
import { sendCandleLit } from "./mailer";

export type Candle = {
  id: string;
  slot: number;
  donor_name: string | null;
  intention: string | null;
  religion: string | null;
  amount_cents: number;
  lit_at: string;
  expires_at: string;
};

/** Una postazione della parete: accesa (con la sua candela) o libera. */
export type Slot = {
  slot: number;
  candle: Candle | null;
};

/**
 * Stato della parete: tutte le postazioni, nell'ordine, con dentro la candela
 * accesa se c'è. Le candele scadute semplicemente non compaiono più: non serve
 * spegnerle con un job, basta filtrare per `expires_at`.
 */
export async function loadWall(): Promise<Slot[]> {
  const { slots } = getLucernario();

  let lit: Candle[] = [];
  try {
    const db = createAdminClient();
    const { data } = await db
      .from("candles")
      .select("id, slot, donor_name, intention, religion, amount_cents, lit_at, expires_at")
      .gt("expires_at", new Date().toISOString())
      .order("lit_at", { ascending: false })
      .returns<Candle[]>();
    lit = data ?? [];
  } catch {
    // Servizio non configurato: la parete si mostra comunque, tutta spenta.
  }

  // Se per una postazione risultassero più candele valide, vince la più recente.
  const bySlot = new Map<number, Candle>();
  for (const candle of lit) {
    if (!bySlot.has(candle.slot)) bySlot.set(candle.slot, candle);
  }

  return Array.from({ length: slots }, (_, i) => ({
    slot: i + 1,
    candle: bySlot.get(i + 1) ?? null,
  }));
}

/** Numeri delle postazioni libere in questo momento. */
export async function freeSlots(): Promise<number[]> {
  const wall = await loadWall();
  return wall.filter((s) => !s.candle).map((s) => s.slot);
}

/**
 * Accende una candela dopo il pagamento.
 *
 * Se nel frattempo la postazione scelta è stata occupata da qualcun altro,
 * ne assegna un'altra libera invece di far perdere il pagamento. Restituisce il
 * numero effettivamente assegnato, o null se la parete è tutta piena.
 */
export async function lightCandle(input: {
  slot: number;
  orderId: string | null;
  userId: string | null;
  email: string | null;
  donorName?: string | null;
  intention?: string | null;
  religion?: string | null;
  amountCents: number;
}): Promise<number | null> {
  const db = createAdminClient();
  const { hours } = getLucernario();

  // Già accesa per questo ordine: webhook duplicato, non fare nulla.
  if (input.orderId) {
    const { data: already } = await db
      .from("candles")
      .select("slot")
      .eq("order_id", input.orderId)
      .maybeSingle<{ slot: number }>();
    if (already) return already.slot;
  }

  const free = await freeSlots();
  if (free.length === 0) return null;

  const slot = free.includes(input.slot) ? input.slot : free[0];

  const now = new Date();
  const expires = new Date(now.getTime() + hours * 60 * 60 * 1000);

  const { error } = await db.from("candles").insert({
    slot,
    order_id: input.orderId,
    user_id: input.userId,
    email: input.email,
    donor_name: input.donorName ?? null,
    intention: input.intention ?? null,
    religion: input.religion ?? null,
    amount_cents: input.amountCents,
    lit_at: now.toISOString(),
    expires_at: expires.toISOString(),
  });

  if (error) throw new Error(`Impossibile accendere la candela: ${error.message}`);

  if (input.email) {
    await sendCandleLit({
      to: input.email,
      slot,
      hours,
      donorName: input.donorName,
      intention: input.intention,
    });
  }

  return slot;
}

/** Quanto manca allo spegnimento, in forma leggibile. */
export function remainingLabel(expiresAt: string): string {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "si sta spegnendo";

  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);

  if (hours >= 1) return `ancora ${hours} h`;
  return `ancora ${Math.max(1, minutes)} min`;
}
