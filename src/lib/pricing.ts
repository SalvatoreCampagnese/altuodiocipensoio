import "server-only";

/**
 * Catalogo prodotti. Tutto configurabile da variabili d'ambiente: prezzo,
 * numero di preghiere, ritmo di sblocco, attivazione e Price ID di Stripe.
 *
 * I valori qui sotto sono i default: cambiando solo il .env cambi il listino
 * senza toccare il codice.
 */

export type Cadence = "instant" | "daily" | "monthly" | "subscription";
export type ProductId = "single" | "novena" | "year" | "trigesimo";

export type Product = {
  id: ProductId;
  name: string;
  tagline: string;
  description: string;
  /** Quante preghiere include. 1 = acquisto diretto, >1 = pacchetto a crediti. */
  credits: number;
  /** Come si sbloccano i crediti: subito, una al giorno o una al mese. */
  cadence: Cadence;
  amountCents: number;
  stripePriceId?: string;
  enabled: boolean;
  /** Evidenziato nelle griglie di prezzo. */
  featured: boolean;
};

type ProductDefaults = Omit<Product, "amountCents" | "stripePriceId" | "enabled"> & {
  amountCents: number;
};

const DEFAULTS: Record<ProductId, ProductDefaults> = {
  single: {
    id: "single",
    name: "Una preghiera",
    tagline: "Per un momento preciso",
    description: "Una preghiera personalizzata, scritta e recitata a voce.",
    credits: 1,
    cadence: "instant",
    amountCents: 290,
    featured: false,
  },
  novena: {
    id: "novena",
    name: "Novena",
    tagline: "Nove giorni consecutivi",
    description:
      "Nove preghiere, una al giorno per nove giorni: la devozione insistente dei momenti difficili.",
    credits: 9,
    cadence: "daily",
    amountCents: 1490,
    featured: true,
  },
  year: {
    id: "year",
    name: "L'anno",
    tagline: "Una al mese, per dodici mesi",
    description:
      "Dodici preghiere, una al mese. Ogni volta scegli tradizione, intenzione e destinatario.",
    credits: 12,
    cadence: "monthly",
    amountCents: 1990,
    featured: false,
  },
  trigesimo: {
    id: "trigesimo",
    name: "Trigesimo",
    tagline: "Trenta giorni di memoria",
    description:
      "Trenta preghiere, una al giorno per un mese intero. Per accompagnare chi non c'è più.",
    credits: 30,
    cadence: "daily",
    amountCents: 3990,
    featured: false,
  },
};

const PRODUCT_IDS = Object.keys(DEFAULTS) as ProductId[];

function envKey(id: ProductId, suffix: string): string {
  return `PRODUCT_${id.toUpperCase()}_${suffix}`;
}

function readInt(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function readBool(key: string, fallback: boolean): boolean {
  const raw = process.env[key]?.trim().toLowerCase();
  if (raw === undefined || raw === "") return fallback;
  return raw === "true" || raw === "1" || raw === "yes" || raw === "si";
}

function readCadence(key: string, fallback: Cadence): Cadence {
  const raw = process.env[key]?.trim().toLowerCase();
  return raw === "instant" || raw === "daily" || raw === "monthly" ? raw : fallback;
}

function build(id: ProductId): Product {
  const d = DEFAULTS[id];
  return {
    ...d,
    name: process.env[envKey(id, "NAME")]?.trim() || d.name,
    amountCents: readInt(envKey(id, "CENTS"), d.amountCents),
    credits: Math.max(1, readInt(envKey(id, "CREDITS"), d.credits)),
    cadence: readCadence(envKey(id, "CADENCE"), d.cadence),
    stripePriceId: process.env[envKey(id, "STRIPE_PRICE")]?.trim() || undefined,
    // La singola non si può spegnere: è il prodotto base del servizio.
    enabled: id === "single" ? true : readBool(envKey(id, "ENABLED"), true),
    featured: readBool(envKey(id, "FEATURED"), d.featured),
  };
}

export function getProduct(id: string): Product | undefined {
  if (!PRODUCT_IDS.includes(id as ProductId)) return undefined;
  const product = build(id as ProductId);
  return product.enabled ? product : undefined;
}

/** Tutti i prodotti attivi, dal più economico al più caro. */
export function listProducts(): Product[] {
  return PRODUCT_IDS.map(build)
    .filter((p) => p.enabled)
    .sort((a, b) => a.amountCents - b.amountCents);
}

/** I soli pacchetti multi-preghiera (esclude la singola). */
export function listBundles(): Product[] {
  return listProducts().filter((p) => p.credits > 1);
}

export function getSingle(): Product {
  return build("single");
}

/** "2,90 €" — formato italiano, senza decimali inutili sulle cifre tonde. */
export function formatPrice(amountCents: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
  }).format(amountCents / 100);
}

