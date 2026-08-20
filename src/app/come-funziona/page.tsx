import Link from "next/link";
import { DailyPrayerUpsell } from "@/components/DailyPrayerUpsell";
import type { Metadata } from "next";
import { Candle } from "@/components/Candle";
import { formatPrice, getSingle } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Come funziona — AlTuoDioCiPensoIO",
  description: "Come nasce un testo su AlTuoDioCiPensoIO: la tua intenzione, la tua tradizione, un formulario scritto su misura. A pregarlo sei tu.",
};

// I prezzi arrivano dalle env a ogni richiesta: cambiarle non richiede un rebuild.
export const dynamic = "force-dynamic";

const SECTIONS = [
  {
    title: "Che cosa facciamo, esattamente",
    body: "Scriviamo le parole. Non preghiamo al posto tuo — non sapremmo come farlo, e nessuna macchina lo può. Quello che ricevi è un formulario: un testo pronto da pregare, come quelli del messale o del libretto di una novena, con la differenza che è scritto per la tua situazione invece che per tutti. Poi tocca a te dirlo, in silenzio o ad alta voce.",
  },
  {
    title: "Da dove nasce",
    body: "C'è il turno di notte, il ricovero, il fuso orario sbagliato, il lutto che toglie le parole. Ci sono momenti in cui vorresti pregare e non trovi da dove cominciare. Questo servizio esiste per quei momenti: prende la tua intenzione e le dà una forma compiuta, così tu devi solo pregarla.",
  },
  {
    title: "Prima però guarda l'archivio",
    body: "Venti secoli di preghiere le hanno già scritte quasi tutte. Prima di comporne una nuova, cerca nell'archivio: è gratuito, non richiede registrazione, ed è ordinato per situazione. Un testo su misura serve solo quando nessuna formula esistente dice la tua — un nome, una data, una circostanza che non entra in nessuna orazione già scritta.",
  },
  {
    title: "Come viene scritta",
    body: "Il testo nasce dalla tua intenzione e dalla tradizione che scegli. Ogni fede ha le sue formule di apertura e chiusura, i suoi nomi del divino, il suo registro: li rispettiamo. Una supplica cattolica, un duʿāʾ islamico, una berakhah ebraica e una dedica dei meriti buddhista non si scrivono allo stesso modo, e infatti non le scriviamo allo stesso modo.",
  },
  {
    title: "A cosa serve la voce",
    body: "Il testo viene affidato a una voce di sintesi grave e posata, con il ritmo lento della lettura liturgica e le pause fra un passaggio e l'altro. Non serve ad ascoltare qualcun altro che prega per te: serve ad accompagnarti mentre preghi tu, come il coro accompagna l'assemblea, per le volte in cui leggere da soli è faticoso. È facoltativa, e c'è chi usa solo il testo.",
  },
  {
    title: "Cosa non facciamo",
    body: "Non preghiamo al posto tuo, e non diciamo che una macchina possa farlo. Non inventiamo versetti né attribuiamo frasi ai testi sacri. Non promettiamo guarigioni, esiti o miracoli: si chiede e si affida, non si garantisce. Non prendiamo in giro nessuna fede, nemmeno per scherzo. E non rappresentiamo alcuna istituzione religiosa: non siamo un sacerdote, un imam, un rabbino o un monaco, e non sostituiamo il loro ministero né la comunità che si trova solo fra persone.",
  },
  {
    title: "Cosa succede ai tuoi dati",
    body: "La tua intenzione serve a scrivere la preghiera e resta legata al tuo account. Non la vendiamo, non la usiamo per pubblicità, non la mostriamo a nessun altro. Il link alla preghiera è privato e non indicizzato: lo vede solo chi ce l'ha. Puoi chiederci in ogni momento di cancellare tutto.",
  },
];

export default function HowItWorksPage() {
  const single = getSingle();

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <header className="text-center">
          <Candle className="mx-auto h-14 w-14" />
          <h1 className="mt-8 font-display text-5xl text-ink">Come funziona</h1>
        </header>

        <div className="mt-14 space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-display text-3xl text-gold-deep">{s.title}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">{s.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/preghiere-tradizionali"
            className="inline-block rounded-xl border border-gold/40 bg-card px-8 py-4 font-medium text-ink transition-all duration-300 hover:border-gold/70"
          >
            Sfoglia l&apos;archivio — gratis
          </Link>
          <p className="mt-8 text-ink-soft">
            Oppure, se nessuna formula dice la tua situazione:
          </p>
          <Link
            href="/nuova-preghiera"
            className="mt-4 inline-block rounded-xl btn-gold px-8 py-4 font-medium text-white"
          >
            Scrivi la tua intenzione — {formatPrice(single.amountCents)}
          </Link>

          <DailyPrayerUpsell variant="banner" from="come-funziona" className="mt-12" />
        </div>
      </div>
    </div>
  );
}
