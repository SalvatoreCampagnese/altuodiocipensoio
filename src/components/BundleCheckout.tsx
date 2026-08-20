"use client";

import { useState } from "react";
import type { PublicProduct } from "@/lib/pricing";
import {
  ConsentBlock,
  EMPTY_CONSENT,
  consentComplete,
  type ConsentState,
} from "@/components/ConsentBlock";

const CADENCE_NOTE: Record<PublicProduct["cadence"], string> = {
  instant: "Tutte le preghiere sono disponibili subito.",
  daily: "Una preghiera al giorno: la prima è disponibile appena paghi.",
  monthly: "Una preghiera al mese: la prima è disponibile appena paghi.",
  // I pacchetti non si rinnovano: la voce esiste solo per completare il tipo.
  subscription: "Una preghiera al giorno, finché resti abbonato.",
};

export function BundleCheckout({
  product,
  defaultEmail = "",
}: {
  product: PublicProduct;
  defaultEmail?: string;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [consent, setConsent] = useState<ConsentState>(EMPTY_CONSENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function buy(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Il pacchetto si compra prima di scrivere la preghiera, ma il consenso
    // serve già qui: è questo l'atto di acquisto, ed è a questo ordine che la
    // prova del consenso resta legata.
    if (!consentComplete(consent, "checkout")) {
      setError("Per procedere devi spuntare tutte le dichiarazioni qui sopra.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, email: email.trim(), consent }),
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

      <ConsentBlock value={consent} onChange={setConsent} mode="checkout" />

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
