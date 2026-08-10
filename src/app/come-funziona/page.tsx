import Link from "next/link";
import type { Metadata } from "next";
import { Candle } from "@/components/Candle";
import { formatPrice, getSingle } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Come funziona — AlTuoDioCiPensoIO",
  description: "Come nasce una preghiera su AlTuoDioCiPensoIO: la tua intenzione, la tua tradizione, un testo scritto e recitato a voce.",
};

// I prezzi arrivano dalle env a ogni richiesta: cambiarle non richiede un rebuild.
export const dynamic = "force-dynamic";

const SECTIONS = [
  {
    title: "Da dove nasce",
    body: "C'è il turno di notte, il ricovero, il fuso orario sbagliato, il lutto che toglie le parole. Ci sono momenti in cui vorresti pregare e non puoi, o non sai da dove cominciare. Questo servizio esiste per quei momenti: prende la tua intenzione e la porta fino in fondo, in forma compiuta.",
  },
  {
    title: "Come viene scritta",
    body: "Il testo nasce dalla tua intenzione e dalla tradizione che scegli. Ogni fede ha le sue formule di apertura e chiusura, i suoi nomi del divino, il suo registro: li rispettiamo. Una supplica cattolica, un duʿāʾ islamico, una berakhah ebraica e una dedica dei meriti buddhista non si scrivono allo stesso modo, e infatti non le scriviamo allo stesso modo.",
  },
  {
    title: "Come viene recitata",
    body: "Il testo viene affidato a una voce di sintesi grave e posata, con il ritmo lento della lettura liturgica e le pause fra un passaggio e l'altro. Ne esce un MP3 che puoi ascoltare, riascoltare, scaricare e mandare a chi vuoi tramite un link privato.",
  },
  {
    title: "Cosa non facciamo",
    body: "Non inventiamo versetti né attribuiamo frasi ai testi sacri. Non promettiamo guarigioni, esiti o miracoli: si chiede e si affida, non si garantisce. Non prendiamo in giro nessuna fede, nemmeno per scherzo. E non rappresentiamo alcuna istituzione religiosa: non siamo un sacerdote, un imam, un rabbino o un monaco, e non sostituiamo il loro ministero.",
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
            href="/nuova-preghiera"
            className="inline-block rounded-xl btn-gold px-8 py-4 font-medium text-white"
          >
            Accendi una candela — {formatPrice(single.amountCents)}
          </Link>
        </div>
      </div>
    </div>
  );
}
