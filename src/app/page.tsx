import Link from "next/link";
import { Candle } from "@/components/Candle";
import { Reveal } from "@/components/Reveal";
import { ProductGrid } from "@/components/ProductGrid";
import { formatPrice, getEtaMinutes, getSingle, listProducts, toPublic } from "@/lib/pricing";
import { RELIGIONS } from "@/lib/religions";

// I prezzi arrivano dalle env a ogni richiesta: cambiarle non richiede un rebuild.
export const dynamic = "force-dynamic";

const STEPS = [
  {
    n: "01",
    title: "Scegli la tua fede",
    text: "Cattolica, ortodossa, protestante, islamica, ebraica, induista, buddhista, sikh, e molte altre. Anche laica, se preferisci un pensiero senza religione.",
  },
  {
    n: "02",
    title: "Dicci per cosa",
    text: "Un tipo di preghiera e la tua intenzione, con parole tue. Un nome, una situazione, una data. Più sei preciso, più le parole saranno tue.",
  },
  {
    n: "03",
    title: "Pregala tu",
    text: "Entro pochi minuti ricevi il testo, sul sito e via email. Puoi leggerlo in silenzio, dirlo ad alta voce, o farti accompagnare dalla voce registrata mentre lo segui. Chi prega, in ogni caso, sei tu.",
  },
];

