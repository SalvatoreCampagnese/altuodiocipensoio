import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Candle } from "@/components/Candle";
import { JsonLd, breadcrumbLd, itemListLd } from "@/components/JsonLd";
import {
  ARCHIVE_BASE,
  archiveByTag,
  archivePath,
  archiveTagPath,
  getTag,
  listTagsWithContent,
} from "@/lib/archive";
import { siteUrl } from "@/lib/landings";
import { getReligion } from "@/lib/religions";

export const revalidate = 3600;

export function generateStaticParams() {
  return listTagsWithContent().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const found = getTag(tag);
  if (!found) return {};

  const url = `${siteUrl()}${archiveTagPath(found.slug)}`;
  return {
    title: found.h1,
    description: found.description,
    alternates: { canonical: url },
    openGraph: {
      title: found.h1,
      description: found.description,
      url,
      type: "website",
      locale: "it_IT",
    },
  };
}

export default async function ArchiveTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const found = getTag(tag);
  if (!found) notFound();

  const prayers = archiveByTag(found.slug);
  // Un tag senza testi sarebbe una pagina vuota indicizzata: meglio un 404.
  if (prayers.length === 0) notFound();

  const base = siteUrl();
  const siblings = listTagsWithContent().filter((t) => t.slug !== found.slug);

  return (
    <div className="px-6 py-16">
      <JsonLd
        data={breadcrumbLd(base, [
          { name: "Home", path: "/" },
          { name: "Preghiere della tradizione", path: ARCHIVE_BASE },
          { name: found.h1, path: archiveTagPath(found.slug) },
        ])}
      />
      <JsonLd
        data={itemListLd(
          base,
          found.h1,
          prayers.map((p) => ({ name: p.title, path: archivePath(p.slug) }))
        )}
      />

      <div className="mx-auto max-w-2xl">
        <nav aria-label="Percorso" className="text-sm text-ink-soft">
          <Link href={ARCHIVE_BASE} className="transition-colors hover:text-ink">
            Preghiere della tradizione
          </Link>
          <span className="mx-2 opacity-40">›</span>
          <span className="opacity-70">{found.label}</span>
        </nav>

        <header className="mt-10 text-center">
          <Candle className="mx-auto h-14 w-14" />
          <h1 className="mt-8 text-balance font-display text-4xl leading-tight text-ink sm:text-5xl">
            {found.h1}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{found.lede}</p>
        </header>

        <ul className="mt-14 space-y-5">
          {prayers.map((p) => {
            const religion = getReligion(p.religionId);
            return (
              <li key={p.slug}>
                <Link
                  href={archivePath(p.slug)}
                  className="block rounded-2xl border border-gold/20 bg-paper-warm/50 p-6 transition-colors hover:border-gold/50"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="font-display text-2xl text-ink">{p.title}</h2>
                    {religion && (
                      <span className="shrink-0 text-xs uppercase tracking-wide text-ink-soft opacity-70">
                        {religion.emoji}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 whitespace-pre-line font-display text-lg leading-relaxed text-ink-soft">
                    {p.text.split("\n\n")[0]}
                  </p>
                  <p className="mt-3 text-sm text-gold-deep">Testo integrale →</p>
                </Link>
              </li>
            );
          })}
        </ul>

        <section className="mt-16 rounded-2xl border border-gold/20 bg-paper-warm/50 p-8 text-center">
          <p className="leading-relaxed text-ink-soft">
            Nessuna di queste dice la tua situazione? Un nome, una data, una circostanza che
            non entra in nessuna formula: in quel caso possiamo scriverne una su misura, nelle
            forme della tua tradizione. A pregarla sei tu.
          </p>
          <Link
            href="/nuova-preghiera"
            className="btn-gold mt-8 inline-block rounded-xl px-8 py-3.5 font-medium text-white"
          >
            Scrivi la tua intenzione
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="text-center font-display text-2xl text-gold-deep">Altri momenti</h2>
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {siblings.map((t) => (
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
      </div>
    </div>
  );
}
