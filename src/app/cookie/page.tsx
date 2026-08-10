import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cookie — AlTuoDioCiPensoIO",
  description:
    "Quali cookie usiamo e perché non trovi un banner di consenso: solo cookie tecnici, statistiche anonime senza cookie.",
};

export default function CookiePage() {
  return (
    <LegalPage
      title="Cookie"
      intro="Non trovi un banner di consenso. Non è una dimenticanza: qui sotto c'è il motivo."
    >
      <Section h="Perché non c'è il banner">
        <p>
          Il consenso serve per i cookie di profilazione e per quelli non necessari. Noi non ne
          usiamo: niente pubblicità, niente remarketing, niente pixel di social network,
          nessuna condivisione con circuiti pubblicitari.
        </p>
        <p>
          Restano i soli <strong>cookie tecnici</strong>, che secondo le linee guida del Garante
          non richiedono consenso, ma di cui va data informazione: è questa pagina.
        </p>
      </Section>

      <Section h="Quali cookie tecnici usiamo">
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
            </tbody>
          </table>
        </div>
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

      <Section h="Come li gestisci">
        <p>
          Puoi cancellare o bloccare i cookie dalle impostazioni del browser. Se blocchi quelli
          tecnici, l&apos;accesso al tuo archivio smette di funzionare: è il loro compito, non un
          effetto collaterale.
        </p>
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
