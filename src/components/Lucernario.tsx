"use client";

import { useMemo, useState } from "react";
import { VotiveCandle } from "./VotiveCandle";

export type PublicSlot = {
  slot: number;
  lit: boolean;
  donorName: string | null;
  intention: string | null;
  remaining: string | null;
};

export type LucernarioProps = {
  slots: PublicSlot[];
  hours: number;
  minCents: number;
  suggestedCents: number[];
  defaultEmail?: string;
};

function euro(cents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function Lucernario({
  slots,
  hours,
  minCents,
  suggestedCents,
  defaultEmail = "",
}: LucernarioProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [amount, setAmount] = useState<string>(String(suggestedCents[1] ?? minCents) );
  const [custom, setCustom] = useState("");
  const [donorName, setDonorName] = useState("");
  const [intention, setIntention] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const litCount = useMemo(() => slots.filter((s) => s.lit).length, [slots]);
  const freeCount = slots.length - litCount;

  const amountCents = custom
    ? Math.round(Number.parseFloat(custom.replace(", ", ".")) * 100)
    : Number.parseInt(amount, 10);

  async function offer(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!selected) {
      setError("Scegli prima una candela dalla parete.");
      return;
    }
    if (!Number.isFinite(amountCents) || amountCents < minCents) {
      setError(`L'importo minimo è di ${euro(minCents)}.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/lucernario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot: selected,
          amountCents,
          donorName: donorName.trim() || null,
          intention: intention.trim() || null,
          email: email.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Pagamento non riuscito");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore imprevisto");
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Contatore */}
      <p className="text-center text-sm text-ink-soft">
        <strong className="font-medium text-gold-deep">{litCount}</strong> candele accese
        <span className="mx-2 opacity-40">·</span>
        {freeCount > 0 ? `${freeCount} ancora spente` : "la parete è tutta accesa"}
      </p>

      {/* La parete */}
      <div className="mt-8 rounded-3xl border border-gold/20 bg-gradient-to-b from-[#fffaf0] to-[#f7f0e2] p-6 shadow-inner sm:p-10">
        <div className="grid grid-cols-5 justify-items-center gap-x-2 gap-y-5 sm:grid-cols-8 sm:gap-x-3 lg:grid-cols-10">
          {slots.map((s) => {
            const isSelected = selected === s.slot;
            const label = s.lit
              ? `Candela ${s.slot}, accesa${s.donorName ? ` da ${s.donorName}` : ""}${
                  s.remaining ? `, ${s.remaining}` : ""
                }`
              : `Candela ${s.slot}, spenta — accendila`;

            return (
              <button
                key={s.slot}
                type="button"
                disabled={s.lit}
                onClick={() => setSelected(s.slot)}
                title={label}
                aria-label={label}
                aria-pressed={isSelected}
                className={`group relative rounded-xl p-1 transition-all duration-300 ${
                  s.lit
                    ? "cursor-default"
                    : "cursor-pointer hover:-translate-y-1 hover:bg-gold/8"
                } ${isSelected ? "-translate-y-1 bg-gold/12 ring-2 ring-gold" : ""}`}
              >
                <VotiveCandle lit={s.lit} selected={isSelected} className="h-14 w-10" />
                <span className="mt-0.5 block text-[10px] text-ink-soft/60">{s.slot}</span>

                {/* Chi ha acceso questa candela */}
                {s.lit && (s.donorName || s.intention) && (
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden w-48 -translate-x-1/2 rounded-lg bg-ink px-3 py-2 text-left text-xs leading-snug text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover:block group-hover:opacity-100">
                    {s.donorName && <strong className="block">{s.donorName}</strong>}
                    {s.intention && <span className="block opacity-90">{s.intention}</span>}
                    {s.remaining && (
                      <span className="mt-1 block text-gold-soft">{s.remaining}</span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Acquisto */}
      <form onSubmit={offer} className="card mx-auto mt-10 max-w-xl rounded-2xl p-7">
        <h2 className="font-display text-2xl text-ink">
          {selected ? `Accendi la candela n. ${selected}` : "Scegli una candela"}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {selected
            ? `Resterà accesa ${hours} ore. Decidi tu quanto: non c'è un importo giusto.`
            : "Tocca una candela spenta nella parete qui sopra, poi scegli l'importo."}
        </p>

        <fieldset className="mt-6" disabled={!selected}>
          <legend className="sr-only">Quanto vuoi spendere</legend>
          <div className="flex flex-wrap gap-2">
            {suggestedCents.map((c) => {
              const active = !custom && Number.parseInt(amount, 10) === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setAmount(String(c));
                    setCustom("");
                  }}
                  className={`rounded-xl border px-5 py-2.5 font-medium transition-all duration-200 disabled:opacity-40 ${
                    active
                      ? "border-gold bg-gold/12 text-gold-deep"
                      : "border-gold/25 text-ink hover:border-gold/60 hover:bg-gold/5"
                  }`}
                >
                  {euro(c)}
                </button>
              );
            })}

            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="altro"
                aria-label="Importo libero in euro"
                className={`w-28 rounded-xl border px-4 py-2.5 pr-8 outline-none transition-colors ${
                  custom ? "border-gold bg-gold/8" : "border-gold/25"
                }`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
                €
              </span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-ink-soft">
                Il tuo nome <span className="opacity-50">(facoltativo)</span>
              </span>
              <input
                className="field"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Come vuoi comparire"
                maxLength={60}
              />
            </label>

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
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm text-ink-soft">
              Per chi la accendi <span className="opacity-50">(facoltativo, visibile a tutti)</span>
            </span>
            <input
              className="field"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="Per mia madre Anna"
              maxLength={280}
            />
          </label>
        </fieldset>

        {error && (
          <p className="mt-5 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ink">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !selected}
          className="btn-gold mt-6 w-full rounded-xl py-4 text-lg font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading
            ? "Un attimo…"
            : selected
              ? `Accendi la candela${Number.isFinite(amountCents) && amountCents > 0 ? ` — ${euro(amountCents)}` : ""}`
              : "Scegli una candela"}
        </button>

        <p className="mt-4 text-center text-xs leading-relaxed text-ink-soft/80">
          Importo libero tramite Stripe. Nessun rinnovo, nessun addebito futuro.
        </p>
      </form>
    </div>
  );
}
