/**
 * Landing indicizzabili.
 *
 * Due assi separati, mai incrociati:
 *  - per tradizione   →  /preghiere/[slug]
 *  - per intenzione   →  /preghiera-per/[slug]
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
