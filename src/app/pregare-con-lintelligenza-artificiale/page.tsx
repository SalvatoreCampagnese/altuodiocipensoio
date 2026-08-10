import Link from "next/link";
import type { Metadata } from "next";
import { Candle } from "@/components/Candle";
import { JsonLd, breadcrumbLd, faqLd } from "@/components/JsonLd";
import type { Faq } from "@/lib/landings";
import { siteUrl } from "@/lib/landings";
import { formatPrice, getSingle } from "@/lib/pricing";

/**
 * L'obiezione affrontata di petto.
 *
 * È la pagina che risponde alla domanda che ogni credente si fa prima di
 * usare il servizio — «una macchina può pregare?» — e la risposta che diamo
 * è no. Serve a due cose insieme: togliere dal tavolo l'equivoco che ci
 * costa la fiducia, e intercettare la query di chi quell'obiezione la sta
 * cercando su Google.
 *
 * Regola per chi la modifica: qui non si vende. Se una frase suona come
 * marketing, la pagina ha fallito il suo scopo.
 */

export const dynamic = "force-dynamic";

const PATH = "/pregare-con-lintelligenza-artificiale";

const TITLE = "Si può pregare con l'intelligenza artificiale?";
const DESCRIPTION =
  "No, una macchina non prega. Ma un testo può aiutare a pregare, come fanno il messale e i libretti delle novene da secoli. La distinzione, detta per intero.";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}${PATH}`;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: url },
    openGraph: { title: TITLE, description: DESCRIPTION, url, type: "article", locale: "it_IT" },
  };
}

/** Ogni sezione è autoconclusiva: è così che finisce citata dalle AI Overviews. */
const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "La risposta breve",
    p: [
      "No: un'intelligenza artificiale non prega, e non può pregare. La preghiera è un atto di una persona che si rivolge a Dio — presuppone qualcuno che voglia, che creda, che si affidi. Un modello linguistico non vuole niente e non crede a niente. Chiunque dica il contrario sta vendendo qualcosa.",
      "Quello che un testo può fare è un'altra cosa, molto più modesta: dare le parole a chi in quel momento non le trova. Questo lo fa da secoli anche la carta stampata, e nessuno ha mai sostenuto che fosse il libro a pregare.",
    ],
  },
  {
    h: "Pregare con parole scritte da altri non è una novità",
    p: [
      "Il messale, il breviario, i libri d'ore medievali, i libretti delle novene, il santino nel portafoglio, il Salterio: la preghiera cristiana è in larghissima parte una preghiera con testi composti da qualcun altro, spesso da autori di cui non sappiamo il nome. Lo stesso vale altrove — un duʿāʾ raccolto in una compilazione, una berakhah fissata dalla tradizione, un sutra recitato a memoria.",
      "Nessuna di queste parole è nata nel cuore di chi la dice. Diventa sua nel momento in cui la dice. È esattamente il passaggio che un testo, di per sé, non può compiere — né su carta né su uno schermo.",
    ],
  },
  {
    h: "Allora la sincerità dove sta?",
    p: [
      "Sta in chi prega, non nel testo. È l'obiezione che ci viene fatta più spesso — «la preghiera deve nascere dal cuore» — ed è giusta: infatti nasce dal cuore di chi la pronuncia, non dalla penna di chi l'ha scritta. Se così non fosse, un fedele che recita il Padre nostro starebbe pregando con parole non sue.",
      "La domanda vera non è chi ha composto il testo, ma se chi lo dice lo fa suo. Se lo leggi distrattamente e chiudi la pagina, non è successo niente — e non pretendiamo il contrario. Se lo dici sul serio, hai pregato tu.",
    ],
  },
  {
    h: "Non è come far scrivere l'omelia all'intelligenza artificiale?",
    p: [
      "No, e la differenza non è di grado: è di natura. L'omelia è un atto di ministero pubblico. Un sacerdote che predica lo fa in nome della Chiesa, davanti a un'assemblea, spezzando la Parola per altri: è insegnamento, ed è per questo che affidarlo a una macchina è un problema serio, di autorità e di responsabilità personale verso chi ascolta.",
      "Un formulario per la preghiera privata non insegna niente a nessuno e non parla in nome di nessuno. Non c'è assemblea, non c'è magistero, non c'è cura d'anime delegata. C'è una persona sola che cerca le parole per dire una cosa a Dio — e non ci sostituiamo a nulla che una macchina non dovrebbe fare, perché a pregare resta lei.",
    ],
  },
  {
    h: "E la comunità? Il contatto umano?",
    p: [
      "Ha ragione chi dice che la forza di una fede sta lì, e che nessuna applicazione la sostituisce. Non ci proviamo. Questo servizio non è un'alternativa alla messa, alla preghiera comunitaria, al parroco, all'imam, alla comunità che ti viene a trovare quando stai male. Se hai quelle cose a portata di mano, usale: valgono incomparabilmente di più.",
      "È pensato per gli intervalli in cui quelle cose non ci sono. Il turno di notte, il letto d'ospedale alle tre, il paese sbagliato, il fuso orario, il lutto che toglie la voce. Un ponte fino al momento in cui puoi tornare fra le persone, non un sostituto delle persone.",
    ],
  },
  {
    h: "Che cosa dice la Chiesa cattolica",
    p: [
      "Il documento di riferimento è Antiqua et nova, la nota su intelligenza artificiale e intelligenza umana pubblicata nel gennaio 2025 dal Dicastero per la Dottrina della Fede insieme al Dicastero per la Cultura e l'Educazione. La linea è netta e non ci è ostile: l'IA è uno strumento, va giudicata dall'uso, e il pericolo grave è l'antropomorfizzazione — attribuirle un'interiorità che non ha, e lasciare che rimpiazzi la relazione fra persone.",
      "È il motivo per cui su questo sito non troverai mai scritto che qualcuno o qualcosa prega per te. Non è cautela legale: è la condizione perché il servizio abbia senso. Un'IA che dicesse di pregare sarebbe esattamente ciò contro cui quel documento mette in guardia.",
      "Papa Leone XIV ha scelto il proprio nome richiamando Leone XIII e la Rerum novarum, indicando l'intelligenza artificiale come la questione sociale del nostro tempo, da governare e non da subire. Chi vuole farsi un'idea faccia prima di tutto una cosa: legga le fonti dirette, invece dei riassunti — compreso questo.",
    ],
  },
  {
    h: "Perché allora si paga?",
    p: [
      "Perché costano la scrittura, la voce, i server e il tempo di chi tiene in piedi il servizio — non perché la preghiera abbia un prezzo. È la stessa distinzione, antica e non nostra, per cui si dà un'offerta per un cero e non si compra l'intercessione: quello che paghi è un lavoro, e nessuno ti sta vendendo l'ascolto di Dio, che non è in vendita e non è nostro da vendere.",
      "Se la distinzione ti sembra sottile, c'è la strada più semplice: l'archivio delle preghiere della tradizione è gratuito, non chiede registrazione, e per la maggior parte delle situazioni della vita basta e avanza.",
    ],
  },
  {
    h: "In una riga",
    p: [
      "Le parole le mettiamo noi, e diciamo apertamente come: le compone un'intelligenza artificiale su tue indicazioni, dentro le formule della tua tradizione. La preghiera la fai tu, e non c'è nessun modo in cui potremmo farla al posto tuo — nemmeno volendo.",
    ],
  },
];

const FAQ: Faq[] = [
  {
    q: "Si può pregare con una preghiera scritta dall'intelligenza artificiale?",
    a: "Sì, allo stesso modo in cui si prega con il messale o con il libretto di una novena: il testo è composto da altri, la preghiera è l'atto di chi lo dice. Quello che non si può fare è delegare la preghiera stessa a una macchina, perché una macchina non prega.",
  },
  {
    q: "Un'intelligenza artificiale può pregare al posto mio?",
    a: "No. La preghiera presuppone una persona che voglia, creda e si affidi: un modello linguistico non fa nessuna di queste cose. Può solo mettere in forma delle parole, che poi devi pregare tu.",
  },
  {
    q: "Non è come far scrivere l'omelia a un'intelligenza artificiale?",
    a: "No. L'omelia è ministero pubblico: un sacerdote insegna in nome della Chiesa davanti a un'assemblea, e quella responsabilità non è delegabile. Un formulario per la preghiera privata non insegna a nessuno e non parla in nome di nessuno.",
  },
  {
    q: "Che cosa dice la Chiesa cattolica sull'intelligenza artificiale?",
    a: "Il testo di riferimento è Antiqua et nova (gennaio 2025), nota del Dicastero per la Dottrina della Fede e del Dicastero per la Cultura e l'Educazione: l'IA è uno strumento da giudicare nell'uso, e il rischio da evitare è attribuirle un'interiorità che non ha o lasciare che sostituisca la relazione fra persone.",
  },
  {
    q: "Una preghiera scritta da un'IA è sincera?",
    a: "La sincerità sta in chi prega, non nel testo. Se lo leggi distrattamente non è successo nulla; se lo dici sul serio, hai pregato tu — esattamente come con qualsiasi preghiera scritta da altri.",
  },
  {
    q: "Pagare per una preghiera non è simonia?",
    a: "Quello che si paga è il lavoro di scrittura, la voce e i server, non l'intercessione, che non è in vendita. Per chi preferisce non pagare nulla, l'archivio delle preghiere della tradizione è gratuito e non richiede registrazione.",
  },
];

export default function PrayerAndAiPage() {
  const base = siteUrl();
  const single = getSingle();

  return (
    <div className="px-6 py-16">
      <JsonLd
        data={breadcrumbLd(base, [
          { name: "Home", path: "/" },
          { name: TITLE, path: PATH },
        ])}
      />
      <JsonLd data={faqLd(FAQ)} />

      <div className="mx-auto max-w-2xl">
        <header className="text-center">
          <Candle className="mx-auto h-14 w-14" />
          <h1 className="mt-8 text-balance font-display text-4xl leading-tight text-ink sm:text-5xl">
            {TITLE}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            La domanda ce la siamo fatta prima di aprire, e ce la fanno ogni settimana. La
            risposta onesta è più scomoda di quella comoda, e preferiamo darla per intera.
          </p>
        </header>

        <div className="mt-16 space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-3xl leading-tight text-gold-deep">{s.h}</h2>
              {s.p.map((text, i) => (
                <p key={i} className="mt-4 text-lg leading-relaxed text-ink-soft">
                  {text}
                </p>
              ))}
            </section>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-gold-deep">Domande frequenti</h2>
          <dl className="mt-6 space-y-8">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt className="font-medium text-ink">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-ink-soft">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-16 rounded-2xl border border-gold/20 bg-paper-warm/50 p-8 text-center">
          <p className="leading-relaxed text-ink-soft">
            Se sei arrivato fin qui e la cosa continua a non convincerti, va benissimo così: è
            una posizione rispettabile e non proveremo a smontartela.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/preghiere-tradizionali"
              className="w-full rounded-xl border border-gold/40 bg-card px-7 py-3.5 font-medium text-ink transition-colors hover:border-gold/70 sm:w-auto"
            >
              L&apos;archivio, gratuito
            </Link>
            <Link
              href="/nuova-preghiera"
              className="btn-gold w-full rounded-xl px-7 py-3.5 font-medium text-white sm:w-auto"
            >
              Scrivi la tua intenzione — {formatPrice(single.amountCents)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
