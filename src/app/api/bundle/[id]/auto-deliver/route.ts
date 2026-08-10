import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";
import type { Bundle } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Accende o spegne la consegna automatica di un pacchetto. */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Devi accedere" }, { status: 401 });
  }

  const { id } = await ctx.params;

  let enabled: boolean;
  try {
    const body = await req.json();
    enabled = Boolean(body.enabled);
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  const db = createAdminClient();
  const email = user.email?.toLowerCase() ?? "";

  const { data: bundle } = await db
    .from("bundles")
    .select("id, user_id, email")
    .eq("id", id)
    .maybeSingle<Pick<Bundle, "id" | "user_id" | "email">>();

  if (!bundle) {
    return NextResponse.json({ error: "Pacchetto non trovato" }, { status: 404 });
  }
  if (bundle.user_id !== user.id && bundle.email.toLowerCase() !== email) {
    return NextResponse.json({ error: "Non è tuo" }, { status: 403 });
  }

  const { error } = await db.from("bundles").update({ auto_deliver: enabled }).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, enabled });
}
