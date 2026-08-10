"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

/**
 * Il bottone che porta dalla landing al form.
 *
 * Serve a una cosa sola che un `<Link>` normale non fa: segnare da quale
 * landing è partito il clic. Senza questo evento tutte le conversioni
 * sembrerebbero nascere in `/nuova-preghiera` e non si potrebbe dire quale
 * pagina funziona — che è il motivo per cui le landing esistono.
 *
 * L'attribuzione viaggia anche nell'URL (`?da=`), così sopravvive al giro sul
 * checkout Stripe: vedi trackConversion() in src/lib/track.ts.
 */
export function LandingCta({
  href,
  landing,
  children,
}: {
  href: string;
  /** Identificatore della landing, es. `fede:islamica` o `intenzione:la-guarigione`. */
  landing: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() => track("cta_landing", { landing })}
      className="inline-block rounded-xl btn-gold px-8 py-4 font-medium text-white"
    >
      {children}
    </Link>
  );
}
