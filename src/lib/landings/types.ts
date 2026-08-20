/**
 * Landing indicizzabili.
 *
 * Tre assi separati, mai incrociati:
 *  - per tradizione   →  /preghiere/[slug]         — in quale fede si prega
 *  - per intenzione   →  /preghiera-per/[slug]     — per COSA si prega
 *  - per persona      →  /pregare-per/[slug]       — per CHI si prega
 *
 * I due `per` si somigliano nell'URL e vanno tenuti distinti nella testa:
 * `/preghiera-per/la-guarigione` è una situazione, `/pregare-per/mia-madre`
 * è una relazione. Chi cerca la prima ha un problema; chi cerca la seconda ha
 * una persona, ed è un modo diverso di arrivare qui.
 *
 * Il prodotto cartesiano (15 fedi × 12 intenzioni = 210 pagine) è
 * deliberatamente escluso: sarebbero 15 varianti dello stesso testo con il
 * nome della fede sostituito, cioè il pattern che la policy Scaled Content
 * Abuse di Google colpisce dal 2024. L'incrocio vive come *sezione* dentro
 * la pagina della tradizione, dove ha contenuto suo.
 *
 * Regola per chi aggiunge una landing: se il testo che stai scrivendo
 * funzionerebbe anche per un'altra fede cambiando due parole, non scriverlo.
 */

export type Faq = { q: string; a: string };

export type ReligionLanding = {
  /** Slug in URL. Deve restare stabile: è l'indirizzo indicizzato. */
  slug: string;
  /** Chiave in RELIGIONS (src/lib/religions.ts). */
  religionId: string;
  /** <title>. Sotto i 60 caratteri per non farsi troncare in SERP. */
  title: string;
  /** Meta description. 140-160 caratteri. */
  description: string;
  h1: string;
  /** Apertura: la frase che deve convincere in tre secondi. */
  lede: string;
  /**
   * Come prega davvero questa tradizione. È la sezione che rende la pagina
   * unica: formule, nomi del divino, struttura dell'orazione, chiusure.
   */
  howItPrays: string;
  /** Perché la lingua conta per questa fede, e quale usiamo. */
  languageNote: string;
  /** Le intenzioni più richieste in questa tradizione, con taglio suo. */
  intentions: { prayerTypeId: string; label: string; note: string }[];
  faq: Faq[];
};

/**
 * Una landing per persona: per chi si prega, non per cosa.
 *
 * È l'asse con la coda lunga più larga — «preghiera per mia madre malata»,
 * «preghiera per un figlio lontano» — e nel 2026 anche quello con i
 * concorrenti più deboli: su quelle query arrivano in prima pagina post di
 * Facebook, thread di Reddit e siti stranieri tradotti a macchina.
 *
 * Proprio perché sono tante, il rischio è di scriverle a stampo e ricadere
 * nella Scaled Content Abuse. I due campi che lo impediscono sono `when` e
 * `difficulty`: se sono intercambiabili fra due pagine, quelle due pagine
 * sono la stessa pagina e una va cancellata. `difficulty` in particolare
 * chiede cosa rende difficile pregare per QUESTA persona — e pregare per una
 * madre malata non somiglia a pregare per un figlio che non ti parla più.
 */
export type PersonLanding = {
  slug: string;
  /** Raggruppamento nella hub. */
  group: "genitori" | "figli" | "coppia" | "famiglia" | "vicini" | "malattia" | "fatiche";
  title: string;
  description: string;
  h1: string;
  lede: string;
  /** Il momento preciso in cui si cerca questa pagina. Unico per pagina. */
  when: string;
  /** Cosa rende difficile pregare per questa persona. Unico per pagina. */
  difficulty: string;
  /** Preghiere dell'archivio che valgono davvero qui: slug in ARCHIVE. */
  archiveSlugs: string[];
  /** Tag dell'archivio verso cui mandare per approfondire. */
  tagSlug: string;
  /** Tipo di preghiera con cui precompilare il form. */
  prayerTypeId: string;
  /** Altre pagine-persona vicine. Slug di questo stesso elenco. */
  related: string[];
  faq: Faq[];
};

export type IntentionLanding = {
  slug: string;
  /** Chiave in prayerTypes, per precompilare il form. */
  prayerTypeId: string;
  title: string;
  description: string;
  h1: string;
  lede: string;
  /** In quale momento della vita si cerca questa preghiera. */
  when: string;
  /**
   * Come tradizioni diverse trattano QUESTA intenzione. È ciò che distingue
   * una pagina-intenzione da una pagina-fede, e le pagine-intenzione fra loro.
   */
  acrossFaiths: { religionId: string; note: string }[];
  faq: Faq[];
};
