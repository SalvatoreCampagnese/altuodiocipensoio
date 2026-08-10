import { createClient } from "@supabase/supabase-js";

/**
 * Client con service role: bypassa RLS.
 * Usarlo SOLO in route handler / server action, mai in codice client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase non configurato: mancano NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const AUDIO_BUCKET = process.env.SUPABASE_AUDIO_BUCKET || "prayers";
