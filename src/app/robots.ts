import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/landings";

/**
 * robots.txt
 *
 * Le pagine private sono già `noindex` nei rispettivi metadata, che è il
 * segnale che conta davvero: un Disallow qui impedisce la scansione ma NON
 * l'indicizzazione, e una pagina bloccata da robots può finire in SERP lo
 * stesso se qualcuno la linka. Il Disallow serve a non sprecare crawl budget
 * su percorsi che non porteranno mai traffico.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/preghiera/", // link privati alle preghiere generate
          // Si apre con un token che sta nelle email degli abbonati: è una
          // pagina personale, e scansionarla non porterebbe nulla.
          "/preghiera-del-giorno/gestisci",
          "/grazie",
          "/auth/",
        ],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
