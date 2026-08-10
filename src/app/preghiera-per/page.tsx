import Link from "next/link";
import type { Metadata } from "next";
import { Candle } from "@/components/Candle";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { INTENTION_LANDINGS, intentionLandingPath, siteUrl } from "@/lib/landings";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}/preghiera-per`;
  return {
    title: "Preghiere per intenzione — guarigione, lutto, esami, lavoro",
    description:
      "Una preghiera per ciò che ti serve davvero: la guarigione di una persona cara, un defunto, un esame, il lavoro, la pace interiore. In quindici tradizioni religiose.",
    alternates: { canonical: url },
    openGraph: { title: "Preghiere per intenzione", url, type: "website", locale: "it_IT" },
  };
}

export default function IntentionsHubPage() {
  const base = siteUrl();

  return (
    <div className="px-6 py-16">
      <JsonLd
        data={breadcrumbLd(base, [
          { name: "Home", path: "/" },
          { name: "Preghiere per intenzione", path: "/preghiera-per" },
        ])}
      />

      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <Candle className="mx-auto h-14 w-14" />
          <h1 className="mt-8 font-display text-4xl text-ink sm:text-5xl">
            Preghiere per intenzione
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Quasi nessuno arriva qui cercando una religione: si arriva cercando qualcosa. Una
            persona che sta male, un lutto che non passa, un esame domani, un lavoro che non
            arriva. Parti da lì — la tradizione la scegli dopo.
          </p>
        </header>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {INTENTION_LANDINGS.map((l) => (
            <li key={l.slug}>
              <Link
                href={intentionLandingPath(l.slug)}
                className="block h-full rounded-2xl border border-gold/20 bg-paper-warm/50 p-6 transition-colors hover:border-gold/50"
              >
                <h2 className="font-display text-2xl text-ink">{l.h1}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{l.lede}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center leading-relaxed text-ink-soft">
          Preferisci partire dalla tua fede?{" "}
          <Link href="/preghiere" className="underline underline-offset-4 hover:text-ink">
            Le preghiere per tradizione
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
