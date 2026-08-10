"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message :"Invio non riuscito");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-gold/25 bg-gold/5 p-6 text-center">
        <p className="font-display text-2xl text-ink">Controlla la posta</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Abbiamo mandato un link di accesso a <strong className="text-ink">{email}</strong>.
          Se non lo vedi, guarda tra lo spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={send} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">Email</span>
        <input
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@esempio.it"
          required
          autoFocus
        />
      </label>

      {error && (
        <p className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-xl btn-gold py-3 font-medium text-white  disabled:opacity-50"
      >
        {status === "sending" ?"Invio…" :"Mandami il link"}
      </button>

      <p className="text-center text-xs text-ink-soft/60">
        Usa la stessa email con cui hai pagato: ritroverai tutte le tue preghiere.
      </p>
    </form>
  );
}