/** Prezzo a preghiera, per mostrare il vantaggio dei pacchetti. */
export function pricePerPrayer(product: Product): string {
  return formatPrice(Math.round(product.amountCents / product.credits));
}

/** Quanto si risparmia rispetto ad acquistare tutto a prezzo singolo. */
export function savingsVsSingle(product: Product): number {
  return Math.max(0, getSingle().amountCents * product.credits - product.amountCents);
}

/** Versione serializzabile da passare ai client component. */
export type PublicProduct = {
  id: ProductId;
  name: string;
  tagline: string;
  description: string;
  credits: number;
  cadence: Cadence;
  price: string;
  perPrayer: string;
  savings: string | null;
  featured: boolean;
};

/**
 * Minuti dichiarati all'utente per avere la preghiera pronta.
 * Il tempo reale è di 20-40 secondi (OpenAI + ElevenLabs): qui si promette
 * con margine, così la promessa regge anche quando i fornitori rallentano.
 */
export function getEtaMinutes(): number {
  return Math.max(1, readInt("GENERATION_ETA_MINUTES", 2));
}

/* ---------------------------------------------------------------------------
 * Preghiera del Giorno — l'abbonamento
 *
 * Il prodotto di punta, e l'unico ricorrente del catalogo. Il prezzo si
 * annuncia al giorno perché è così che l'utente lo pesa ("meno di un caffè"),
 * ma si addebita a periodo: 0,70 € incassati ogni giorno lascerebbero a Stripe
 * circa il 38 % dell'incasso, contro il 6,5 % di un addebito settimanale.
 *
 * Le due cifre non devono divergere: `amountCents` si calcola da
 * `perDayCents × daysPerPeriod`, e si può forzare solo di proposito.
 * ------------------------------------------------------------------------- */

export type SubInterval = "day" | "week" | "month";

/** Quanti giorni di preghiera copre un addebito, per ciascun ritmo. */
const DAYS_PER_INTERVAL: Record<SubInterval, number> = { day: 1, week: 7, month: 30 };

export type Subscription = {
  id: "quotidiana";
  name: string;
  tagline: string;
  description: string;
  /** Il prezzo che si annuncia: 70 = 0,70 € al giorno. */
  perDayCents: number;
  /** Il prezzo che si addebita davvero, una volta per periodo. */
  amountCents: number;
  interval: SubInterval;
  daysPerPeriod: number;
  /** Giorni di prova gratuita prima del primo addebito. 0 = nessuna. */
  trialDays: number;
  /** Ora di Roma in cui arriva l'email. Cambiarla richiede anche la 009. */
  deliveryHour: number;
  stripePriceId?: string;
  enabled: boolean;
};

