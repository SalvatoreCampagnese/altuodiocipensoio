import Link from "next/link";
import type { Metadata } from "next";
import { Candle } from "@/components/Candle";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
import { RELIGION_LANDINGS, religionLandingPath, siteUrl } from "@/lib/landings";
import { getReligion, languagesFor } from "@/lib/religions";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}/preghiere`;
  return {
    title: "Preghiere per tradizione — quindici fedi, con lo stesso rispetto",
    description:
      "Preghiere personalizzate in quindici tradizioni religiose: cattolica, ortodossa, evangelica, islamica, ebraica, induista, buddhista, sikh e altre. Scritte e recitate a voce.",
    alternates: { canonical: url },
    openGraph: { title: "Preghiere per tradizione", url, type: "website", locale: "it_IT" },
  };
}

export default function ReligionsHubPage() {
  const base = siteUrl();

  return (
    <div className="px-6 py-16">
      <JsonLd
        data={breadcrumbLd(base, [
          { name: "Home", path: "/" },
          { name: "Preghiere per tradizione", path: "/preghiere" },
        ])}
      />

      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <Candle className="mx-auto h-14 w-14" />
          <h1 className="mt-8 font-display text-4xl text-ink sm:text-5xl">
            Preghiere per tradizione
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Una supplica cattolica, un duʿāʾ islamico, una berakhah ebraica e una dedica dei
            meriti buddhista non si scrivono allo stesso modo. Ogni tradizione ha le sue formule
            di apertura e chiusura, i suoi nomi del divino, il suo registro — e il testo che
            ricevi li rispetta.
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Scegli la tua, o quella della persona per cui vuoi pregare.
          </p>
        </header>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {RELIGION_LANDINGS.map((l) => {
            const religion = getReligion(l.religionId);
            if (!religion) return null;
            const languages = languagesFor(l.religionId);

            return (
              <li key={l.slug}>
                <Link
                  href={religionLandingPath(l.slug)}
                  className="block h-full rounded-2xl border border-gold/20 bg-paper-warm/50 p-6 transition-colors hover:border-gold/50"
                >
                  <p className="text-2xl" aria-hidden="true">
                    {religion.emoji}
                  </p>
                  <h2 className="mt-3 font-display text-2xl text-ink">{religion.label}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{l.description}</p>
                  {languages.length > 0 && (
                    <p className="mt-3 text-xs uppercase tracking-wide text-ink-soft opacity-70">
                      {languages.map((x) => x.label).join(" · ")}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-12 text-center leading-relaxed text-ink-soft">
          Preferisci partire da ciò che ti serve invece che dalla fede?{" "}
          <Link href="/preghiera-per" className="underline underline-offset-4 hover:text-ink">
            Le preghiere per intenzione
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
