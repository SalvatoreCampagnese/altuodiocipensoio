import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/LegalPage";
import { AUTHORITY, HOLDER, RETENTION, SUB_PROCESSORS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Informativa privacy — AlTuoDioCiPensoIO",
  description:
    "Come trattiamo i tuoi dati: cosa raccogliamo, su quale base giuridica, a chi lo comunichiamo, per quanto tempo e come esercitare i tuoi diritti.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Informativa privacy"
      intro="In breve: i tuoi dati servono a scrivere la tua preghiera e a nient'altro. Qui sotto, per esteso, chi li tratta e con quali regole."
    >
      <Section h="1. Chi tratta i tuoi dati">
        <p>
          Titolare del trattamento è <strong>{HOLDER.name}</strong>
          {HOLDER.form && ` (${HOLDER.form})`}, {HOLDER.address}, P. IVA {HOLDER.vat}.
        </p>
        <p>
          Trattandosi di una ditta individuale, il titolare è una persona fisica che risponde
          in proprio: per ogni richiesta relativa ai tuoi dati, o per un reclamo, scrivi a{" "}
          <a href={`mailto:${HOLDER.email}`} className="underline underline-offset-2 hover:text-ink">
            {HOLDER.email}
          </a>
          . Non è stato nominato un responsabile della protezione dei dati.
        </p>
      </Section>

      <Section h="2. Quali dati raccogliamo">
        <p>
          <strong>Che ci dai tu:</strong> il tuo indirizzo email; la tradizione religiosa e il
          tipo di preghiera che scegli; il testo della tua intenzione; se lo indichi, il nome
          della persona a cui la preghiera è dedicata; la lingua e il tono.
        </p>
        <p>
          <strong>Che nasce dall&apos;uso:</strong> lo storico degli ordini e il loro stato, il
          testo e l&apos;audio generati, le date di consegna.
        </p>
        <p>
          <strong>Che non abbiamo mai:</strong> i dati della tua carta. Il pagamento avviene
          interamente sulle pagine di Stripe e da noi transita solo l&apos;esito.
        </p>
      </Section>

      <Section h="3. Dati particolari, e perché serve un consenso a parte">
        <p>
          La tradizione religiosa che scegli rivela le tue <strong>convinzioni religiose</strong>.
          Se scrivi di una malattia — tua o di chi ami — quello è un <strong>dato sulla salute</strong>.
          Entrambi ricadono nell&apos;art. 9 GDPR, che li vieta in via generale salvo eccezioni.
        </p>
        <p>
          L&apos;eccezione su cui ci basiamo è il tuo <strong>consenso esplicito</strong> (art. 9
          par. 2 lett. a). Per questo la casella al momento dell&apos;acquisto è separata da
          quella di accettazione dei termini, non è pre-spuntata, e senza di essa
          l&apos;ordine viene rifiutato dal server e non solo dall&apos;interfaccia.
        </p>
        <p>
          Puoi <strong>revocare il consenso quando vuoi</strong>, scrivendo a{" "}
          <a href={`mailto:${HOLDER.email}`} className="underline underline-offset-2 hover:text-ink">
            {HOLDER.email}
          </a>
          . La revoca non tocca la liceità di quanto trattato prima, e comporta la
          cancellazione delle preghiere già prodotte se lo chiedi.
        </p>
      </Section>

      <Section h="4. Dati di altre persone">
        <p>
          Quando scrivi il nome di un malato o di un defunto, stai fornendo dati di qualcuno
          che non è davanti a noi e che non ci ha detto nulla. È il punto più delicato di
          questo servizio e non lo nascondiamo dietro una clausola.
        </p>
        <p>
          Al momento dell&apos;acquisto dichiari di avere titolo per fornirci quei dati e di
          aver informato le persone interessate quando ciò è dovuto. Ti chiediamo di{" "}
          <strong>inserire solo ciò che serve</strong>: un nome di battesimo basta quasi
          sempre, un cognome o un dettaglio clinico quasi mai. Se una persona interessata ci
          chiede la cancellazione dei propri dati, procediamo.
        </p>
        <p>
          I dati di persone decedute non sono dati personali ai sensi del GDPR, ma l&apos;art.
          2-<em>terdecies</em> del Codice privacy italiano riconosce ai familiari il diritto di
          intervenire: se ci scrivono, rispondiamo.
        </p>
      </Section>

      <Section h="5. Basi giuridiche">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Consenso esplicito</strong> (artt. 6.1.a e 9.2.a): dati religiosi e di
            salute contenuti nell&apos;intenzione.
          </li>
          <li>
            <strong>Esecuzione del contratto</strong> (art. 6.1.b): produzione e consegna della
            preghiera, gestione dell&apos;account e dell&apos;ordine.
          </li>
          <li>
            <strong>Obbligo legale</strong> (art. 6.1.c): conservazione dei documenti fiscali.
          </li>
          <li>
            <strong>Legittimo interesse</strong> (art. 6.1.f): sicurezza del servizio e
            statistiche aggregate di traffico, che non profilano e non usano cookie.
          </li>
        </ul>
      </Section>

      <Section h="6. Decisioni automatizzate e intelligenza artificiale">
        <p>
          Il testo della preghiera è generato da un modello linguistico e la voce è sintetica.
          Non c&apos;è nessuna decisione automatizzata che produca effetti giuridici o
          incida significativamente su di te ai sensi dell&apos;art. 22 GDPR: il risultato è un
          testo, non una valutazione della tua persona.
        </p>
        <p>
          Ai fornitori di intelligenza artificiale inviamo <strong>solo</strong> il contenuto
          necessario a comporre il testo: intenzione, tradizione, tipo, eventuale nome del
          destinatario. Non la tua email, non i tuoi dati di pagamento, non il tuo account.
        </p>
      </Section>

      <Section h="7. A chi comunichiamo i dati">
        <p>
          Non vendiamo dati, non li cediamo per finalità di marketing, non li mostriamo ad
          altri utenti. Li trattano per nostro conto, come responsabili, solo i fornitori che
          servono a far funzionare il servizio:
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-gold/25 text-left">
                <th className="py-2 pr-3 font-medium text-ink">Fornitore</th>
                <th className="py-2 pr-3 font-medium text-ink">Cosa riceve</th>
                <th className="py-2 font-medium text-ink">Dove</th>
              </tr>
            </thead>
            <tbody>
              {SUB_PROCESSORS.map((p) => (
                <tr key={p.name} className="border-b border-gold/10 align-top">
                  <td className="py-2.5 pr-3">
                    <span className="text-ink">{p.name}</span>
                    <br />
                    <span className="text-xs opacity-75">{p.purpose}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-xs">{p.data}</td>
                  <td className="py-2.5 text-xs">
                    {p.country}
                    <br />
                    <span className="opacity-70">{p.safeguard}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Alcuni fornitori hanno sede negli Stati Uniti: il trasferimento avviene sulla base
          delle clausole contrattuali standard adottate dalla Commissione europea e, dove
          applicabile, dell&apos;adesione del fornitore al Data Privacy Framework. Puoi
          chiederci copia delle garanzie.
        </p>
      </Section>

      <Section h="8. Per quanto tempo li conserviamo">
        <div className="space-y-3">
          {RETENTION.map((r) => (
            <div key={r.what}>
              <p className="text-ink">{r.what}</p>
              <p className="text-sm">
                <strong>{r.how}.</strong> {r.why}.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section h="9. Chi può vedere le tue preghiere">
        <p>
          Solo tu e chi riceve da te il link privato. Le pagine delle preghiere non sono
          indicizzate dai motori di ricerca ed escluse dalla sitemap; i file audio stanno in
          archiviazione privata e sono raggiungibili solo tramite link firmato a scadenza.
        </p>
        <p>
          Chi ha il link può vedere quella preghiera: trattalo come tratteresti la preghiera
          stessa.
        </p>
      </Section>

      <Section h="10. I tuoi diritti">
        <p>
          Puoi chiedere: <strong>accesso</strong> ai tuoi dati, <strong>rettifica</strong>,{" "}
          <strong>cancellazione</strong>, <strong>limitazione</strong> del trattamento,{" "}
          <strong>portabilità</strong> in formato leggibile, e <strong>opposizione</strong> ai
          trattamenti fondati sul legittimo interesse. Puoi inoltre revocare in ogni momento i
          consensi prestati.
        </p>
        <p>
          Scrivi a{" "}
          <a href={`mailto:${HOLDER.email}`} className="underline underline-offset-2 hover:text-ink">
            {HOLDER.email}
          </a>
          . Rispondiamo entro un mese, prorogabile di due in casi complessi dandotene conto.
        </p>
        <p>
          Se ritieni che il trattamento violi la normativa puoi proporre reclamo al{" "}
          <a
            href={AUTHORITY.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-ink"
          >
            {AUTHORITY.name}
          </a>{" "}
          ({AUTHORITY.address}), o ricorrere all&apos;autorità giudiziaria.
        </p>
      </Section>

      <Section h="11. Minori">
        <p>
          Il servizio non è rivolto a minori di 18 anni e non ne raccogliamo consapevolmente i
          dati. Se ci accorgiamo che un ordine è stato effettuato da un minore, lo annulliamo e
          cancelliamo i dati.
        </p>
      </Section>

      <Section h="12. Cookie">
        <p>
          Usiamo solo cookie tecnici, necessari a tenerti collegato al tuo account. Le
          statistiche di traffico sono anonime e senza cookie, quindi non trovi un banner di
          consenso: non ne serve uno.{" "}
          <Link href="/cookie" className="underline underline-offset-2 hover:text-ink">
            Il dettaglio.
          </Link>
        </p>
      </Section>

      <Section h="13. Modifiche">
        <p>
          Se cambiamo questa informativa pubblichiamo la nuova versione con una data diversa.
          Per ogni ordine registriamo la versione dei testi in vigore in quel momento, così
          resta sempre ricostruibile cosa avevi davanti quando hai acconsentito.
        </p>
      </Section>
    </LegalPage>
  );
}
