import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Candle } from "@/components/Candle";
import { JsonLd, faqLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { SubscribeForm } from "@/components/SubscribeForm";
import {
  activeSubscriptionFor,
  dateLabel,
  hiddenParagraphs,
  loadDailyPrayer,
  recentDailyPrayers,
  romeToday,
  subscriberCount,
  subscriptionByToken,
  teaser,
} from "@/lib/dailyPrayer";
import { getAudioUrl } from "@/lib/generate";
import { siteUrl } from "@/lib/landings";
import { getDailySubscription, toPublicSubscription } from "@/lib/pricing";
import { getSessionUser } from "@/lib/supabase/server";
import { subscriptionIsActive } from "@/lib/types";

// La preghiera cambia ogni mattina e l'accesso dipende da chi guarda: non c'è
// niente da mettere in cache.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "La Preghiera del Giorno — una preghiera nuova ogni mattina alle 9",
  description:
    "Ogni mattina alle 9 una preghiera nuova nella tua email, la stessa per tutti quelli che la ricevono. 0,70 € al giorno, disdici quando vuoi.",
  alternates: { canonical: "/preghiera-del-giorno" },
  openGraph: {
    title: "La Preghiera del Giorno",
    description: "Una preghiera nuova ogni mattina alle 9, nella tua email.",
    type: "website",
    locale: "it_IT",
  },
};

const FAQ = [
  {
    q: "È la stessa preghiera per tutti?",
    a: "Sì, ed è il punto. Ogni mattina se ne scrive una sola e arriva identica a tutti gli abbonati: è la cosa più vicina a pregare insieme che si possa fare stando ognuno a casa propria. Se invece ti serve una preghiera per una situazione precisa — un nome, una data, una malattia — quella si scrive su misura, ed è un altro prodotto.",
  },
  {
    q: "A che ora arriva?",
    a: "Alle nove del mattino, ora italiana. Il testo viene composto alle sette: due ore di margine servono a fare in modo che, se qualcosa va storto, ci sia il tempo di rimediare prima che tu apra la posta.",
  },
  {
    q: "Devo avere un account?",
    a: "No. Serve solo un indirizzo email. Il link per gestire o disdire l'abbonamento è in fondo a ogni messaggio e funziona senza password.",
  },
  {
    q: "Come si disdice?",
    a: "Con un clic, dal link in fondo a qualunque email ricevuta. Nessuna domanda, nessun modulo, nessuna telefonata. Continui a ricevere la preghiera fino alla fine del periodo che hai già pagato, poi si ferma.",
  },
  {
    q: "Perché il prezzo è al giorno ma l'addebito è a settimana?",
    a: "Perché un incasso di settanta centesimi lascerebbe quasi metà dell'importo alle commissioni della carta. Raggruppare sette giorni in un addebito solo è ciò che permette di tenere il prezzo a settanta centesimi invece di alzarlo. Sull'estratto conto vedrai una riga a settimana.",
  },
  {
    q: "Chi la scrive?",
    a: "Il testo è composto con l'assistenza dell'intelligenza artificiale e recitato da una voce sintetica. Nessun sacerdote, imam, rabbino o monaco interviene, e il servizio non è affiliato ad alcuna autorità religiosa. Le parole le mettiamo noi: a pregarle sei tu.",
  },
];