export default function HomePage() {
  const single = getSingle();
  const products = listProducts().map(toPublic);
  const eta = getEtaMinutes();

  return (
    <>
      {/* Hero */}
      <section className="px-6 pb-24 pt-20 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rise" style={{ animationDelay: "150ms" }}>
            <Candle className="mx-auto h-20 w-20" />
          </div>

          <p
            className="rise mt-8 text-sm uppercase tracking-[0.28em] text-gold-deep"
            style={{ animationDelay: "450ms" }}
          >
            Le parole le mettiamo noi. La preghiera la fai tu.
          </p>

          <h1
            className="rise mt-5 text-balance font-display text-5xl leading-[1.08] text-ink sm:text-7xl"
            style={{ animationDelay: "650ms" }}
          >
            C&apos;è sempre un momento in cui non trovi le parole.
            <span className="mt-3 block text-gold-deep">Quelle te le troviamo noi.</span>
          </h1>

          <p
            className="rise mx-auto mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "850ms" }}
          >
            Sei in turno di notte, in ospedale, in viaggio, o davanti a un dolore che non
            sai come dire. Scrivici la tua intenzione: la mettiamo nella forma della tua
            tradizione, e ti restituiamo un testo da pregare con le tue labbra.
          </p>

          <div
            className="rise mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "1050ms" }}
          >
            <Link
              href="/nuova-preghiera"
              className="btn-gold w-full rounded-xl px-8 py-4 text-lg font-medium text-white sm:w-auto"
            >
              Una preghiera — {formatPrice(single.amountCents)}
            </Link>
            <Link
              href="/pacchetti"
              className="w-full rounded-xl border border-gold/35 bg-card/70 px-8 py-4 font-medium text-ink transition-all duration-300 hover:border-gold/70 hover:bg-card sm:w-auto"
            >
              Novena, anno, trigesimo
            </Link>
          </div>

          <p
            className="rise mt-6 text-sm text-ink-soft/80"
            style={{ animationDelay: "1200ms" }}
          >
            Pagamento unico. Nessun abbonamento che si rinnova.
          </p>
        </div>
      </section>

      {/* Chi prega sei tu — l'obiezione affrontata prima che venga posta */}
      <section className="border-t border-gold/12 bg-paper-warm/50 px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <h2 className="text-center font-display text-4xl text-ink sm:text-5xl">
              Chi prega sei tu
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-ink-soft">
              Diciamolo subito, perché è la prima cosa che verrebbe da chiedere: qui non
              c&apos;è nessuna macchina che prega al posto tuo. Una macchina non può pregare, e
              noi non lo sosteniamo. Quello che facciamo è più antico e più modesto:{" "}
              <strong className="font-medium text-ink">mettere per iscritto le parole</strong>{" "}
              che in questo momento non riesci a trovare.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              È un mestiere che esiste da sempre. Il messale, il breviario, i libri d&apos;ore,
              i libretti delle novene, il santino nel portafoglio: da secoli i credenti pregano
              con parole scritte da altri, e nessuno ha mai pensato che fosse il messale a
              pregare. La preghiera è l&apos;atto di chi la dice.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Il testo che ricevi è un formulario, scritto su misura per la tua situazione
              invece che per tutti. Poi sta a te: leggerlo, dirlo, tacerlo, cambiarlo,
              buttarlo via. Non abbiamo alcun potere su quel passaggio, ed è giusto così.
            </p>
            <p className="mt-8 text-center">
              <Link
                href="/pregare-con-lintelligenza-artificiale"
                className="underline underline-offset-4 hover:text-ink"
              >
                Si può pregare con un testo scritto dall&apos;intelligenza artificiale?
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Come funziona */}
      <section className="border-t border-gold/12 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-center font-display text-4xl text-ink sm:text-5xl">
              Tre passi, pochi minuti
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <span className="font-display text-6xl text-gold/35">{s.n}</span>
                <h3 className="mt-3 font-display text-2xl text-ink">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Religioni */}
      <section className="border-t border-gold/12 bg-paper-warm/50 px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl text-ink sm:text-5xl">
              Ogni fede, con lo stesso rispetto
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-ink-soft">
              Ogni tradizione ha le sue formule, i suoi nomi del divino, il suo modo di
              rivolgersi al cielo. Li seguiamo. Nessuna preghiera è un modello riempito con
              i tuoi dati.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {RELIGIONS.map((r) => (
                <span
                  key={r.id}
                  className="card rounded-full px-4 py-2 text-sm text-ink-soft transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span className="mr-2">{r.emoji}</span>
                  {r.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Archivio — l'ingresso gratuito, prima di qualsiasi prezzo */}
      <section className="border-t border-gold/12 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.28em] text-gold-deep">
              Gratis, e senza registrarsi
            </p>
            <h2 className="mt-5 font-display text-4xl text-ink sm:text-5xl">
              Prima di tutto, le preghiere che esistono già
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-soft">
              Prima di scriverne una nuova, guarda quelle che venti secoli hanno già scritto.
              Le abbiamo raccolte e ordinate per situazione — malattia, lutto, paura, viaggio,
              perdono, ringraziamento — così le trovi quando servono. Sono libere, e lo
              restano.
            </p>
            <Link
              href="/preghiere-tradizionali"
              className="mt-10 inline-block rounded-xl border border-gold/40 bg-card px-8 py-4 font-medium text-ink transition-all duration-300 hover:border-gold/70 hover:-translate-y-0.5"
            >
              Sfoglia l&apos;archivio
            </Link>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-ink-soft/80">
              Se nessuna dice la tua situazione — un nome, una data, una cosa che non entra in
              nessuna formula — allora ha senso scriverne una.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Prezzi */}
      <section className="border-t border-gold/12 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-center font-display text-4xl text-ink sm:text-5xl">
              Quanto costa
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-center leading-relaxed text-ink-soft">
              Una preghiera per un momento preciso, oppure una devozione intera portata a
              termine giorno per giorno.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-14">
              <ProductGrid products={products} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Lucernario */}
      <section className="sunlit border-t border-gold/12 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.28em] text-gold-deep">
              Importo libero
            </p>
            <h2 className="mt-5 font-display text-4xl text-ink sm:text-5xl">
              Oppure accendi solo una candela
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-ink-soft">
              Nel Lucernario ci sono cinquanta candele, come nella nicchia laterale di
              una chiesa. Nessun prezzo: decidi tu l&apos;importo, ne
              accendi una e resta accesa ventiquattr&apos;ore, con il tuo nome sotto.
            </p>
            <Link
              href="/lucernario"
              className="mt-10 inline-block rounded-xl border border-gold/40 bg-card px-8 py-4 font-medium text-ink transition-all duration-300 hover:border-gold/70 hover:-translate-y-0.5"
            >
              Entra nel Lucernario
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Chiusura */}
      <section className="sunlit border-t border-gold/12 px-6 py-28 text-center">
        <Reveal>
          <blockquote className="mx-auto max-w-2xl font-display text-3xl leading-snug text-ink-soft sm:text-4xl">
            &ldquo;Nessuno prega al posto tuo. Ti diamo solo le parole per farlo, nel giorno
            in cui non ti vengono.&rdquo;
          </blockquote>
          <Link
            href="/nuova-preghiera"
            className="btn-gold mt-12 inline-block rounded-xl px-9 py-4 text-lg font-medium text-white"
          >
            Scrivi la tua intenzione — {formatPrice(single.amountCents)}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
