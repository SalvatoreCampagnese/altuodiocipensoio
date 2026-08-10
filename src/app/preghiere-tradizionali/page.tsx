import Link from "next/link";
import type { Metadata } from "next";
import { Candle } from "@/components/Candle";
import { JsonLd, breadcrumbLd, itemListLd } from "@/components/JsonLd";
import {
  ARCHIVE_BASE,
  archivePath,
  archiveTagPath,
  listArchive,
  listTagsWithContent,
} from "@/lib/archive";
import { siteUrl } from "@/lib/landings";
import { getReligion } from "@/lib/religions";

export const revalidate = 3600;

const TITLE = "Preghiere della tradizione — raccolta per situazione";
const DESCRIPTION =
  "Le preghiere che venti secoli hanno già scritto, ordinate per il momento in cui servono: malattia, lutto, paura, perdono, viaggio. Testo integrale, origine e uso. Gratis.";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}${ARCHIVE_BASE}`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: { title: TITLE, description: DESCRIPTION, url, type: "website", locale: "it_IT" },
  };
}

export default function ArchiveHubPage() {
  const base = siteUrl();
  const tags = listTagsWithContent();
  const prayers = listArchive();

  return (
    <div className="px-6 py-16">
      <JsonLd
        data={breadcrumbLd(base, [
          { name: "Home", path: "/" },
          { name: "Preghiere della tradizione", path: ARCHIVE_BASE },
        ])}
      />
      <JsonLd
        data={itemListLd(
          base,
          "Preghiere della tradizione",
          prayers.map((p) => ({ name: p.title, path: archivePath(p.slug) }))
        )}
      />

      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <Candle className="mx-auto h-14 w-14" />
          <h1 className="mt-8 font-display text-4xl text-ink sm:text-5xl">
            Le preghiere della tradizione
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Quasi tutto quello che c&apos;è da chiedere è già stato chiesto, spesso con parole
            migliori delle nostre. Qui trovi quelle parole ordinate per il momento in cui
            servono, con la loro origine e il modo in cui si usano davvero.
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Sono libere e gratuite. Non serve un account, e non ti chiediamo niente per
            leggerle.
          </p>
        </header>

        {/* Per situazione — è l'asse con cui la gente cerca davvero */}
        <section className="mt-16">
          <h2 className="text-center font-display text-3xl text-gold-deep">
            Che momento stai attraversando
          </h2>
          <ul className="mt-8 flex flex-wrap justify-center gap-3">
            {tags.map((t) => (
              <li key={t.slug}>
                <Link
                  href={archiveTagPath(t.slug)}
                  className="card block rounded-full px-5 py-2.5 text-sm text-ink-soft transition-transform duration-300 hover:-translate-y-0.5 hover:text-ink"
                >
                  {t.label}
                  <span className="ml-2 opacity-50">{t.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Tutte */}
        <section className="mt-20">
          <h2 className="text-center font-display text-3xl text-gold-deep">
            Tutte le preghiere
          </h2>
          <ul className="mt-8 space-y-4">
            {prayers.map((p) => {
              const religion = getReligion(p.religionId);
              return (
                <li key={p.slug}>
                  <Link
                    href={archivePath(p.slug)}
                    className="block rounded-2xl border border-gold/20 bg-paper-warm/50 p-6 transition-colors hover:border-gold/50"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl text-ink">{p.title}</h3>
                      {religion && (
                        <span className="shrink-0 text-xs uppercase tracking-wide text-ink-soft opacity-70">
                          {religion.emoji} {religion.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.origin}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-20 rounded-2xl border border-gold/20 bg-paper-warm/50 p-8 text-center">
          <h2 className="font-display text-2xl text-ink">
            E se nessuna dice la tua situazione?
          </h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-ink-soft">
            Capita: un nome, una data, una circostanza che non entra in nessuna formula già
            scritta. In quel caso possiamo comporne una su misura, nelle forme della tua
            tradizione. A pregarla, come sempre, sei tu.
          </p>
          <Link
            href="/nuova-preghiera"
            className="btn-gold mt-8 inline-block rounded-xl px-8 py-3.5 font-medium text-white"
          >
            Scrivi la tua intenzione
          </Link>
        </section>

        <p className="mt-12 text-center text-sm leading-relaxed text-ink-soft opacity-80">
          L&apos;archivio cresce lentamente e di proposito: ogni testo entra solo dopo essere
          stato confrontato con la fonte, e per le tradizioni non cristiane solo dopo il
          controllo di una persona di quella tradizione. Se ne conosci una che manca, o se
          trovi un errore,{" "}
          <Link href="/come-funziona" className="underline underline-offset-4 hover:text-ink">
            scrivici
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
