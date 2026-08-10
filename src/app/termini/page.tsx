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
          sistemi. Non ci sono rinnovi automatici: ogni acquisto è singolo.
        </p>
        <p>
          I pacchetti (novena, trigesimo, l&apos;anno) danno diritto a un numero determinato di
          preghiere, che si sbloccano secondo il ritmo indicato nella scheda del prodotto. I
          crediti non scadono.
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

      <Section h="9. Reclami, legge e foro">
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
