/**
 * Archivio delle preghiere della tradizione.
 *
 * È la parte gratuita del servizio, e la sua ragione non è solo commerciale:
 * la stragrande maggioranza delle situazioni della vita ha già la sua
 * preghiera, scritta secoli fa e meglio di come la scriveremmo noi. Un testo
 * su misura serve solo quando nessuna formula esistente dice la tua.
 *
 * Due regole per chi aggiunge un testo:
 *
 *  1. NON SI TRASCRIVE A MEMORIA. Ogni testo entra con una fonte controllata
 *     e nasce `da-rivedere`. Passa a `verificata` solo quando qualcuno l'ha
 *     confrontato con l'originale — e, per le tradizioni non cristiane, solo
 *     dopo il controllo di una persona di quella tradizione. Un versetto
 *     storpiato qui vale più danno di cento pagine non scritte.
 *
 *  2. NIENTE PARAFRASI. Se il testo esatto non è disponibile o i diritti di
 *     traduzione non sono chiari, la voce resta `da-rivedere` e fuori dal
 *     sito. Non si "avvicina" una preghiera.
 */

/** Solo le `verificata` vengono servite: vedi `listArchive()`. */
export type ReviewStatus = "verificata" | "da-rivedere";

export type ArchivePrayer = {
  /** Slug in URL. Deve restare stabile: è l'indirizzo indicizzato. */
  slug: string;
  title: string;
  /** Nomi alternativi con cui la gente la cerca: il latino, l'incipit. */
  alsoKnownAs?: string[];
  /** Chiave in RELIGIONS (src/lib/religions.ts). */
  religionId: string;
  /** Secolo, autore, libro liturgico. Una riga, senza sbrodolare. */
  origin: string;
  /** Il testo. Paragrafi separati da riga vuota. Nessun markdown. */
  text: string;
  /** Quando e come si prega: il contesto d'uso, non il commento teologico. */
  howToPray: string;
  /** Slug dei tag in TAGS. Da 1 a 4: se ne servono di più, sono sbagliati. */
  tags: string[];
  status: ReviewStatus;
  /** Da dove viene il testo e chi l'ha controllato. Obbligatorio sempre. */
  sourceNote: string;
};

export type ArchiveTag = {
  slug: string;
  /** Come si chiama nell'interfaccia. */
  label: string;
  /** <h1> della pagina-tag e <title>: è la query, scritta come si cerca. */
  h1: string;
  description: string;
  /** Apertura della pagina-tag. Deve valere da sola, senza l'elenco sotto. */
  lede: string;
};
