import { createAdminClient } from "./supabase/admin";
import { getSessionUser } from "./supabase/server";
import type { Prayer } from "./types";

/**
 * Una preghiera è accessibile se:
 *  - chi guarda è l'utente proprietario, oppure
 *  - possiede l'access_token (link diretto, per gli acquisti da ospite).
 *
 * Il confronto del token è a tempo costante per non farlo indovinare a forza bruta.
 */
export async function loadAccessiblePrayer(
  prayerId: string,
  token?: string | null
): Promise<Prayer | null> {
  let db: ReturnType<typeof createAdminClient>;
  try {
    db = createAdminClient();
  } catch {
    return null; // servizio non configurato: la pagina mostra "non trovata"
  }

  const { data: prayer } = await db
    .from("prayers")
    .select("*")
    .eq("id", prayerId)
    .maybeSingle<Prayer>();

  if (!prayer) return null;

  if (token && safeEqual(token, prayer.access_token)) return prayer;

  const user = await getSessionUser();
  if (!user) return null;
  if (prayer.user_id === user.id) return prayer;
  // Acquisto da ospite, poi registrazione con la stessa email: la rivendichiamo.
  if (user.email && prayer.email.toLowerCase() === user.email.toLowerCase()) {
    await db.from("prayers").update({ user_id: user.id }).eq("id", prayer.id);
    return { ...prayer, user_id: user.id };
  }
  return null;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
