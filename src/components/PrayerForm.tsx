"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, RELIGIONS, TONES } from "@/lib/religions";
import { rememberLanding, trackCheckoutStarted } from "@/lib/track";
import {
  ConsentBlock,
  EMPTY_CONSENT,
  consentComplete,
  type ConsentState,
} from "@/components/ConsentBlock";

type Mode = "checkout" | "redeem";

const INTENTION_MAX = 1500;

/**
 * Le precompilazioni arrivano da un URL, quindi da chiunque: si accettano solo
 * se corrispondono a qualcosa che esiste davvero nel catalogo. Un valore
 * inventato non deve mettere il form in uno stato impossibile.
 */
function validReligion(id?: string): string {
  return RELIGIONS.some((r) => r.id === id) ? id! : RELIGIONS[0].id;
}

function validPrayerType(religionId: string, typeId?: string): string {
  const religion = RELIGIONS.find((r) => r.id === religionId)!;
  return religion.prayerTypes.some((t) => t.id === typeId)
    ? typeId!
    : religion.prayerTypes[0].id;
}

function validLanguage(id?: string): string {
  return LANGUAGES.some((l) => l.id === id) ? id! : "it";
}

export function PrayerForm({
  mode = "checkout",
  defaultEmail = "",
  lockEmail = false,
  productId = "single",
  priceLabel = "",
  etaMinutes = 2,
  initialReligion,
  initialPrayerType,
  initialLanguage,
  landing,
}: {
  mode?: Mode;
  defaultEmail?: string;
  lockEmail?: boolean;
  /** Prodotto da acquistare quando mode = "checkout". */
  productId?: string;
  /** Prezzo già formattato, mostrato sul bottone. */
  priceLabel?: string;
  /** Minuti dichiarati per la consegna. */
  etaMinutes?: number;
  /** Precompilazioni che arrivano dalle landing (`?fede=`, `?intenzione=`, `?lingua=`). */
  initialReligion?: string;
  initialPrayerType?: string;
  initialLanguage?: string;
  /** Landing di provenienza (`?da=`), per attribuire la conversione. */
  landing?: string;
}) {
  const router = useRouter();

  const firstReligion = validReligion(initialReligion);

  const [religionId, setReligionId] = useState(firstReligion);
  const [tradition, setTradition] = useState("");
  const [prayerType, setPrayerType] = useState(
    validPrayerType(firstReligion, initialPrayerType)
  );
  const [intention, setIntention] = useState("");
  const [recipient, setRecipient] = useState("");
  const [language, setLanguage] = useState(validLanguage(initialLanguage));
  const [tone, setTone] = useState<string>("solenne");
  const [scheduledFor, setScheduledFor] = useState("");
  const [email, setEmail] = useState(defaultEmail);

  // Parcheggia la provenienza: fra qui e la conversione c'è il checkout di
  // Stripe, che porta l'utente fuori dal sito e azzera tutto lo stato.
  useEffect(() => {
    if (landing) rememberLanding(landing);
  }, [landing]);

  const [consent, setConsent] = useState<ConsentState>(EMPTY_CONSENT);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const religion = useMemo(
    () => RELIGIONS.find((r) => r.id === religionId)!,
    [religionId]
  );

  function onReligionChange(next: string) {
    const r = RELIGIONS.find((x) => x.id === next)!;
    setReligionId(next);
    setTradition("");
    // I tipi di preghiera cambiano con la tradizione: tieni il tipo se esiste ancora.
    if (!r.prayerTypes.some((t) => t.id === prayerType)) {
      setPrayerType(r.prayerTypes[0].id);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (intention.trim().length < 10) {
      setError("Scrivi almeno una frase sulla tua intenzione.");
      return;
    }

    // Il server rifiuta comunque una richiesta senza consensi (`consentSchema`
    // accetta solo `true`): questo controllo serve a dare un messaggio utile
    // invece di un 400 secco.
    if (!consentComplete(consent, mode)) {
      setError("Per procedere devi spuntare tutte le dichiarazioni qui sopra.");
      return;
    }

    setSubmitting(true);

    const draft = {
      religion: religionId,
      tradition: tradition || null,
      prayer_type: prayerType,
      intention: intention.trim(),
      recipient_name: recipient.trim() || null,
      language,
      tone,
      scheduled_for: scheduledFor ? new Date(scheduledFor).toISOString() : null,
      email: email.trim(),
    };

    try {
      if (mode === "redeem") {
        const res = await fetch("/api/bundle/redeem", {
          method: "POST",
          headers: {"Content-Type":"application/json" },
          body: JSON.stringify(draft),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Qualcosa è andato storto");
        router.push(`/preghiera/${data.prayerId}?token=${data.token}`);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({ productId, draft, consent }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout non disponibile");

      // Ultimo evento prima di perdere l'utente su Stripe: se poi non torna,
      // il divario fra questo e `conversione` dice quanti si fermano al pagamento.
      trackCheckoutStarted({ productId, religion: religionId });

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message :"Errore imprevisto");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* 1 — Religione */}
      <fieldset className="rounded-2xl border border-gold/15 bg-card p-6">
        <legend className="px-2 font-display text-xl text-gold-deep">1 · La tua fede</legend>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-ink-soft">Tradizione religiosa</span>
            <select
              className="field"
              value={religionId}
              onChange={(e) => onReligionChange(e.target.value)}
            >
              {RELIGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.emoji} {r.label}
                </option>
              ))}
            </select>
          </label>

          {religion.traditions && (
            <label className="block">
              <span className="mb-2 block text-sm text-ink-soft">
                Ramo o rito <span className="opacity-50">(facoltativo)</span>
              </span>
              <select
                className="field"
                value={tradition}
                onChange={(e) => setTradition(e.target.value)}
              >
                <option value="">Non specifico</option>
                {religion.traditions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </fieldset>

      {/* 2 — Tipo di preghiera */}
      <fieldset className="rounded-2xl border border-gold/15 bg-card p-6">
        <legend className="px-2 font-display text-xl text-gold-deep">2 · Che preghiera serve</legend>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {religion.prayerTypes.map((t) => {
            const active = prayerType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setPrayerType(t.id)}
                aria-pressed={active}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  active
                    ?"border-gold bg-gold/10"
                    :"border-gold/15 hover:border-gold/40 hover:bg-white/[0.02]"
                }`}
              >
                <span className="block text-sm font-medium text-ink">{t.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-ink-soft">{t.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* 3 — Intenzione */}
      <fieldset className="rounded-2xl border border-gold/15 bg-card p-6">
        <legend className="px-2 font-display text-xl text-gold-deep">3 · La tua intenzione</legend>

        <label className="mt-4 block">
          <span className="mb-2 block text-sm text-ink-soft">
            Scrivi con parole tue. Nomi, situazioni, dettagli: finiranno nel testo.
          </span>
          <textarea
            className="field min-h-[160px] resize-y"
            maxLength={INTENTION_MAX}
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder="Mia madre Anna entra in sala operatoria giovedì mattina. Ha paura e io sono all'estero per lavoro, non riesco a starle vicino. Vorrei che qualcuno pregasse per lei mentre la operano."
            required
          />
          <span className="mt-2 block text-right text-xs text-ink-soft/60">
            {intention.length} / {INTENTION_MAX}
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-ink-soft">
              Per chi è <span className="opacity-50">(facoltativo)</span>
            </span>
            <input
              className="field"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Anna"
              maxLength={80}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-ink-soft">
              Quando non potrai pregare <span className="opacity-50">(facoltativo)</span>
            </span>
            <input
              type="datetime-local"
              className="field"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
            />
          </label>
        </div>
      </fieldset>

      {/* 4 — Voce */}
      <fieldset className="rounded-2xl border border-gold/15 bg-card p-6">
        <legend className="px-2 font-display text-xl text-gold-deep">4 · Come va recitata</legend>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-ink-soft">Tono</span>
            <select className="field" value={tone} onChange={(e) => setTone(e.target.value)}>
              {TONES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} — {t.hint}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-ink-soft">Lingua</span>
            <select
              className="field"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      {/* 5 — Email */}
      {!lockEmail && (
        <fieldset className="rounded-2xl border border-gold/15 bg-card p-6">
          <legend className="px-2 font-display text-xl text-gold-deep">5 · Dove te la mandiamo</legend>
          <label className="mt-4 block">
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
        </fieldset>
      )}

      {/* Sopra il bottone, non nel footer: è qui che si decide di pagare. */}
      <ConsentBlock value={consent} onChange={setConsent} mode={mode} />

      {error && (
        <p className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ink">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl btn-gold py-4 text-lg font-medium text-white  disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting
          ?"Un attimo…"
          : mode === "redeem"
            ?"Usa una preghiera del bundle"
            : `Vai al pagamento${priceLabel ? ` — ${priceLabel}` : ""}`}
      </button>

      {mode === "checkout" && (
        <p className="text-center text-xs text-ink-soft/60">
          Pagamento sicuro con Stripe. La preghiera è pronta entro {etaMinutes}{" "}
          {etaMinutes === 1 ? "minuto" : "minuti"} e ti arriva anche via email.
        </p>
      )}
    </form>
  );
}
