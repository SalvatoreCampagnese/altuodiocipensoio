import { HOLDER, LEGAL_VERSION, legalDataMissing } from "@/lib/legal";

/**
 * Impaginazione comune a privacy, termini e cookie.
 *
 * L'avviso in cima quando mancano i dati del titolare è deliberatamente
 * visibile e brutto: serve a impedire che il sito vada in produzione con
 * un'informativa priva di chi la sottoscrive, che è il difetto che la rende
 * inutile. Sparisce da solo appena compili HOLDER in src/lib/legal.ts.
 */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        {legalDataMissing() && (
          <p className="mb-10 rounded-xl border border-ember/50 bg-ember/10 px-5 py-4 text-sm leading-relaxed text-ink">
            <strong>Da completare prima della pubblicazione.</strong> Mancano i dati
            identificativi del titolare (denominazione, partita IVA, sede). Compilali in{" "}
            <code className="text-xs">src/lib/legal.ts</code>: senza, questa pagina non
            soddisfa gli obblighi informativi e l&apos;informativa non ha un titolare
            individuabile.
          </p>
        )}

        <h1 className="font-display text-5xl text-ink">{title}</h1>
        {intro && <p className="mt-4 leading-relaxed text-ink-soft">{intro}</p>}
        <p className="mt-3 text-xs uppercase tracking-wide text-ink-soft/60">
          Versione {LEGAL_VERSION}
        </p>

        <div className="mt-12 space-y-10">{children}</div>

        <div className="mt-16 border-t border-gold/15 pt-8 text-sm leading-relaxed text-ink-soft">
          <p className="font-medium text-ink">Titolare</p>
          <p className="mt-2">
            {HOLDER.name || "— denominazione da inserire —"}
            {HOLDER.form && ` (${HOLDER.form})`}
            <br />
            {HOLDER.address || "— sede da inserire —"}
            <br />
            {HOLDER.vat ? `P. IVA ${HOLDER.vat}` : "— partita IVA da inserire —"}
            {HOLDER.taxCode && HOLDER.taxCode !== HOLDER.vat && ` · C.F. ${HOLDER.taxCode}`}
            {HOLDER.rea && ` · REA ${HOLDER.rea}`}
            <br />
            {HOLDER.email}
            {HOLDER.pec && ` · PEC ${HOLDER.pec}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Section({ h, children }: { h: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-2xl text-gold-deep">{h}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}
