import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { DailyPrayerUpsell } from "@/components/DailyPrayerUpsell";
import { JsonLd, breadcrumbLd, prayerLd } from "@/components/JsonLd";
import {
  ARCHIVE_BASE,
  archivePath,
  archiveTagPath,
  getArchivePrayer,
  listArchive,
  relatedArchive,
  tagsOf,
} from "@/lib/archive";
import { siteUrl } from "@/lib/landings";
import { getReligion } from "@/lib/religions";

export const revalidate = 3600;

export function generateStaticParams() {
  return listArchive().map((p) => ({ slug: p.slug }));
}

/** Meta description: origine + primo uso, che è ciò che distingue una voce dall'altra. */
function describe(origin: string, howToPray: string): string {
  const text = `${origin} ${howToPray}`;
  return text.length <= 158 ? text : `${text.slice(0, 155).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prayer = getArchivePrayer(slug);
  if (!prayer) return {};

  const url = `${siteUrl()}${archivePath(prayer.slug)}`;
  const title = `${prayer.title} — testo integrale`;
  const description = describe(prayer.origin, prayer.howToPray);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", locale: "it_IT" },
  };
}

export default async function ArchivePrayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prayer = getArchivePrayer(slug);
  if (!prayer) notFound();

  const base = siteUrl();
  const religion = getReligion(prayer.religionId);
  const tags = tagsOf(prayer);
  const related = relatedArchive(prayer);

  return (
    <div className="px-6 py-16">
      <JsonLd
        data={breadcrumbLd(base, [
          { name: "Home", path: "/" },
          { name: "Preghiere della tradizione", path: ARCHIVE_BASE },
          { name: prayer.title, path: archivePath(prayer.slug) },
        ])}
      />
      <JsonLd
        data={prayerLd(base, {
          title: prayer.title,
          path: archivePath(prayer.slug),
          description: describe(prayer.origin, prayer.howToPray),
          text: prayer.text,
          origin: prayer.origin,
        })}
      />

      <div className="mx-auto max-w-2xl">
        <nav aria-label="Percorso" className="text-sm text-ink-soft">
          <Link href={ARCHIVE_BASE} className="transition-colors hover:text-ink">
            Preghiere della tradizione
          </Link>
          <span className="mx-2 opacity-40">›</span>
          <span className="opacity-70">{prayer.title}</span>
        </nav>

        <header className="mt-10 text-center">
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
            {prayer.title}
          </h1>
          {prayer.alsoKnownAs && prayer.alsoKnownAs.length > 0 && (
            <p className="mt-3 text-sm italic text-ink-soft opacity-80">
              {prayer.alsoKnownAs.join(" · ")}
            </p>
          )}
          {religion && (
            <p className="mt-4 text-sm uppercase tracking-wide text-gold-deep">
              {religion.emoji} {religion.label}
            </p>
          )}
        </header>

        {/* Il testo. Arriva subito: è la ragione per cui si è aperta la pagina. */}
        <div className="mt-12 rounded-2xl border border-gold/25 bg-paper-warm/60 px-8 py-10">
          <p className="whitespace-pre-line text-center font-display text-2xl leading-relaxed text-ink">
            {prayer.text}
          </p>
        </div>

        <section className="mt-14">
          <h2 className="font-display text-3xl text-gold-deep">Quando si dice</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{prayer.howToPray}</p>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-3xl text-gold-deep">Da dove viene</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">{prayer.origin}</p>
        </section>

        {tags.length > 0 && (
          <section className="mt-12">
            <h2 className="sr-only">Momenti in cui si prega</h2>
            <ul className="flex flex-wrap gap-3">
              {tags.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={archiveTagPath(t.slug)}
                    className="card block rounded-full px-4 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-3xl text-gold-deep">Da leggere accanto</h2>
            <ul className="mt-6 space-y-3">
              {related.map((p) => (
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

        <div className="mt-16 rounded-2xl border border-gold/20 bg-paper-warm/50 p-8 text-center">
          <p className="leading-relaxed text-ink-soft">
            Se questa preghiera dice quello che volevi dire, l&apos;archivio ti basta — ed è
            gratuito. Se invece la tua situazione ha un nome e una data che nessuna formula
            può contenere, possiamo scriverne una nelle forme della tua tradizione.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={ARCHIVE_BASE}
              className="w-full rounded-xl border border-gold/40 bg-card px-7 py-3.5 font-medium text-ink transition-colors hover:border-gold/70 sm:w-auto"
            >
              Torna all&apos;archivio
            </Link>
            <Link
              href="/nuova-preghiera"
              className="btn-gold w-full rounded-xl px-7 py-3.5 font-medium text-white sm:w-auto"
            >
              Scrivi la tua intenzione
            </Link>
          </div>
        </div>

        {/* Chi ha appena letto una preghiera della tradizione è esattamente
            chi vorrebbe averne una ogni mattina: l'offerta sta qui, dopo il
            testo, e non sopra dove avrebbe intercettato la lettura. */}
        <DailyPrayerUpsell variant="banner" from={`archivio:${prayer.slug}`} className="mt-10" />

        <AdSlot placement="articolo" className="mt-10" />
      </div>
    </div>
  );
}