export default async function DailyPrayerPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; benvenuto?: string; annullato?: string; da?: string }>;
}) {
  const { token, benvenuto, annullato, da } = await searchParams;

  const config = getDailySubscription();
  const sub = toPublicSubscription(config);

  const today = romeToday();
  const [prayer, user, recent, subscribers] = await Promise.all([
    loadDailyPrayer(today),
    getSessionUser(),
    recentDailyPrayers(6, today),
    subscriberCount(),
  ]);

  /**
   * Chi può leggerla per intero.
   *
   * Due strade, perché l'abbonamento non richiede un account: il token che
   * ogni abbonato ha nel link in fondo alle sue email, oppure una sessione
   * il cui indirizzo risulta abbonato. La prima è quella che userà quasi
   * tutti — l'email è l'unico posto dove il prodotto vive davvero.
   */
  const byToken = token ? await subscriptionByToken(token) : null;
  const byAccount = user?.email ? await activeSubscriptionFor(user.email) : null;

  // Fra i due vince quello attivo, non quello arrivato per primo: chi ha
  // disdetto, si è riabbonato e riapre un vecchio link dell'email si
  // ritroverebbe altrimenti fuori da un abbonamento che sta pagando.
  const mine =
    byToken && subscriptionIsActive(byToken) ? byToken : byAccount ?? byToken;
  const unlocked = Boolean(mine && subscriptionIsActive(mine));

  const ready = prayer?.status === "ready" && prayer.body && prayer.title;
  const audioUrl =
    unlocked && prayer?.audio_path ? await getAudioUrl(prayer.audio_path, 60 * 60 * 12) : null;

  const paragraphs = ready ? prayer!.body!.split(/\n{2,}/).filter((p) => p.trim()) : [];

  return (
    <div className="px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: config.name,
            description:
              "Una preghiera nuova ogni mattina alle 9, via email, uguale per tutti gli abbonati.",
            url: `${siteUrl()}/preghiera-del-giorno`,
            brand: { "@type": "Brand", name: "AlTuoDioCiPensoIO" },
            offers: {
              "@type": "Offer",
              price: (config.amountCents / 100).toFixed(2),
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: `${siteUrl()}/preghiera-del-giorno`,
            },
          }}
        />
        {/* Le stesse domande della pagina, in forma leggibile da Google: è
            quello che rende la pagina candidabile ai risultati arricchiti. */}
        <JsonLd data={faqLd(FAQ)} />

        {/* --- Testata ---------------------------------------------------- */}
        <header className="text-center">
          <div className="rise">
            <Candle className="mx-auto h-16 w-16" />
          </div>
          <p
            className="rise mt-7 text-sm uppercase tracking-[0.28em] text-gold-deep"
            style={{ animationDelay: "180ms" }}
          >
            {dateLabel(today)}
          </p>
          <h1
            className="rise mt-4 text-balance font-display text-5xl leading-tight text-ink sm:text-6xl"
            style={{ animationDelay: "320ms" }}
          >
            La Preghiera del Giorno
          </h1>
          <p
            className="rise mx-auto mt-5 max-w-lg text-balance leading-relaxed text-ink-soft"
            style={{ animationDelay: "460ms" }}
          >
            Una preghiera nuova ogni mattina alle {sub.deliveryHour}, nella tua email. La
            stessa per tutti quelli che la ricevono.
          </p>
        </header>

        {benvenuto && (
          <p className="mt-10 rounded-xl border border-gold/35 bg-gold/[0.07] px-5 py-4 text-center text-sm leading-relaxed text-ink">
            <strong className="font-medium">Ci sei.</strong> Da domani mattina alle{" "}
            {sub.deliveryHour} la preghiera del giorno arriva da sola. Ti abbiamo mandato
            un&apos;email di conferma: dentro c&apos;è il link per gestire l&apos;abbonamento.
          </p>
        )}

        {annullato && (
          <p className="mt-10 rounded-xl border border-gold/25 bg-gold/5 px-5 py-3 text-center text-sm text-ink-soft">
            Iscrizione annullata. Nessun addebito è stato effettuato.
          </p>
        )}

        {/* --- La preghiera di oggi --------------------------------------- */}
        <section className="mt-14">
          {!ready ? (
            <div className="card rounded-2xl p-8 text-center">
              <p className="font-display text-2xl text-ink">
                La preghiera di oggi è in composizione.
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                Si scrive ogni mattina alle sette e parte alle {sub.deliveryHour}. Torna fra
                poco, oppure iscriviti e non dovrai più tornare: arriva da sola.
              </p>
            </div>
          ) : (
            <article className="card rounded-2xl p-8 sm:p-10">
              {prayer!.theme_label && (
                <p className="text-xs uppercase tracking-[0.18em] text-gold-deep">
                  {prayer!.theme_label}
                </p>
              )}
              <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
                {prayer!.title}
              </h2>

              <div className="mt-8 space-y-5">
                {(unlocked ? paragraphs : [teaser(prayer!.body!)]).map((p, i) => (
                  <p key={i} className="text-lg leading-[1.9] text-ink">
                    {p}
                  </p>
                ))}
              </div>

              {/* Il muro. Sotto c'è il resto del testo, e si vede che c'è:
                  un paywall che non mostra cosa nasconde non convince nessuno. */}
              {!unlocked && hiddenParagraphs(prayer!.body!) > 0 && (
                <div className="relative mt-2">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none select-none space-y-5 opacity-[0.14] blur-[5px]"
                  >
                    {paragraphs.slice(1, 3).map((p, i) => (
                      <p key={i} className="text-lg leading-[1.9] text-ink">
                        {p}
                      </p>
                    ))}
                  </div>
                  <p className="mt-6 border-t border-gold/20 pt-6 text-center text-sm text-ink-soft">
                    Restano altri {hiddenParagraphs(prayer!.body!)}{" "}
                    {hiddenParagraphs(prayer!.body!) === 1 ? "paragrafo" : "paragrafi"}
                    {prayer!.audio_path ? ", più la registrazione a voce" : ""}.
                  </p>
                </div>
              )}

              {unlocked && audioUrl && (
                <div className="mt-9 rounded-xl border border-gold/20 bg-paper-warm/50 p-5">
                  <p className="mb-3 text-sm text-ink-soft">
                    Se preferisci ascoltarla mentre la segui:
                  </p>
                  <audio controls preload="metadata" className="w-full" src={audioUrl}>
                    Il tuo browser non riesce a riprodurre l&apos;audio.
                  </audio>
                </div>
              )}

              {unlocked && (
                <p className="mt-8 border-t border-gold/15 pt-6 text-center text-sm text-ink-soft">
                  Ricevi questa preghiera ogni mattina.{" "}
                  <Link
                    href={`/preghiera-del-giorno/gestisci${
                      mine ? `?token=${encodeURIComponent(mine.manage_token)}` : ""
                    }`}
                    className="font-medium text-gold-deep underline underline-offset-2"
                  >
                    Gestisci l&apos;abbonamento
                  </Link>
                  .
                </p>
              )}
            </article>
          )}
        </section>

        {/* --- L'iscrizione ------------------------------------------------ */}
        {!unlocked && (
          <section id="iscriviti" className="mt-12 scroll-mt-24">
            <Reveal>
              <div className="card rounded-2xl border-gold/45 p-8 shadow-lg">
                <div className="text-center">
                  <p className="font-display text-6xl text-gold-deep">{sub.perDay}</p>
                  <p className="mt-2 text-sm text-ink-soft">
                    al giorno — addebitati {sub.billing}
                  </p>
                  {subscribers > 20 && (
                    <p className="mt-4 text-sm text-ink-soft">
                      La ricevono {subscribers} persone, ogni mattina alla stessa ora.
                    </p>
                  )}
                </div>

                <ul className="mx-auto mt-8 max-w-md space-y-2.5 text-sm text-ink-soft">
                  {[
                    `Una preghiera nuova ogni giorno, alle ${sub.deliveryHour} in punto`,
                    "Testo scritto e recitazione a voce, sempre inclusi",
                    "Niente da scrivere e niente da ricordare",
                    "Disdici con un clic, dal link in fondo a ogni email",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="text-gold-deep">·</span>
                      {line}
                    </li>
                  ))}
                </ul>

                <div className="mx-auto mt-9 max-w-md">
                  <SubscribeForm
                    sub={sub}
                    defaultEmail={user?.email ?? ""}
                    from={da || "preghiera-del-giorno"}
                  />
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {/* --- I giorni scorsi --------------------------------------------- */}
        {recent.length > 0 && (
          <section className="mt-20">
            <Reveal>
              <h2 className="text-center font-display text-3xl text-ink">I giorni scorsi</h2>
              <p className="mt-3 text-center text-sm text-ink-soft">
                Una diversa ogni mattina: non si ripete e non torna indietro.
              </p>
            </Reveal>
            <ul className="mt-8 divide-y divide-gold/12 border-y border-gold/12">
              {recent.map((p) => (
                <li key={p.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
                  <span className="w-32 shrink-0 text-xs uppercase tracking-wide text-ink-soft/70">
                    {dateLabel(p.prayer_date).replace(/ \d{4}$/, "")}
                  </span>
                  <span className="font-display text-xl text-ink">{p.title}</span>
                  {p.theme_label && (
                    <span className="text-xs text-ink-soft/70">{p.theme_label}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* --- Domande ------------------------------------------------------ */}
        <section className="mt-20">
          <Reveal>
            <h2 className="text-center font-display text-3xl text-ink sm:text-4xl">
              Domande giuste
            </h2>
          </Reveal>
          <dl className="mt-10 space-y-5">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 70}>
                <div className="card rounded-xl p-6">
                  <dt className="font-medium text-ink">{item.q}</dt>
                  <dd className="mt-2 leading-relaxed text-ink-soft">{item.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>

        <p className="mt-14 text-center text-sm text-ink-soft">
          Ti serve invece una preghiera per una situazione precisa?{" "}
          <Link href="/nuova-preghiera" className="font-medium text-gold-deep underline">
            Se ne scrive una su misura
          </Link>
          .
        </p>

        <AdSlot placement="articolo" className="mt-14" />
      </div>
    </div>
  );
}
