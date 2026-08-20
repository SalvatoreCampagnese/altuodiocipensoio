"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Disdetta, dalla pagina di gestione.
 *
 * Una conferma sola e nessun tentativo di trattenere: niente sconto
 * dell'ultimo minuto, niente "sei sicuro?" ripetuto, niente sondaggio sul
 * perché. Rendere difficile andarsene non trattiene nessuno, converte la
 * disdetta in una segnalazione di spam — e quella danneggia la consegna delle
 * email di tutti gli altri abbonati.
 *
 * La conferma singola c'è perché il link arriva via email e un anteprima
 * troppo zelante non deve poter disdire da sola.
 */
export function ManageSubscription({
  token,
  canCancel = true,
  needsCard = false,
}: {
  token: string;
  /** Falso se è già stata data disdetta: resta solo il portale di Stripe. */
  canCancel?: boolean;
  /** L'ultimo addebito è stato rifiutato: la carta va aggiornata. */
  needsCard?: boolean;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscription/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Portale non disponibile");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setPortalLoading(false);
    }
  }

  async function cancel() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Disdetta non riuscita");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setLoading(false);
    }
  }

  if (!confirming) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={openPortal}
            disabled={portalLoading}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ${
              needsCard
                ? "btn-gold text-white"
                : "border border-gold/30 text-ink hover:bg-gold/5"
            }`}
          >
            {portalLoading
              ? "Un attimo…"
              : needsCard
                ? "Aggiorna il metodo di pagamento"
                : "Metodo di pagamento e ricevute"}
          </button>

          {canCancel && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
            >
              Disdici l&apos;abbonamento
            </button>
          )}
        </div>

        {error && (
          <p className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ink">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-ink-soft">
        Da qui in poi non ci saranno altri addebiti. Continuerai a ricevere la preghiera fino
        alla fine del periodo che hai già pagato.
      </p>
      {error && (
        <p className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ink">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={cancel}
          disabled={loading}
          className="rounded-xl border border-ember/40 px-5 py-2.5 text-sm text-ink transition-colors hover:bg-ember/10 disabled:opacity-50"
        >
          {loading ? "Un attimo…" : "Sì, disdici"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="rounded-xl border border-gold/30 px-5 py-2.5 text-sm text-ink transition-colors hover:bg-gold/5 disabled:opacity-50"
        >
          Lascia com&apos;è
        </button>
      </div>
    </div>
  );
}
