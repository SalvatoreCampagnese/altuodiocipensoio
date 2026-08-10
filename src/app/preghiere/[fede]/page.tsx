import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Candle } from "@/components/Candle";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/JsonLd";
import { LandingCta } from "@/components/LandingCta";
import {
  INTENTION_LANDINGS,
  RELIGION_LANDINGS,
  ctaHref,
  getReligionLanding,
  intentionLandingPath,
  religionLandingPath,
  siteUrl,
} from "@/lib/landings";
import { archiveByReligion, archivePath } from "@/lib/archive";
import { getReligion, languagesFor } from "@/lib/religions";
import { formatPrice, getSingle } from "@/lib/pricing";

// Rigenerate ogni ora: restano statiche per la velocità, ma il prezzo mostrato
// non resta indietro se cambi le env del listino.
export const revalidate = 3600;

export function generateStaticParams() {
  return RELIGION_LANDINGS.map((l) => ({ fede: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ fede: string }>;
}): Promise<Metadata> {
  const { fede } = await params;
  const landing = getReligionLanding(fede);
  if (!landing) return {};

  const url = `${siteUrl()}${religionLandingPath(landing.slug)}`;

  return {
    title: landing.title,
    description: landing.description,
    // Canonical autoreferenziale: obbligatorio su pagine generate da dati.
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

export default async function ReligionLandingPage({
  params,
}: {
  params: Promise<{ fede: string }>;
}) {
  const { fede } = await params;
  const landing = getReligionLanding(fede);
  if (!landing) notFound();

  const religion = getReligion(landing.religionId);
  if (!religion) notFound();

  const single = getSingle();
  const languages = languagesFor(landing.religionId);
  const base = siteUrl();

  // Tre fedi vicine, per non lasciare la pagina senza uscite laterali.
  const siblings = RELIGION_LANDINGS.filter((l) => l.slug !== landing.slug).slice(0, 3);

  // I testi d'archivio di questa tradizione. Molte fedi non ne hanno ancora:
  // la sezione semplicemente non compare, invece di mostrarsi vuota.
  const archived = archiveByReligion(landing.religionId);

  return (
    <div className="px-6 py-16">
      <JsonLd
        data={breadcrumbLd(base, [
          { name: "Home", path: "/" },
          { name: "Preghiere per tradizione", path: "/preghiere" },
          { name: religion.label, path: religionLandingPath(landing.slug) },
        ])}
      />
      <JsonLd data={faqLd(landing.faq)} />

      <div className="mx-auto max-w-2xl">
        <nav aria-label="Percorso" className="text-sm text-ink-soft">
          <Link href="/preghiere" className="transition-colors hover:text-ink">
            Preghiere per tradizione
          </Link>
          <span className="mx-2 opacity-40">›</span>
          <span className="opacity-70">{religion.label}</span>
        </nav>

        <header className="mt-10 text-center">
          <Candle className="mx-auto h-14 w-14" />
          <p className="mt-6 text-3xl" aria-hidden="true">
            {religion.emoji}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
            {landing.h1}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{landing.lede}</p>
        </header>

        <div className="mt-12 text-center">
          <LandingCta
            href={ctaHref({
              religionId: landing.religionId,
              language: languages[0]?.id,
              from: `fede:${landing.slug}`,
            })}
            landing={`fede:${landing.slug}`}
          >
            Scrivi la tua intenzione — {formatPrice(single.amountCents)}
          </LandingCta>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-gold-deep">Come si prega, qui</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{landing.howItPrays}</p>
        </section>

        {religion.traditions && religion.traditions.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl text-gold-deep">Le tradizioni</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Puoi indicare la tua: cambiano il lessico, le immagini e le formule.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {religion.traditions.map((t) => (
                <li
                  key={t.id}
                  className="rounded-full border border-gold/25 bg-paper-warm/60 px-4 py-1.5 text-sm text-ink-soft"
                >
                  {t.label}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14">
          <h2 className="font-display text-3xl text-gold-deep">La lingua</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{landing.languageNote}</p>
          {languages.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {languages.map((l) => (
                <li
                  key={l.id}
                  lang={l.id}
                  dir={l.rtl ? "rtl" : undefined}
                  className="rounded-full border border-gold/25 bg-paper-warm/60 px-4 py-1.5 text-sm text-ink-soft"
                >
                  {l.label}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl text-gold-deep">Per cosa si prega</h2>
          <div className="mt-6 space-y-6">
            {landing.intentions.map((i) => {
              // Se esiste una landing-intenzione, il link ci porta: è così che
              // i due assi si tengono insieme senza creare pagine incrociate.
              const target = INTENTION_LANDINGS.find((x) => x.prayerTypeId === i.prayerTypeId);
              return (
                <div key={i.prayerTypeId}>
                  <h3 className="font-display text-xl text-ink">
                    {target ? (
                      <Link
                        href={intentionLandingPath(target.slug)}
                        className="transition-colors hover:text-gold-deep"
                      >
                        {i.label}
                      </Link>
                    ) : (
                      i.label
                    )}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-ink-soft">{i.note}</p>
                  <Link
                    href={ctaHref({
                      religionId: landing.religionId,
                      prayerTypeId: i.prayerTypeId,
                      language: languages[0]?.id,
                      from: `fede:${landing.slug}:${i.prayerTypeId}`,
                    })}
                    className="mt-2 inline-block text-sm text-gold-deep underline underline-offset-4 transition-opacity hover:opacity-70"
                  >
                    Scrivi questa intenzione
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Le preghiere già scritte di questa tradizione, prima di proporre
            di scriverne una nuova: è l'ordine onesto, ed è anche quello che
            tiene il visitatore sul sito invece di rimandarlo su Google. */}
        {archived.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-3xl text-gold-deep">
              Le preghiere che questa tradizione ha già
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Prima di comporne una nuova, vale la pena leggere queste: sono libere, gratuite e
              per moltissime situazioni bastano.
            </p>
            <ul className="mt-6 space-y-3">
              {archived.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={archivePath(p.slug)}
                    className="block rounded-xl border border-gold/20 bg-paper-warm/40 px-5 py-4 transition-colors hover:border-gold/50"
                  >
                    <span className="font-display text-xl text-ink">{p.title}</span>
                    <span className="mt-1 block text-sm text-ink-soft">{p.origin}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

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
              religionId: landing.religionId,
              language: languages[0]?.id,
              from: `fede:${landing.slug}:fondo`,
            })}
            landing={`fede:${landing.slug}:fondo`}
          >
            Scrivi la tua intenzione — {formatPrice(single.amountCents)}
          </LandingCta>
          <p className="mt-4 text-sm text-ink-soft">
            Oppure guarda i{" "}
            <Link href="/pacchetti" className="underline underline-offset-4 hover:text-ink">
              pacchetti
            </Link>{" "}
            per una novena o un trigesimo.
          </p>
        </div>

        <section className="mt-20 border-t border-gold/15 pt-10">
          <h2 className="font-display text-2xl text-gold-deep">Altre tradizioni</h2>
          <ul className="mt-5 space-y-2">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link
                  href={religionLandingPath(s.slug)}
                  className="text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {s.h1}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/preghiere"
                className="text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
              >
                Tutte le tradizioni
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