export function getDailySubscription(): Subscription {
  const interval = readInterval("SUB_DAILY_INTERVAL", "week");
  const perDayCents = Math.max(1, readInt("SUB_DAILY_PER_DAY_CENTS", 70));
  const daysPerPeriod = DAYS_PER_INTERVAL[interval];

  // Stripe rifiuta gli addebiti sotto i 50 centesimi: con un ritmo
  // giornaliero e un prezzo basso si finirebbe sotto soglia senza accorgersene.
  const computed = Math.max(50, perDayCents * daysPerPeriod);

  return {
    id: "quotidiana",
    name: process.env.SUB_DAILY_NAME?.trim() || "La Preghiera del Giorno",
    tagline: "Ogni mattina alle 9, nella tua email",
    description:
      "Una preghiera nuova ogni giorno, composta all'alba e la stessa per tutti quelli che la ricevono. " +
      "Non devi scrivere niente, non devi ricordarti niente: arriva e basta.",
    perDayCents,
    amountCents: readInt("SUB_DAILY_CENTS", computed),
    interval,
    daysPerPeriod,
    trialDays: readInt("SUB_DAILY_TRIAL_DAYS", 0),
    deliveryHour: Math.min(23, readInt("SUB_DAILY_HOUR", 9)),
    stripePriceId: process.env.SUB_DAILY_STRIPE_PRICE?.trim() || undefined,
    enabled: readBool("SUB_DAILY_ENABLED", true),
  };
}

function readInterval(key: string, fallback: SubInterval): SubInterval {
  const raw = process.env[key]?.trim().toLowerCase();
  return raw === "day" || raw === "week" || raw === "month" ? raw : fallback;
}

/** "a settimana" — come si dice il ritmo dell'addebito in italiano. */
export function intervalLabel(interval: SubInterval): string {
  return { day: "al giorno", week: "a settimana", month: "al mese" }[interval];
}

/** Versione serializzabile per i client component. */
export type PublicSubscription = {
  id: "quotidiana";
  name: string;
  tagline: string;
  description: string;
  /** "0,70 €" — il prezzo che si annuncia. */
  perDay: string;
  /** "4,90 €" — il prezzo che si addebita. */
  price: string;
  /** "a settimana" */
  every: string;
  /** "4,90 € a settimana" — già montato, per non doverlo rifare ovunque. */
  billing: string;
  trialDays: number;
  deliveryHour: number;
  enabled: boolean;
};

export function toPublicSubscription(sub: Subscription): PublicSubscription {
  return {
    id: sub.id,
    name: sub.name,
    tagline: sub.tagline,
    description: sub.description,
    perDay: formatPrice(sub.perDayCents),
    price: formatPrice(sub.amountCents),
    every: intervalLabel(sub.interval),
    billing: `${formatPrice(sub.amountCents)} ${intervalLabel(sub.interval)}`,
    trialDays: sub.trialDays,
    deliveryHour: sub.deliveryHour,
    enabled: sub.enabled,
  };
}

/* ---------------------------------------------------------------------------
 * Lucernario — importo libero per accendere una candela
 * ------------------------------------------------------------------------- */

export type LucernarioConfig = {
  enabled: boolean;
  /** Quante candele ci sono nella parete. */
  slots: number;
  /** Per quante ore resta accesa una candela. */
  hours: number;
  /** Importo minimo accettato (Stripe non scende sotto 0,50 €). */
  minCents: number;
  maxCents: number;
  /** Importi proposti come scorciatoia. */
  suggestedCents: number[];
};

export function getLucernario(): LucernarioConfig {
  const suggested = (process.env.LUCERNARIO_SUGGESTED || "200,500,1000,2000")
    .split(",")
    .map((v) => Number.parseInt(v.trim(), 10))
    .filter((v) => Number.isFinite(v) && v > 0);

  return {
    enabled: readBool("LUCERNARIO_ENABLED", true),
    slots: Math.max(1, readInt("LUCERNARIO_SLOTS", 50)),
    hours: Math.max(1, readInt("LUCERNARIO_HOURS", 24)),
    minCents: Math.max(50, readInt("LUCERNARIO_MIN_CENTS", 100)),
    maxCents: readInt("LUCERNARIO_MAX_CENTS", 100000),
    suggestedCents: suggested.length ? suggested : [200, 500, 1000, 2000],
  };
}

export function toPublic(product: Product): PublicProduct {
  const savings = savingsVsSingle(product);
  return {
    id: product.id,
    name: product.name,
    tagline: product.tagline,
    description: product.description,
    credits: product.credits,
    cadence: product.cadence,
    price: formatPrice(product.amountCents),
    perPrayer: pricePerPrayer(product),
    savings: savings > 0 ? formatPrice(savings) : null,
    featured: product.featured,
  };
}
