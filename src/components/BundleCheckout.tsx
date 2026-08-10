"use client";

import { useState } from "react";
import type { PublicProduct } from "@/lib/pricing";

const CADENCE_NOTE: Record<PublicProduct["cadence"], string> = {
  instant: "Tutte le preghiere sono disponibili subito.",
  daily: "Una preghiera al giorno: la prima è disponibile appena paghi.",
  monthly: "Una preghiera al mese: la prima è disponibile appena paghi.",
};

export function BundleCheckout({
  product,
  defaultEmail = "",
}: {
  product: PublicProduct;
  defaultEmail?: string;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout non disponibile");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={buy} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">La tua email</span>
        <input
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@esempio.it"
          required
        />
      </label>

      {error && (
        <p className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full rounded-xl py-4 text-lg font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Un attimo…" : `${product.name} — ${product.price}`}
      </button>

      <p className="text-center text-xs leading-relaxed text-ink-soft/80">
        {CADENCE_NOTE[product.cadence]} Pagamento unico con Stripe, nessun rinnovo automatico.
      </p>
    </form>
  );
}
