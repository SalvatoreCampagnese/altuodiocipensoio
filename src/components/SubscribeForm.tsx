"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import {
  ConsentBlock,
  EMPTY_CONSENT,
  consentComplete,
  type ConsentState,
} from "@/components/ConsentBlock";
import type { PublicSubscription } from "@/lib/pricing";
import { rememberLanding } from "@/lib/track";

/**
 * L'iscrizione alla Preghiera del Giorno.
 *
 * Un campo e tre spunte: è il prodotto con l'attrito più basso del catalogo,
 * perché a differenza del su misura non c'è niente da scrivere — nessuna
 * intenzione da formulare nel momento in cui, di solito, non si trovano le
 * parole. È anche il motivo per cui è l'offerta di punta.
 */
export function SubscribeForm({
  sub,
  defaultEmail = "",
  from = "diretto",
  compact = false,
}: {
  sub: PublicSubscription;
  defaultEmail?: string;
  /** Da dove parte l'iscrizione, per sapere quali pagine convertono. */
  from?: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [consent, setConsent] = useState<ConsentState>(EMPTY_CONSENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>(null);

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!consentComplete(consent, "abbonamento")) {
      setError("Per procedere devi spuntare tutte le dichiarazioni qui sopra.");
      return;
    }

    setLoading(true);
    rememberLanding(from);
    track("abbonamento_avviato", { da: from });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent, from }),
      });
      const data = await res.json();

      // Già abbonato: il messaggio utile non è "errore", è il link per
      // andare dove può vedere e gestire quello che ha già.
      if (res.status === 409 && data.manageUrl) {
        setError(
          <>
            Questo indirizzo riceve già la preghiera del giorno.{" "}
            <Link href={data.manageUrl} className="font-medium underline underline-offset-2">
              Gestisci l&apos;abbonamento
            </Link>
            .
          </>
        );
        setLoading(false);
        return;
      }

      if (!res.ok || !data.url) throw new Error(data.error ?? "Iscrizione non disponibile");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={subscribe} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm text-ink-soft">
          Dove vuoi ricevere la preghiera ogni mattina
        </span>
        <input
          type="email"
          className="field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@esempio.it"
          autoComplete="email"
          required
        />
      </label>

      <ConsentBlock value={consent} onChange={setConsent} mode="abbonamento" />

      {error && (
        <p className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`btn-gold w-full rounded-xl font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
          compact ? "py-3" : "py-4 text-lg"
        }`}
      >
        {loading ? "Un attimo…" : `Comincia — ${sub.perDay} al giorno`}
      </button>

      {/* Il prezzo si annuncia al giorno ma si addebita a periodo: dirlo qui,
          sotto al bottone e prima di Stripe, è ciò che evita la sorpresa
          sull'estratto conto — che è poi la prima causa di contestazione. */}
      <p className="text-center text-xs leading-relaxed text-ink-soft/80">
        {sub.perDay} al giorno, addebitati <strong className="font-medium">{sub.billing}</strong>{" "}
        con Stripe.
        {sub.trialDays > 0 && ` I primi ${sub.trialDays} giorni sono gratuiti.`} Si rinnova da
        solo finché non disdici — e disdire è un clic, dal link in fondo a ogni email.
      </p>
    </form>
  );
}
