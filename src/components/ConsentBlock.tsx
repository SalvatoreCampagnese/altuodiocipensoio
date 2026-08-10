"use client";

import Link from "next/link";

/**
 * Informativa e consensi, subito sopra il bottone di acquisto.
 *
 * La posizione non è estetica. Il disclaimer su AI, voce sintetica e assenza
 * di affiliazione stava solo nel footer: perché sia efficace deve stare dove
 * l'utente decide di pagare, non in fondo alla pagina dopo il bottone.
 *
 * Nessuna casella è pre-spuntata, e sono separate fra loro: un consenso ai
 * dati particolari (art. 9 GDPR) non può essere raccolto insieme
 * all'accettazione dei termini in un'unica spunta, perché non sarebbe né
 * specifico né distinguibile.
 */

export type ConsentState = {
  specialData: boolean;
  terms: boolean;
  thirdParty: boolean;
  immediate: boolean;
};

export const EMPTY_CONSENT: ConsentState = {
  specialData: false,
  terms: false,
  thirdParty: false,
  immediate: false,
};

/** In modalità bundle i consensi sono già stati dati all'acquisto del pacchetto. */
export function consentComplete(c: ConsentState, mode: "checkout" | "redeem"): boolean {
  if (mode === "redeem") return c.thirdParty;
  return c.specialData && c.terms && c.thirdParty && c.immediate;
}

function Check({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 accent-[color:var(--gold-deep,#a1791f)]"
      />
      <span>{children}</span>
    </label>
  );
}

export function ConsentBlock({
  value,
  onChange,
  mode = "checkout",
}: {
  value: ConsentState;
  onChange: (next: ConsentState) => void;
  mode?: "checkout" | "redeem";
}) {
  const set = (patch: Partial<ConsentState>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5 rounded-2xl border border-gold/25 bg-paper-warm/50 p-5">
      <div className="space-y-2 text-sm leading-relaxed text-ink-soft">
        <p className="font-medium text-ink">Prima di procedere</p>
        <p>
          Il testo è composto con l&apos;assistenza dell&apos;intelligenza artificiale e
          recitato da una <strong>voce sintetica</strong>: non interviene alcuna persona,
          nessun sacerdote, imam, rabbino o monaco.
        </p>
        <p>
          Il servizio <strong>non è affiliato</strong> ad alcuna istituzione o autorità
          religiosa e non sostituisce riti officiati, sacramenti, accompagnamento pastorale,
          sostegno psicologico o cure mediche.
        </p>
      </div>

      <div className="space-y-3 border-t border-gold/15 pt-4">
        {mode === "checkout" && (
          <Check checked={value.specialData} onChange={(v) => set({ specialData: v })}>
            Acconsento espressamente al trattamento dei dati che rivelano le mie convinzioni
            religiose e degli eventuali dati sulla salute che inserisco, per il solo scopo di
            comporre e consegnarmi la preghiera (art. 9 par. 2 lett. a GDPR). Posso revocare
            il consenso in ogni momento.
          </Check>
        )}

        <Check checked={value.thirdParty} onChange={(v) => set({ thirdParty: v })}>
          Se inserisco dati riferiti ad altre persone — il nome di un malato, di un defunto o
          del destinatario — dichiaro di avere titolo per farlo e di averle informate quando
          ciò è dovuto.
        </Check>

        {mode === "checkout" && (
          <>
            <Check checked={value.immediate} onChange={(v) => set({ immediate: v })}>
              Chiedo che il servizio sia eseguito <strong>subito</strong> e prendo atto che, a
              esecuzione completata, perderò il diritto di recesso (art. 59 comma 1 lett. o
              del Codice del Consumo).
            </Check>

            <Check checked={value.terms} onChange={(v) => set({ terms: v })}>
              Ho letto l&apos;
              <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-ink">
                informativa privacy
              </Link>{" "}
              e accetto i{" "}
              <Link href="/termini" target="_blank" className="underline underline-offset-2 hover:text-ink">
                termini e condizioni
              </Link>
              .
            </Check>
          </>
        )}

        {mode === "redeem" && (
          <p className="text-xs leading-relaxed text-ink-soft/70">
            I consensi al trattamento li hai già prestati acquistando il pacchetto.
          </p>
        )}
      </div>
    </div>
  );
}
