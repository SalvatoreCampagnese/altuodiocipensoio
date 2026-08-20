import type { MetadataRoute } from "next";
import { INTENTION_LANDINGS, PERSON_LANDINGS, RELIGION_LANDINGS, siteUrl } from "@/lib/landings";
import { intentionLandingPath, personLandingPath, religionLandingPath } from "@/lib/landings";
import { archivePath, archiveTagPath, listArchive, listTagsWithContent } from "@/lib/archive";

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
  // Il prodotto di punta, e l'unica pagina commerciale il cui contenuto
  // cambia davvero ogni giorno: la preghiera di oggi è lì dentro.
  { path: "/preghiera-del-giorno", priority: 0.95, changeFrequency: "daily" },
  // L'archivio è l'ingresso gratuito e la sezione che porta traffico: sta
  // sopra alle landing commerciali di proposito.
  { path: "/preghiere-tradizionali", priority: 0.9, changeFrequency: "weekly" },
  { path: "/preghiere", priority: 0.9, changeFrequency: "weekly" },
  { path: "/preghiera-per", priority: 0.9, changeFrequency: "weekly" },
  // La hub per persona: è l'asse con la coda lunga più larga.
  { path: "/pregare-per", priority: 0.9, changeFrequency: "weekly" },
  { path: "/nuova-preghiera", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pacchetti", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pregare-con-lintelligenza-artificiale", priority: 0.7, changeFrequency: "monthly" },
  { path: "/come-funziona", priority: 0.6, changeFrequency: "monthly" },
  { path: "/lucernario", priority: 0.6, changeFrequency: "daily" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/termini", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookie", priority: 0.1, changeFrequency: "yearly" },
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
    ...PERSON_LANDINGS.map((l) => ({
      url: `${base}${personLandingPath(l.slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // Le pagine-tag stanno sopra ai singoli testi: sono le pagine che
    // rispondono a una query («preghiera per un malato»), mentre la singola
    // preghiera risponde a una ricerca di navigazione già decisa.
    ...listTagsWithContent().map((t) => ({
      url: `${base}${archiveTagPath(t.slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...listArchive().map((p) => ({
      url: `${base}${archivePath(p.slug)}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
