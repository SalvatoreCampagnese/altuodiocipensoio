import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Candle } from "@/components/Candle";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/JsonLd";
import { LandingCta } from "@/components/LandingCta";
import {
  INTENTION_LANDINGS,
  ctaHref,
  getIntentionLanding,
  intentionLandingPath,
  landingForReligion,
  religionLandingPath,
  siteUrl,
} from "@/lib/landings";
import { getReligion } from "@/lib/religions";
import { formatPrice, getSingle } from "@/lib/pricing";

export const revalidate = 3600;

export function generateStaticParams() {
  return INTENTION_LANDINGS.map((l) => ({ intenzione: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ intenzione: string }>;
}): Promise<Metadata> {
  const { intenzione } = await params;
  const landing = getIntentionLanding(intenzione);
  if (!landing) return {};

  const url = `${siteUrl()}${intentionLandingPath(landing.slug)}`;

  return {
    title: landing.title,
    description: landing.description,
    alternates: { canonical: url },
    openGraph: {
      title: landing.title,
      description: landing.description,
      url,
      type: "article",
      locale: "it_IT",
    },
  };
}

export default async function IntentionLandingPage({
  params,
}: {
  params: Promise<{ intenzione: string }>;
}) {
  const { intenzione } = await params;
  const landing = getIntentionLanding(intenzione);
  if (!landing) notFound();

  const single = getSingle();
  const base = siteUrl();
  const siblings = INTENTION_LANDINGS.filter((l) => l.slug !== landing.slug).slice(0, 4);

  return (
    <div className="px-6 py-16">
      <JsonLd
        data={breadcrumbLd(base, [
          { name: "Home", path: "/" },
          { name: "Preghiere per intenzione", path: "/preghiera-per" },
          { name: landing.h1, path: intentionLandingPath(landing.slug) },
        ])}
      />
      <JsonLd data={faqLd(landing.faq)} />

      <div className="mx-auto max-w-2xl">
        <nav aria-label="Percorso" className="text-sm text-ink-soft">
          <Link href="/preghiera-per" className="transition-colors hover:text-ink">
            Preghiere per intenzione
          </Link>
          <span className="mx-2 opacity-40">›</span>
          <span className="opacity-70">{landing.h1}</span>
        </nav>

        <header className="mt-10 text-center">
          <Candle className="mx-auto h-14 w-14" />
          <h1 className="mt-8 font-display text-4xl leading-tight text-ink sm:text-5xl">
            {landing.h1}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{landing.lede}</p>
        </header>

        <div className="mt-12 text-center">
          <LandingCta
            href={ctaHref({
              prayerTypeId: landing.prayerTypeId,
              from: `intenzione:${landing.slug}`,
            })}
            landing={`intenzione:${landing.slug}`}
          >
            Scrivi la tua intenzione — {formatPrice(single.amountCents)}
          </LandingCta>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-gold-deep">Quando serve</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{landing.when}</p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl text-gold-deep">
            Come la dicono le diverse tradizioni
          </h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            La stessa necessità prende forme molto diverse. Scegli quella in cui ti riconosci.
          </p>
          <div className="mt-8 space-y-7">
            {landing.acrossFaiths.map((f) => {
              const religion = getReligion(f.religionId);
              const target = landingForReligion(f.religionId);
              if (!religion) return null;

              return (
                <div key={f.religionId}>
                  <h3 className="font-display text-xl text-ink">
                    <span className="mr-2" aria-hidden="true">
                      {religion.emoji}
                    </span>
                    {target ? (
                      <Link
                        href={religionLandingPath(target.slug)}
                        className="transition-colors hover:text-gold-deep"
                      >
                        {religion.label}
                      </Link>
                    ) : (
                      religion.label
                    )}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">{f.note}</p>
                  <Link
                    href={ctaHref({
                      religionId: f.religionId,
                      prayerTypeId: landing.prayerTypeId,
                      from: `intenzione:${landing.slug}:${f.religionId}`,
                    })}
                    className="mt-2 inline-block text-sm text-gold-deep underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    Scrivila in questa tradizione
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-sm text-ink-soft">
            Non trovi la tua?{" "}
            <Link href="/preghiere" className="underline underline-offset-4 hover:text-ink">
              Sono disponibili quindici tradizioni
            </Link>
            , più una versione laica.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl text-gold-deep">Domande</h2>
          <dl className="mt-6 space-y-6">
            {landing.faq.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-xl text-ink">{f.q}</dt>
                <dd className="mt-1.5 leading-relaxed text-ink-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-16 text-center">
          <LandingCta
            href={ctaHref({
              prayerTypeId: landing.prayerTypeId,
              from: `intenzione:${landing.slug}:fondo`,
            })}
            landing={`intenzione:${landing.slug}:fondo`}
          >
            Scrivi la tua intenzione — {formatPrice(single.amountCents)}
          </LandingCta>
        </div>

        <section className="mt-20 border-t border-gold/15 pt-10">
          <h2 className="font-display text-2xl text-gold-deep">Altre intenzioni</h2>
          <ul className="mt-5 space-y-2">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link
                  href={intentionLandingPath(s.slug)}
                  className="text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {s.h1}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
