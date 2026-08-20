import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/LegalPage";
import { HOLDER } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Termini e condizioni — AlTuoDioCiPensoIO",
  description:
    "Cosa acquisti esattamente, come funziona il recesso per i contenuti digitali, cosa il servizio non è e non promette.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Termini e condizioni"
      intro="Cosa acquisti, cosa non stai acquistando, e cosa succede se qualcosa va storto."
    >
      <Section h="1. Chi siamo e cosa vendiamo">
        <p>
          Il servizio consente di ordinare un testo di preghiera personalizzato, composto con
          l&apos;assistenza dell&apos;intelligenza artificiale sulla base dell&apos;intenzione
          che scrivi e della tradizione religiosa che scegli, e di riceverlo accompagnato da
          una registrazione audio con voce sintetica.
        </p>
        <p>
          Consente inoltre di abbonarsi a <strong>La Preghiera del Giorno</strong>: un testo
          nuovo ogni mattina, uguale per tutti gli abbonati, recapitato via email. È
          l&apos;unico prodotto ricorrente del catalogo e se ne parla al punto 3-bis.
        </p>
        <p>
          Il contratto si conclude quando il pagamento va a buon fine. Il venditore è il
          titolare indicato in fondo a questa pagina.
        </p>
      </Section>

      <Section h="2. Cosa NON è questo servizio">
        <p>Questo è il punto più importante della pagina, quindi è in cima e non in fondo.</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Non c&apos;è nessuna persona che prega per te.</strong> Il testo è generato
            da un modello linguistico e la voce è sintetica. Nessun sacerdote, imam, rabbino,
            monaco o ministro di culto interviene in alcuna fase.
          </li>
          <li>
            <strong>Non siamo affiliati</strong> ad alcuna Chiesa, confessione, congregazione,
            diocesi, moschea, sinagoga, tempio o autorità religiosa, e non agiamo per loro
            conto né con la loro approvazione.
          </li>
          <li>
            <strong>Non è un rito né un sacramento</strong> e non ne produce gli effetti. Una
            Messa, un funerale religioso, un Kaddish con il minyan, un&apos;Ardās al gurdwara si
            richiedono alle rispettive comunità.
          </li>
          <li>
            <strong>Non sostituisce</strong> accompagnamento pastorale, sostegno psicologico o
            cure mediche. Se stai attraversando un momento grave, cerca anche una persona vera.
          </li>
          <li>
            <strong>Non promettiamo alcun esito.</strong> Non garantiamo guarigioni, grazie,
            protezione, fortuna o risultati di alcun tipo. Chi lo promette ti sta ingannando.
          </li>
        </ul>
      </Section>

      <Section h="3. Prezzi e pagamento">
        <p>
          I prezzi sono indicati sul sito in euro e comprendono l&apos;IVA se dovuta. Il
          pagamento avviene tramite Stripe; i dati della carta non transitano dai nostri
          sistemi. <strong>Gli acquisti singoli e i pacchetti non si rinnovano:</strong> si
          paga una volta e non resta nulla da disdire. L&apos;unica eccezione è
          l&apos;abbonamento del punto seguente, che si rinnova per sua natura e lo dichiara
          in ogni pagina in cui viene offerto.
        </p>
        <p>
          I pacchetti (novena, trigesimo, l&apos;anno) danno diritto a un numero determinato di
          preghiere, che si sbloccano secondo il ritmo indicato nella scheda del prodotto. I
          crediti non scadono.
        </p>
      </Section>

      <Section h="3-bis. L'abbonamento alla Preghiera del Giorno">
        <p>
          <strong>Cosa ricevi.</strong> Ogni mattina, intorno alle nove ora italiana, una
          preghiera nuova via email. È la stessa per tutte le persone abbonate: non è
          personalizzata sulla tua situazione, e non lo diventa. Se ti serve un testo scritto
          per un caso preciso, quello è il prodotto su misura ed è un acquisto a parte.
        </p>
        <p>
          <strong>Come si paga.</strong> Il prezzo è annunciato al giorno, ma
          l&apos;addebito è raggruppato per periodo — trovi l&apos;importo esatto e la
          frequenza scritti sotto al bottone d&apos;iscrizione, sulla pagina del prodotto e
          nell&apos;email di conferma. Sull&apos;estratto conto vedrai un addebito per
          periodo, non uno al giorno. Il rinnovo è automatico finché non disdici.
        </p>
        <p>
          <strong>Come si disdice.</strong> Con un clic, dal link presente in fondo a ogni
          email ricevuta, oppure dalla pagina di gestione del tuo abbonamento. Non serve un
          account, non serve una motivazione, non serve contattarci. La disdetta ha effetto
          alla fine del periodo già pagato: fino a quel giorno continui a ricevere la
          preghiera, e dopo non ci sono altri addebiti.
        </p>
        <p>
          <strong>Se il pagamento non va a buon fine</strong>, Stripe riprova per alcuni
          giorni. In quella finestra continui a ricevere la preghiera: non interrompiamo il
          servizio al primo tentativo fallito. Se alla fine non si riesce, l&apos;abbonamento
          si chiude da sé e nessun importo resta dovuto.
        </p>
        <p>
          <strong>Se il prezzo cambia</strong>, te lo comunichiamo via email prima che il
          nuovo prezzo si applichi, con un anticipo che ti lasci il tempo di disdire. Un
          aumento non entra mai in vigore su un periodo già pagato.
        </p>
        <p>
          <strong>Se una mattina la preghiera non arriva</strong> per un guasto nostro,
          scrivici: rimborsiamo i giorni non serviti o li aggiungiamo alla fine
          dell&apos;abbonamento, come preferisci.
        </p>
      </Section>

      <Section h="4. Diritto di recesso">
        <p>
          Per gli acquisti online il consumatore ha di norma quattordici giorni per recedere
          senza motivo. Per i <strong>contenuti digitali</strong> la legge prevede però
          un&apos;eccezione: il diritto si perde se l&apos;esecuzione comincia con
          l&apos;accordo espresso del consumatore e con la sua presa d&apos;atto della perdita
          del diritto (art. 59 comma 1 lett. o, D.Lgs. 206/2005).
        </p>
        <p>
          È esattamente ciò che spunti al momento dell&apos;acquisto: chiedi che la preghiera
          sia prodotta subito, e prendi atto che a produzione completata non potrai più
          recedere. Senza quella spunta l&apos;ordine non parte.
        </p>
        <p>
          <strong>Per l&apos;abbonamento</strong> vale lo stesso principio, applicato giorno
          per giorno: perdi il recesso sulle preghiere che ti sono già state consegnate, non
          su quelle future. Se recedi entro quattordici giorni dall&apos;iscrizione ti
          rimborsiamo la parte di periodo non ancora goduta, trattenendo solo i giorni
          effettivamente serviti. Dopo i quattordici giorni resta comunque la disdetta, che
          puoi esercitare in qualunque momento e senza motivo.
        </p>
        <p>
          <strong>Finché la preghiera non è stata prodotta</strong>, il recesso resta possibile:
          scrivici a{" "}
          <a href={`mailto:${HOLDER.email}`} className="underline underline-offset-2 hover:text-ink">
            {HOLDER.email}
          </a>{" "}
          e rimborsiamo. Lo stesso vale per i crediti di un pacchetto non ancora utilizzati.
        </p>
      </Section>

      <Section h="5. Se qualcosa va storto">
        <p>
          Se la generazione fallisce, il sistema riprova da solo. Se non riesce comunque, o se
          il risultato è manifestamente difettoso — testo troncato, lingua sbagliata, audio
          illeggibile — scrivici: rigeneriamo la preghiera senza costi o rimborsiamo.
        </p>
        <p>
          Restano ferme le garanzie legali di conformità previste dal Codice del Consumo per i
          contenuti digitali.
        </p>
      </Section>

      <Section h="6. Come devi usarlo">
        <p>Ordinando dichiari che:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>hai almeno 18 anni;</li>
          <li>
            hai titolo per fornirci i dati delle altre persone che nomini, e le hai informate
            quando dovuto;
          </li>
          <li>
            non userai il servizio per offendere, deridere o denigrare una fede o una persona,
            né per contenuti illeciti, molesti o diffamatori.
          </li>
        </ul>
        <p>
          Ci riserviamo di rifiutare o annullare, con rimborso, gli ordini il cui contenuto
          violi questi punti. Trattiamo ogni tradizione con lo stesso rispetto e ci aspettiamo
          lo stesso da chi usa il servizio.
        </p>
      </Section>

      <Section h="7. Di chi è il testo che ricevi">
        <p>
          Il testo e l&apos;audio prodotti su tua richiesta sono tuoi: puoi leggerli,
          ascoltarli, stamparli, condividerli, leggerli a un funerale o in una cerimonia
          privata.
        </p>
        <p>
          Restano nostri il sito, la grafica, i testi editoriali e il catalogo delle tradizioni.
          Il servizio non rivendica diritti sulle formule liturgiche tradizionali che compaiono
          nei testi: appartengono alle rispettive tradizioni, non a noi.
        </p>
      </Section>

      <Section h="8. Responsabilità">
        <p>
          Ci impegniamo a fornire il servizio con diligenza, ma non garantiamo che sia sempre
          disponibile senza interruzioni: dipendiamo da fornitori terzi. Non rispondiamo delle
          conseguenze di scelte che tu prenda sulla base del testo ricevuto, né di aspettative
          di natura spirituale, che per loro stessa natura nessuno può garantire.
        </p>
        <p>
          Nulla in questi termini limita la responsabilità per dolo o colpa grave, né i diritti
          che la legge riconosce al consumatore e a cui non si può rinunciare.
        </p>
      </Section>

      <Section h="9. Pubblicità">
        <p>
          Il sito ospita annunci serviti da <strong>Google AdSense</strong>, riconoscibili
          dall&apos;etichetta che Google vi appone. Sono ciò che tiene gratuito
          l&apos;archivio delle preghiere della tradizione.
        </p>
        <p>
          <strong>Dove compaiono:</strong> potenzialmente ovunque nel sito. Le posizioni le
          sceglie Google, con la funzione &laquo;annunci automatici&raquo;, valutando pagina
          per pagina dove un annuncio rende di più. Non le decidiamo noi, e non possiamo
          elencartele in anticipo. Un annuncio può quindi comparire anche accanto a una
          preghiera che hai acquistato, nel Lucernario o durante il percorso di acquisto.
        </p>
        <p>
          <strong>Acquistare non toglie la pubblicità.</strong> Il prezzo che paghi è quello
          della preghiera, non di una versione del sito senza annunci: sono due cose distinte,
          ed è giusto che tu lo sappia prima e non dopo.
        </p>
        <p>
          Gli annunci usano cookie e richiedono il tuo consenso, che ti viene chiesto al primo
          accesso e che puoi revocare quando vuoi. Se lo neghi gli annunci restano, ma non
          personalizzati, e <strong>nulla del servizio che acquisti cambia</strong>: né il
          prezzo, né il contenuto, né i tempi. Il dettaglio è nella{" "}
          <Link href="/cookie" className="underline underline-offset-2 hover:text-ink">
            pagina sui cookie
          </Link>
          .
        </p>
        <p>
          Anche i contenuti li sceglie Google: possiamo escludere categorie e singoli
          inserzionisti, ma non conoscerli uno per uno in anticipo. Se ne vedi uno
          inappropriato per il contesto — e su un sito come questo può succedere, perché una
          pagina sul lutto è una pagina come le altre per un sistema automatico —{" "}
          <a href={`mailto:${HOLDER.email}`} className="underline underline-offset-2 hover:text-ink">
            segnalacelo
          </a>
          : bloccare quell&apos;inserzionista o quella categoria è una cosa che possiamo fare,
          e la facciamo. Non rispondiamo dei prodotti, dei servizi né delle informative
          privacy degli inserzionisti: quando apri un annuncio esci dal nostro sito, e da quel
          momento vale ciò che dichiara la loro pagina.
        </p>
      </Section>

      <Section h="10. Reclami, legge e foro">
        <p>
          Per qualunque contestazione scrivici prima a{" "}
          <a href={`mailto:${HOLDER.email}`} className="underline underline-offset-2 hover:text-ink">
            {HOLDER.email}
          </a>
          : quasi tutto si risolve così.
        </p>
        <p>
          Il contratto è regolato dalla legge italiana. Se sei un consumatore, resta competente
          il giudice del luogo in cui risiedi o hai domicilio, e puoi ricorrere alla
          piattaforma europea di risoluzione delle controversie online.
        </p>
        <p>
          Per il trattamento dei tuoi dati vale l&apos;
          <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
            informativa privacy
          </Link>
          , che è parte integrante di questi termini.
        </p>
      </Section>
    </LegalPage>
  );
}
