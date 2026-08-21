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
 * 3. LE POSIZIONI LE SCEGLIE GOOGLE. Il sito ha gli **annunci automatici**
 *    accesi: lo script sta nel layout, Google decide da sé dove piazzare, e
 *    lo fa ovunque — anche accanto a una preghiera acquistata, nel Lucernario
 *    e in checkout. Non è un effetto collaterale da correggere: è una scelta
 *    del titolare, presa sapendo cosa comporta, e /termini, /cookie e
 *    /privacy la dichiarano per quello che è invece di promettere posizioni
 *    che non possiamo garantire.
 *
 *    `AdSlot` qui sotto resta per la strada opposta — unità piazzate a mano,
 *    solo dove decidiamo noi — e serve il giorno in cui si spengono gli
 *    annunci automatici per riprendere il controllo delle posizioni. Finché
 *    restano accesi non va compilato: darebbe entrambe le cose sulla stessa
 *    pagina, cioè il doppio degli annunci.
 */

export type AdPlacement = "footer" | "articolo";

export type AdblockNotice = {
  enabled: boolean;
  /** Per quanti giorni tacere dopo che l'utente ha chiuso l'avviso. */
  dismissDays: number;
  /** Secondi da aspettare prima di misurare, per non accusare una rete lenta. */
  delaySeconds: number;
};

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

/**
 * L'avviso a chi ha un blocco pubblicità.
 *
 * `dismissDays` alto di proposito: un avviso che ricompare a ogni pagina non
 * è un invito, è un fastidio, e su un sito dove si arriva con un lutto
 * addosso diventa una cattiveria. Chiesto una volta, poi si tace per un mese.
 */
export function getAdblockNotice(): AdblockNotice {
  return {
    // Non ha senso senza pubblicità da bloccare.
    enabled: getAdsense().enabled && readBool("ADBLOCK_NOTICE_ENABLED", true),
    dismissDays: Math.max(1, readInt("ADBLOCK_NOTICE_DISMISS_DAYS", 30)),
    delaySeconds: Math.max(1, readInt("ADBLOCK_NOTICE_DELAY_SECONDS", 3)),
  };
}

function readInt(key: string, fallback: number): number {
  const raw = Number.parseInt(process.env[key] || "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : fallback;
}

/** L'unità per una posizione, se è stata configurata nel cruscotto. */
export function adSlotId(placement: AdPlacement): string | null {
  const { enabled, slots } = getAdsense();
  if (!enabled) return null;
  return slots[placement] ?? null;
}
