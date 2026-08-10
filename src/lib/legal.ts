/**
 * Dati legali del servizio, in un posto solo.
 *
 * Privacy, termini, cookie e footer leggono tutti da qui: se i dati del
 * titolare cambiano, si toccano in un punto e non in quattro pagine.
 *
 * ATTENZIONE — i campi marcati TODO non sono inventabili. Un'informativa che
 * dichiara una partita IVA sbagliata è peggio di una che non la dichiara,
 * perché è una dichiarazione falsa invece di una omissione. Finché restano
 * vuoti, `legalDataMissing()` è true e le pagine mostrano un avviso visibile
 * invece di far finta che vada tutto bene.
 */

export const LEGAL_VERSION = "2026-08-10";

export type Holder = {
  /** Denominazione o nome e cognome se ditta individuale. */
  name: string;
  /** Forma giuridica, es. "ditta individuale" o "S.r.l.". */
  form: string;
  vat: string;
  /** Codice fiscale, se diverso dalla P.IVA. */
  taxCode: string;
  address: string;
  /** REA/registro imprese, se iscritto. */
  rea: string;
  email: string;
  pec: string;
};

export const HOLDER: Holder = {
  name: "", // TODO
  form: "", // TODO
  vat: "", // TODO
  taxCode: "", // TODO
  address: "", // TODO
  rea: "", // facoltativo
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@altuodiocipensoio.com",
  pec: "", // TODO
};

/** Manca qualcosa di obbligatorio per gli obblighi informativi e-commerce. */
export function legalDataMissing(): boolean {
  return !HOLDER.name || !HOLDER.vat || !HOLDER.address;
}

/**
 * Fornitori che trattano dati per conto nostro.
 *
 * `country` e `safeguard` vanno confermati sul contratto di ciascun fornitore
 * prima di pubblicare: la regione di un progetto Supabase, per esempio, la
 * decide chi lo crea e non è deducibile dal codice.
 */
export type SubProcessor = {
  name: string;
  purpose: string;
  /** Cosa riceve davvero, non cosa potrebbe ricevere. */
  data: string;
  country: string;
  safeguard: string;
};

export const SUB_PROCESSORS: SubProcessor[] = [
  {
    name: "Supabase",
    purpose: "Banca dati, autenticazione e archiviazione dei file audio",
    data: "Email, contenuto della preghiera, ordini, file audio",
    country: "Da confermare: dipende dalla regione del progetto",
    safeguard: "Clausole contrattuali standard (DPA del fornitore)",
  },
  {
    name: "Stripe",
    purpose: "Incasso dei pagamenti",
    data: "Email, importo, dati della carta (che non transitano da noi)",
    country: "Irlanda / Stati Uniti",
    safeguard: "Clausole contrattuali standard",
  },
  {
    name: "OpenAI",
    purpose: "Composizione del testo della preghiera",
    data: "Intenzione, tradizione, tipo, eventuale nome del destinatario. Non l'email, non i dati di pagamento",
    country: "Stati Uniti",
    safeguard: "Clausole contrattuali standard; nessun addestramento sui dati API",
  },
  {
    name: "ElevenLabs",
    purpose: "Sintesi vocale del testo",
    data: "Il testo della preghiera già composto",
    country: "Stati Uniti",
    safeguard: "Clausole contrattuali standard",
  },
  {
    name: "Resend",
    purpose: "Invio dell'email con la preghiera",
    data: "Email del destinatario e link alla preghiera",
    country: "Stati Uniti",
    safeguard: "Clausole contrattuali standard",
  },
  {
    name: "Vercel",
    purpose: "Hosting del sito e statistiche di traffico aggregate",
    data: "Log tecnici, indirizzo IP, pagine viste. Le statistiche non usano cookie né profilano",
    country: "Stati Uniti",
    safeguard: "Clausole contrattuali standard",
  },
];

/** Quanto conserviamo le cose, e perché quel termine e non un altro. */
export const RETENTION = [
  {
    what: "Preghiere, intenzioni e file audio",
    how: "Finché tieni l'account, o finché non ci chiedi di cancellarle",
    why: "Sono il bene che hai acquistato: restano disponibili nel tuo archivio",
  },
  {
    what: "Dati fiscali dell'ordine (importo, data, identificativo Stripe)",
    how: "10 anni",
    why: "Obbligo civilistico e fiscale, art. 2220 c.c. Restano anche se cancelli l'account",
  },
  {
    what: "Prova del consenso al trattamento dei dati particolari",
    how: "Quanto l'ordine cui si riferisce",
    why: "Obbligo di dimostrare il consenso, art. 7 par. 1 GDPR",
  },
  {
    what: "Log tecnici del server",
    how: "Il tempo di conservazione del fornitore di hosting",
    why: "Sicurezza e diagnosi dei malfunzionamenti",
  },
];

/** Autorità di controllo a cui ci si può rivolgere. */
export const AUTHORITY = {
  name: "Garante per la protezione dei dati personali",
  url: "https://www.garanteprivacy.it",
  address: "Piazza Venezia 11, 00187 Roma",
};
