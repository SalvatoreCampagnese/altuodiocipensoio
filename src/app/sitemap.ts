import type { MetadataRoute } from "next";
import { INTENTION_LANDINGS, RELIGION_LANDINGS, siteUrl } from "@/lib/landings";
import { intentionLandingPath, religionLandingPath } from "@/lib/landings";

/**
 * Sitemap.
 *
 * Contiene solo ciò che ha senso in SERP. Restano fuori di proposito le
 * pagine già marcate noindex — `/preghiera/[id]` (privata), `/dashboard`,
 * `/grazie` — perché una sitemap che elenca URL noindex manda a Google due
 * segnali opposti.
 */

/** Pagine scritte a mano, con la priorità che gli diamo. */
const STATIC: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/preghiere", priority: 0.9, changeFrequency: "weekly" },
  { path: "/preghiera-per", priority: 0.9, changeFrequency: "weekly" },
  { path: "/nuova-preghiera", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pacchetti", priority: 0.8, changeFrequency: "monthly" },
  { path: "/come-funziona", priority: 0.6, changeFrequency: "monthly" },
  { path: "/lucernario", priority: 0.6, changeFrequency: "daily" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();

  // Le landing cambiano quando cambia il contenuto in src/lib/landings/, cioè
  // a ogni deploy: la data di build è il lastmod onesto che abbiamo.
  const lastModified = new Date();

  return [
    ...STATIC.map((s) => ({
      url: `${base}${s.path}`,
      lastModified,
      changeFrequency: s.changeFrequency,
      priority: s.priority,
    })),
    ...RELIGION_LANDINGS.map((l) => ({
      url: `${base}${religionLandingPath(l.slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...INTENTION_LANDINGS.map((l) => ({
      url: `${base}${intentionLandingPath(l.slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
