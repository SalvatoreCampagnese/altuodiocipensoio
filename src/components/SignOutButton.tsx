"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={signOut}
      className="rounded-lg border border-gold/20 px-4 py-2 text-sm text-ink-soft transition-colors hover:border-gold/40 hover:text-ink"
    >
      Esci
    </button>
  );
}
