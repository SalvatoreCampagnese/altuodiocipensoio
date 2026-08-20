import Link from "next/link";
import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { Candle } from "@/components/Candle";
import { DailyPrayerUpsell } from "@/components/DailyPrayerUpsell";
import { JsonLd, breadcrumbLd, itemListLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { ARCHIVE_BASE } from "@/lib/archive";
import { PERSONE_BASE, personGroups, personLandingPath, siteUrl } from "@/lib/landings";

export const metadata: Metadata = {
  title: "Per chi pregare — 52 preghiere per le persone che contano",
  description:
    "Preghiere per una madre, un figlio, un malato, chi non c'è più. Testi della tradizione gratuiti e una preghiera scritta sulla tua situazione.",
  alternates: { canonical: PERSONE_BASE },
};

export default function PeopleHubPage() {
  const groups = personGroups();
  const base = siteUrl();
  const all = groups.flatMap((g) => g.items);

  return (
    <div className="px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <JsonLd
          data={breadcrumbLd(base, [
            { name: "Home", path: "/" },
            { name: "Per chi pregare", path: PERSONE_BASE },
          ])}
        />
        {/* Dichiara che questa è una pagina indice e non un testo sottile:
            senza, un elenco di link viene letto come thin content. */}
        <JsonLd
          data={itemListLd(
            base,
            "Per chi pregare",
            all.map((l) => ({ name: l.h1, path: personLandingPath(l.slug) }))
          )}
        />

        <header className="text-center">
          <Candle className="mx-auto h-14 w-14" />
          <h1 className="mt-7 text-balance font-display text-5xl leading-tight text-ink sm:text-6xl">
            Per chi vuoi pregare?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance leading-relaxed text-ink-soft">
            Quasi nessuno prega in astratto: si prega per qualcuno, con un nome e una
            situazione. Qui sotto ci sono {all.length} persone diverse per cui la gente cerca
            una preghiera, con i testi della tradizione che valgono per ciascuna.
          </p>
        </header>

        <div className="mt-16 space-y-12">
          {groups.map((g, i) => (
            <Reveal key={g.group} delay={i * 60}>
              <section>
                <h2 className="font-display text-3xl text-gold-deep">{g.label}</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {g.items.map((l) => (
                    <li key={l.slug}>
                      <Link
                        href={personLandingPath(l.slug)}
                        className="card block h-full rounded-xl p-5 transition-colors hover:border-gold/45"
                      >
                        <span className="font-display text-xl text-ink">{l.h1}</span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                          {l.lede}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>

        <DailyPrayerUpsell variant="banner" from="hub-persone" className="mt-16" />

        <p className="mt-12 text-center text-sm leading-relaxed text-ink-soft">
          Cerchi invece un testo preciso della tradizione?{" "}
          <Link href={ARCHIVE_BASE} className="font-medium text-gold-deep underline">
            L&apos;archivio delle preghiere
          </Link>{" "}
          è libero e gratuito.
        </p>

        <AdSlot placement="articolo" className="mt-14" />
      </div>
    </div>
  );
}
