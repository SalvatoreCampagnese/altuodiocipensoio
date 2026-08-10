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
