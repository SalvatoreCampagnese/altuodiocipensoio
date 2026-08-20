import "server-only";

/**
 * Google AdSense.
 *
 * Sostituisce l'inventario di link sponsorizzati che c'era prima. Il cambio
 * non è solo di fornitore: è di natura. Un link di affiliazione non tocca il
 * browser di chi legge, mentre AdSense carica uno script di Google che
 * imposta cookie, costruisce un profilo pubblicitario e segue le persone da
 * un sito all'altro.
 *
 * Da qui discendono tre cose che NON sono opzionali.
 *
 * 1. IL CONSENSO SERVE DAVVERO. Prima non serviva un banner perché non
 *    c'erano cookie di profilazione; ora ci sono. Per il traffico SEE/UK
 *    Google stessa pretende una CMP certificata TCF — si attiva dal cruscotto
 *    AdSense in «Privacy e messaggi», non si scrive qui. Senza, Google smette
 *    di servire annunci in Europa. Vedi il README.
 * 2. LE INFORMATIVE VANNO AGGIORNATE. `/cookie`, `/privacy` e `/termini`
 *    dicono cosa succede adesso, non cosa succedeva prima.
 * 3. NON OVUNQUE. Gli slot restano quelli di prima: footer e fondo degli
 *    articoli dell'archivio. Mai accanto a una preghiera, mai nel Lucernario,
 *    mai in checkout. Attenzione: gli **annunci automatici** di AdSense
 *    ignorano questa regola e piazzano dove vogliono — se li accendi dal
 *    cruscotto, questa scelta editoriale salta.
 */

export type AdPlacement = "footer" | "articolo";

export type AdsenseConfig = {
  enabled: boolean;
  /** L'editore, nella forma `ca-pub-…`. È pubblico: sta nel tag dello script. */
  client: string;
  /** ID delle unità create nel cruscotto AdSense, uno per posizione. */
  slots: Partial<Record<AdPlacement, string>>;
  /**
   * Annunci finti invece che veri. Obbligatorio fuori produzione: caricare
   * annunci reali su localhost o in anteprima genera impression non valide,
   * ed è il modo più rapido per farsi sospendere l'account.
   */
  testMode: boolean;
};

function readBool(key: string, fallback: boolean): boolean {
  const raw = process.env[key]?.trim().toLowerCase();
  if (raw === undefined || raw === "") return fallback;
  return raw === "true" || raw === "1" || raw === "yes" || raw === "si";
}

export function getAdsense(): AdsenseConfig {
  const client = process.env.ADSENSE_CLIENT?.trim() || "ca-pub-5107049257138780";

  return {
    enabled: readBool("ADS_ENABLED", true) && /^ca-pub-\d+$/.test(client),
    client,
    slots: {
      footer: process.env.ADSENSE_SLOT_FOOTER?.trim() || undefined,
      articolo: process.env.ADSENSE_SLOT_ARTICOLO?.trim() || undefined,
    },
    // Il default segue l'ambiente: in produzione annunci veri, altrove finti.
    // Va scelto dall'ambiente e non ricordato a mano, perché è il tipo di
    // svista che si paga con l'account.
    testMode: readBool("ADSENSE_TEST_MODE", process.env.NODE_ENV !== "production"),
  };
}

/** L'unità per una posizione, se è stata configurata nel cruscotto. */
export function adSlotId(placement: AdPlacement): string | null {
  const { enabled, slots } = getAdsense();
  if (!enabled) return null;
  return slots[placement] ?? null;
}
