export type { Faq, IntentionLanding, ReligionLanding } from "./types";
export {
  RELIGION_LANDINGS,
  getReligionLanding,
  landingForReligion,
} from "./religions";
export { INTENTION_LANDINGS, getIntentionLanding } from "./intentions";

import { INTENTION_LANDINGS } from "./intentions";
import { RELIGION_LANDINGS } from "./religions";

/** Base dei link canonici. Senza dominio i canonical puntano a localhost. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export const RELIGIONI_BASE = "/preghiere";
export const INTENZIONI_BASE = "/preghiera-per";

export function religionLandingPath(slug: string): string {
  return `${RELIGIONI_BASE}/${slug}`;
}

export function intentionLandingPath(slug: string): string {
  return `${INTENZIONI_BASE}/${slug}`;
}

/**
 * Link di partenza verso il form, con la provenienza attaccata.
 *
 * `da` è il parametro che l'analytics usa per attribuire la conversione alla
 * landing: senza, tutte le conversioni sembrerebbero arrivare dalla home e non
 * si potrebbe dire quale pagina funziona.
 */
export function ctaHref(opts: {
  religionId?: string;
  prayerTypeId?: string;
  language?: string;
  from: string;
}): string {
  const q = new URLSearchParams();
  if (opts.religionId) q.set("fede", opts.religionId);
  if (opts.prayerTypeId) q.set("intenzione", opts.prayerTypeId);
  if (opts.language) q.set("lingua", opts.language);
  q.set("da", opts.from);
  return `/nuova-preghiera?${q.toString()}`;
}

/** Tutti gli slug indicizzabili, per la sitemap. */
export function allLandingPaths(): string[] {
  return [
    RELIGIONI_BASE,
    INTENZIONI_BASE,
    ...RELIGION_LANDINGS.map((l) => religionLandingPath(l.slug)),
    ...INTENTION_LANDINGS.map((l) => intentionLandingPath(l.slug)),
  ];
}
