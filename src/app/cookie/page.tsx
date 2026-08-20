import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie — AlTuoDioCiPensoIO",
  description:
    "Quali cookie usiamo, quali usa Google per la pubblicità, e come cambiare idea sul consenso in qualsiasi momento.",
};

/**
 * Questa pagina è cambiata da cima a fondo con l'arrivo di AdSense.
 *
 * Prima diceva — e in quel momento era vero — che non c'erano cookie di
 * profilazione e che perciò non serviva un banner. Dal momento in cui il sito
 * carica lo script di Google quella frase è falsa, e una cookie policy falsa
 * è peggio di una assente: è una dichiarazione, non un'omissione.
 */
export default function CookiePage() {
  return (
    <LegalPage
      title="Cookie"
      intro="Cosa viene salvato sul tuo dispositivo, da chi, e come dire di no."
    >
      <Section h="In breve">
        <p>
          Il sito usa <strong>cookie tecnici</strong>, che servono a farlo funzionare e non
          richiedono il tuo consenso, e ospita <strong>pubblicità di Google</strong>, che usa
          cookie di profilazione e richiede il tuo consenso.
        </p>
        <p>
          Per questo, se ci arrivi dall&apos;Europa, la prima volta trovi un messaggio che ti
          chiede di scegliere. La scelta la registra Google e puoi cambiarla quando vuoi: come,
          è scritto in fondo a questa pagina.
        </p>
      </Section>

      <Section h="Cookie tecnici — nessun consenso richiesto">
        <p>
          Secondo le linee guida del Garante non richiedono consenso, ma va data informazione:
          è questa tabella.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gold/25 text-left">
                <th className="py-2 pr-3 font-medium text-ink">Cookie</th>
                <th className="py-2 pr-3 font-medium text-ink">A cosa serve</th>
                <th className="py-2 font-medium text-ink">Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gold/10 align-top">
                <td className="py-2.5 pr-3">Sessione Supabase</td>
                <td className="py-2.5 pr-3 text-xs">
                  Ti tiene collegato al tuo account fra una pagina e l&apos;altra. Senza,
                  dovresti autenticarti a ogni clic.
                </td>
                <td className="py-2.5 text-xs">Durata della sessione</td>
              </tr>
              <tr className="border-b border-gold/10 align-top">
                <td className="py-2.5 pr-3">Stripe</td>
                <td className="py-2.5 pr-3 text-xs">
                  Impostati sulle pagine di pagamento di Stripe per sicurezza e prevenzione
                  delle frodi. Non sono nostri e non li leggiamo.
                </td>
                <td className="py-2.5 text-xs">Definita da Stripe</td>
              </tr>
              <tr className="border-b border-gold/10 align-top">
                <td className="py-2.5 pr-3">Scelta sui cookie</td>
                <td className="py-2.5 pr-3 text-xs">
                  Registra la risposta che dai al messaggio sul consenso, per non ripetertelo a
                  ogni pagina. Lo imposta Google, che gestisce il messaggio.
                </td>
                <td className="py-2.5 text-xs">Fino a 13 mesi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section h="Cookie pubblicitari — solo con il tuo consenso">
        <p>
          Il sito ospita annunci serviti da <strong>Google AdSense</strong>. Servono a tenere
          gratuito l&apos;archivio delle preghiere della tradizione, che è e resta la parte del
          sito che non si paga.
        </p>
        <p>
          Google, e i suoi partner pubblicitari, possono impostare cookie per misurare quanti
          vedono un annuncio, limitare quante volte lo rivedi, rilevare i clic fraudolenti e —
          <strong> solo se acconsenti</strong> — mostrarti annunci scelti in base ai tuoi
          interessi e alla tua navigazione su altri siti.
        </p>
        <p>
          <strong>Se rifiuti, gli annunci restano</strong> ma diventano non personalizzati:
          scelti sul contenuto della pagina che stai leggendo invece che su di te. Il sito
          funziona identico in entrambi i casi, e nessuna parte di ciò che acquisti dipende da
          questa scelta.
        </p>
        <p>
          Non abbiamo accesso a quei cookie e non li leggiamo: sono di Google, che per quel
          trattamento agisce come titolare autonomo. Il dettaglio di cosa raccoglie sta nella{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2 hover:text-ink"
          >
            sua informativa per i siti partner
          </a>
          .
        </p>
        <p>
          Le posizioni degli annunci le sceglie Google in automatico, quindi possono comparire
          in qualunque punto del sito — anche accanto a una preghiera che hai acquistato.
        </p>
        <p>
          Quello che <strong>non</strong> facciamo, e non faremo: passare a Google, o a
          chiunque altro a fini pubblicitari, la tradizione religiosa che scegli, il testo
          della tua intenzione, il nome della persona a cui una preghiera è dedicata o
          l&apos;esistenza di un tuo abbonamento. Un annuncio può stare <em>vicino</em> alla
          tua preghiera; non sa cosa c&apos;è scritto dentro, e non lo saprà.
        </p>
      </Section>

      <Section h="Le statistiche di traffico">
        <p>
          Contiamo le visite per capire quali pagine servono davvero, ma lo strumento che usiamo
          — Vercel Web Analytics — <strong>non imposta cookie</strong>, non assegna un
          identificativo persistente e non segue le persone da un sito all&apos;altro. Vediamo
          numeri aggregati: quante visite ha una pagina, quante volte è stato avviato un
          acquisto. Non vediamo chi sei.
        </p>
      </Section>

      <Section h="Come cambiare idea">
        <p>
          Il consenso si revoca con la stessa facilità con cui si dà, ed è un tuo diritto, non
          una cortesia:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            dal <strong>messaggio sulla privacy</strong> che compare in fondo alla pagina, che
            puoi riaprire quando vuoi per rivedere la scelta;
          </li>
          <li>
            dalle{" "}
            <a
              href="https://myadcenter.google.com/"
              target="_blank"
              rel="noopener"
              className="underline underline-offset-2 hover:text-ink"
            >
              impostazioni degli annunci Google
            </a>
            , che valgono su tutti i siti e non solo su questo;
          </li>
          <li>
            cancellando o bloccando i cookie dalle impostazioni del browser. Se blocchi quelli
            tecnici, l&apos;accesso al tuo archivio smette di funzionare: è il loro compito, non
            un effetto collaterale.
          </li>
        </ul>
        <p>
          Per tutto il resto vale l&apos;
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            informativa privacy
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
