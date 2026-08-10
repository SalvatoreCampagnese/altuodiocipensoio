import type { Faq } from "@/lib/landings";

/**
 * Dati strutturati per le landing.
 *
 * Sono l'unico modo che Google ha di capire che le FAQ in fondo alla pagina
 * sono FAQ, e che la pagina sta dentro una gerarchia. Vanno serviti nell'HTML
 * iniziale, quindi questo resta un componente server.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // I contenuti sono nostri e statici: nessun input utente finisce qui.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function breadcrumbLd(
  siteUrl: string,
  trail: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: `${siteUrl}${step.path}`,
    })),
  };
}

/**
 * Elenco ordinato di pagine — hub e pagine-tag dell'archivio.
 *
 * Dichiara a Google che la pagina è un indice e non un contenuto sottile:
 * senza, una lista di link viene letta come thin content.
 */
export function itemListLd(
  siteUrl: string,
  name: string,
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${siteUrl}${item.path}`,
    })),
  };
}

/**
 * Una preghiera dell'archivio.
 *
 * `CreativeWork` e non `Article`: il testo non è nostro, è tradizione. Il
 * `dateCreated` non c'è di proposito — datare al giorno del deploy una
 * preghiera del III secolo sarebbe un dato falso.
 */
export function prayerLd(
  siteUrl: string,
  prayer: { title: string; path: string; description: string; text: string; origin: string }
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: prayer.title,
    headline: prayer.title,
    url: `${siteUrl}${prayer.path}`,
    description: prayer.description,
    text: prayer.text,
    genre: "Preghiera",
    inLanguage: "it",
    isAccessibleForFree: true,
    creditText: prayer.origin,
  };
}

export function faqLd(faq: Faq[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
