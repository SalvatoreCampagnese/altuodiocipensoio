import type { Metadata } from "next";
import { BundleCheckout } from "@/components/BundleCheckout";
import { DailyPrayerUpsell } from "@/components/DailyPrayerUpsell";
import { Candle } from "@/components/Candle";
import { Reveal } from "@/components/Reveal";
import { formatPrice, getSingle, listBundles, toPublic, type Cadence } from "@/lib/pricing";
import { getSessionUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "I pacchetti",
  description:
    "Novena, l'anno, trigesimo: devozioni intere portate a termine giorno per giorno. Pagamento unico, nessun rinnovo automatico.",
};

const CADENCE_LABEL: Record<Cadence, string> = {
  instant: "tutte subito",
  daily: "una al giorno",
  monthly: "una al mese",
  // Nessun pacchetto ha questa cadenza — è dell'abbonamento, che si compra
  // altrove — ma la mappa dev'essere completa perché il tipo lo esige.
  subscription: "ogni giorno, finché resti abbonato",
};

const FAQ = [
  {
    q: "Sono abbonamenti che si rinnovano? ",
    a: "No, i pacchetti no. Paghi una volta sola e le preghiere sono tue: niente addebiti futuri e niente da disdire. L'unico prodotto che si rinnova è La Preghiera del Giorno, ed è dichiarato come tale in ogni sua pagina.",
  },
  {
    q: "Perché una al giorno e non tutte insieme? ",
    a: "Perché novena e trigesimo sono devozioni che vivono nella ripetizione: nove giorni, trenta giorni. Il ritmo è il senso. La prima preghiera è disponibile appena paghi, le altre si sbloccano una al giorno.",
  },
  {
    q: "Devo scegliere subito religione e intenzione? ",
    a: "No. Ogni volta decidi da capo: tradizione, tipo di preghiera, lingua, tono e intenzione. Puoi cambiare tutto a ogni preghiera.",
  },
  {
    q: "Se salto un giorno, perdo la preghiera? ",
    a: "No. I crediti sbloccati restano tuoi e si accumulano: se salti un giorno, il giorno dopo ne hai due da usare. Non scadono.",
  },
  {
    q: "Posso dedicarle a persone diverse? ",
    a: "Sì. Ogni preghiera ha il suo destinatario e il suo link privato, che puoi mandare a chi vuoi.",
  },
];

export default async function PacchettiPage({
  searchParams,
}: {
  searchParams: Promise<{ annullato?: string }>;
}) {
  const { annullato } = await searchParams;
  const email = (await getSessionUser())?.email ?? "";

  const bundles = listBundles().map(toPublic);
  const single = getSingle();

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <div className="rise">
            <Candle className="mx-auto h-16 w-16" />
          </div>
          <h1
            className="rise mt-8 text-balance font-display text-5xl leading-tight text-ink sm:text-6xl"
            style={{ animationDelay: "200ms" }}
          >
            Una devozione intera,
            <span className="mt-1 block text-gold-deep">portata a termine.</span>
          </h1>
          <p
            className="rise mx-auto mt-6 max-w-lg text-balance leading-relaxed text-ink-soft"
            style={{ animationDelay: "380ms" }}
          >
            La novena dura nove giorni, il trigesimo trenta. Non è una scorta di
            preghiere scontate: è il rito seguito fino in fondo, un giorno alla volta,
            anche nei giorni in cui non ce la fai.
          </p>
        </header>

        {annullato && (
          <p className="mt-8 rounded-xl border border-gold/30 bg-gold/5 px-4 py-3 text-center text-sm text-ink-soft">
            Pagamento annullato. Nessun addebito è stato effettuato.
          </p>
        )}

        {/* Chi guarda i pacchetti sta già cercando una devozione continuata:
            è l'offerta quotidiana con un altro nome, e costa meno. */}
        <DailyPrayerUpsell variant="banner" from="pacchetti" className="mt-10" />

        <div className="mt-16 space-y-8">
          {bundles.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <section
                id={p.id}
                className={`card scroll-mt-24 rounded-2xl p-8 ${
                  p.featured ? "border-gold/50" : ""
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl text-ink">{p.name}</h2>
                    <p className="mt-1 text-sm text-ink-soft">{p.tagline}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-5xl text-gold-deep">{p.price}</p>
                    <p className="mt-1 text-xs text-ink-soft">{p.perPrayer} a preghiera</p>
                  </div>
                </div>

                <p className="mt-6 leading-relaxed text-ink-soft">{p.description}</p>

                <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
                  <li className="flex gap-3">
                    <span className="text-gold-deep">·</span>
                    {p.credits} preghiere, {CADENCE_LABEL[p.cadence]}
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold-deep">·</span>
                    Ogni volta scegli tradizione, tipo, tono e lingua
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold-deep">·</span>
                    Testo scritto e recitazione a voce, sempre inclusi
                  </li>
                  <li className="flex gap-3">
                    <span className="text-gold-deep">·</span>
                    I crediti non usati si accumulano e non scadono
                  </li>
                  {p.savings && (
                    <li className="flex gap-3 font-medium text-gold-deep">
                      <span>·</span>
                      Risparmi {p.savings} rispetto a {p.credits} preghiere singole
                    </li>
                  )}
                </ul>

                <div className="mt-8">
                  <BundleCheckout product={p} defaultEmail={email} />
                </div>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-12 text-center text-sm text-ink-soft">
            Ti serve una preghiera sola, per un momento preciso?{" "}
            <a href="/nuova-preghiera" className="font-medium text-gold-deep underline">
              Bastano {formatPrice(single.amountCents)}
            </a>
            .
          </p>
        </Reveal>

        <section className="mt-20">
          <Reveal>
            <h2 className="text-center font-display text-3xl text-ink sm:text-4xl">
              Domande giuste
            </h2>
          </Reveal>
          <dl className="mt-10 space-y-5">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 80}>
                <div className="card rounded-xl p-6">
                  <dt className="font-medium text-ink">{item.q}</dt>
                  <dd className="mt-2 leading-relaxed text-ink-soft">{item.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
