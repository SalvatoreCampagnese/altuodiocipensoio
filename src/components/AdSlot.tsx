import { adSlotId, getAdsense, type AdPlacement } from "@/lib/ads";
import { AdUnit } from "./AdUnit";

/**
 * Uno spazio pubblicitario.
 *
 * Server component: decide dalle variabili d'ambiente se e cosa mostrare, così
 * spegnere gli annunci resta una variabile e un riavvio, senza rebuild.
 *
 * Non disegna nulla finché l'unità non è stata creata nel cruscotto AdSense e
 * il suo ID non è in `ADSENSE_SLOT_*`. È voluto: un `<ins>` senza
 * `data-ad-slot` non si riempie mai e lascerebbe in pagina un riquadro
 * etichettato «Pubblicità» perennemente vuoto.
 *
 * L'etichetta resta anche con AdSense. Non è più un obbligo di trasparenza
 * sul link — quello lo assolve Google con il proprio «i» — ma su un sito dove
 * si arriva con un lutto addosso è giusto che si capisca al primo sguardo
 * dove finisce il nostro contenuto e dove comincia quello di un altro.
 *
 * NOTA: con gli annunci automatici accesi — è il caso attuale — queste unità
 * non servono, perché Google piazza da sé. Compilare gli `ADSENSE_SLOT_*`
 * senza prima spegnere gli automatici darebbe entrambe le cose sulla stessa
 * pagina.
 */
export function AdSlot({
  placement,
  className = "",
}: {
  placement: AdPlacement;
  /** Ignorato: resta per compatibilità con le chiamate esistenti. */
  seed?: string;
  className?: string;
}) {
  const slot = adSlotId(placement);
  if (!slot) return null;

  const { client, testMode } = getAdsense();

  return (
    <aside
      aria-label="Contenuto pubblicitario"
      className={`rounded-2xl border border-gold/15 bg-paper-warm/40 p-4 ${className}`}
    >
      <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-ink-soft/60">
        <span className="rounded border border-ink-soft/25 px-1.5 py-0.5">Pubblicità</span>
      </p>

      <AdUnit client={client} slot={slot} testMode={testMode} />
    </aside>
  );
}
