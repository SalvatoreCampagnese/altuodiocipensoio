import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Scambia il codice del magic link con una sessione. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard";
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?errore=link_non_valido`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?errore=link_scaduto`);
  }

  // Collega gli acquisti fatti da ospite con questa stessa email.
  if (data.user.email) {
    const db = createAdminClient();
    const email = data.user.email.toLowerCase();
    await Promise.all([
      db.from("prayers").update({ user_id: data.user.id }).is("user_id", null).eq("email", email),
      db.from("bundles").update({ user_id: data.user.id }).is("user_id", null).eq("email", email),
      db.from("orders").update({ user_id: data.user.id }).is("user_id", null).eq("email", email),
    ]);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
