import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Candle } from "@/components/Candle";
import { DailyPrayerUpsell } from "@/components/DailyPrayerUpsell";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/JsonLd";
import { LandingCta } from "@/components/LandingCta";
import { Reveal } from "@/components/Reveal";
import { archivePath, archiveTagPath, getArchivePrayer, getTag } from "@/lib/archive";
import {
  PERSONE_BASE,
  PERSON_LANDINGS,
  ctaHref,
  getPersonLanding,
  personLandingPath,
  siteUrl,
} from "@/lib/landings";
import { formatPrice, getSingle } from "@/lib/pricing";

export function generateStaticParams() {
  return PERSON_LANDINGS.map((l) => ({ persona: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}): Promise<Metadata> {
  const { persona } = await params;
  const landing = getPersonLanding(persona);
  if (!landing) return {};

  return {
    title: landing.title,
    description: landing.description,
    // Ogni pagina dichiara il proprio indirizzo definitivo: senza, i parametri
    // di attribuzione (`?da=`) sparsi per il sito genererebbero varianti dello
    // stesso contenuto e Google dovrebbe indovinare quale indicizzare.
    alternates: { canonical: personLandingPath(landing.slug) },
    openGraph: {
      title: landing.title,
      description: landing.description,
      type: "article",
      locale: "it_IT",
      url: `${siteUrl()}${personLandingPath(landing.slug)}`,
    },
  };
}

export default async function PersonLandingPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const landing = getPersonLanding(persona);
  if (!landing) notFound();

  const single = getSingle();
  const base = siteUrl();

  // I testi della tradizione che valgono qui. Sono link interni verso
  // l'archivio, cioè verso le pagine che oggi ricevono già impression: è la
  // parte del sito che Google conosce, e da cui conviene far passare autorità.
  const prayers = landing.archiveSlugs
    .map((slug) => getArchivePrayer(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const tag = getTag(landing.tagSlug);
  const related = landing.related
    .map((slug) => getPersonLanding(slug))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="px-6 py-14">
      <div className="mx-auto max-w-2xl">
        <JsonLd
          data={breadcrumbLd(base, [
            { name: "Home", path: "/" },
            { name: "Per chi pregare", path: PERSONE_BASE },
            { name: landing.h1, path: personLandingPath(landing.slug) },
          ])}
        />
        <JsonLd data={faqLd(landing.faq)} />

        <nav aria-label="Percorso" className="text-xs text-ink-soft/70">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href={PERSONE_BASE} className="hover:text-ink">
            Per chi pregare
          </Link>
        </nav>

        <header className="mt-8">
          <Candle className="h-12 w-12" />
          <h1 className="mt-6 text-balance font-display text-4xl leading-tight text-ink sm:text-5xl">
            {landing.h1}
          </h1>
          <p className="mt-5 text-balance text-lg leading-relaxed text-ink-soft">{landing.lede}</p>
        </header>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-gold-deep">Quando si cerca</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{landing.when}</p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl text-gold-deep">Perché è difficile</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{landing.difficulty}</p>
        </section>

        {/* Prima l'archivio gratuito, poi l'offerta. L'ordine non è una
            cortesia: chi cerca «preghiera per mia madre» quasi sempre vuole
            un testo da leggere adesso, e dargli prima un prezzo è il modo
            più rapido per rimandarlo indietro in SERP. */}
        {prayers.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-2xl text-gold-deep">
              Le preghiere della tradizione che valgono qui
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Testo integrale, origine e modo d&apos;uso di ciascuna. Sono libere e gratuite,
              senza registrarsi.
            </p>
            <ul className="mt-6 space-y-3">
              {prayers.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={archivePath(p.slug)}
                    className="card block rounded-xl p-5 transition-colors hover:border-gold/45"
                  >
                    <span className="font-display text-xl text-ink">{p.title}</span>
                    <span className="mt-1 block text-sm text-ink-soft">{p.origin}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {tag && (
              <p className="mt-5 text-sm">
                <Link
                  href={archiveTagPath(tag.slug)}
                  className="text-gold-deep underline underline-offset-4"
                >
                  Tutte le {tag.h1.toLowerCase()}
                </Link>
              </p>
            )}
          </section>
        )}

        <section className="mt-14 rounded-2xl border border-gold/25 bg-paper-warm/50 p-8 text-center">
          <h2 className="font-display text-2xl text-ink">
            Se nessuna di queste dice la tua situazione
          </h2>
          <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-soft">
            Le formule della tradizione valgono per tutti, e per questo non nominano nessuno.
            Se ti serve un testo con il suo nome dentro, possiamo scriverlo.
          </p>
          <div className="mt-8">
            <LandingCta
              href={ctaHref({
                prayerTypeId: landing.prayerTypeId,
                from: `persona:${landing.slug}`,
              })}
              landing={`persona:${landing.slug}`}
            >
              Scrivi la tua intenzione — {formatPrice(single.amountCents)}
            </LandingCta>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl text-gold-deep">Domande</h2>
          <dl className="mt-6 space-y-6">
            {landing.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-xl text-ink">{f.q}</dt>
                <dd className="mt-1.5 leading-relaxed text-ink-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <DailyPrayerUpsell variant="banner" from={`persona:${landing.slug}`} className="mt-14" />

        {related.length > 0 && (
          <section className="mt-16 border-t border-gold/15 pt-10">
            <h2 className="font-display text-2xl text-gold-deep">Anche per</h2>
            <ul className="mt-5 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  {/* Il testo del link è il titolo della pagina di
                      destinazione: chi legge sa dove va prima di cliccare, e
                      Google ricava da qui di cosa tratta quella pagina. */}
                  <Link
                    href={personLandingPath(r.slug)}
                    className="text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    {r.h1}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={PERSONE_BASE}
                  className="text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
                >
                  Tutte le persone per cui si prega
                </Link>
              </li>
            </ul>
          </section>
        )}

        <AdSlot placement="articolo" className="mt-14" />
      </div>
    </div>
  );
}
