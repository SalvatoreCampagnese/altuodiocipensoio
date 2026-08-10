import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — AlTuoDioCiPensoIO",
};

const SECTIONS: { h: string; p: string }[] = [
  {
    h: "Quali dati raccogliamo",
    p: "Il tuo indirizzo email, il contenuto della preghiera che ordini (religione, tipo, intenzione, eventuale destinatario) e i dati tecnici dell'ordine. I dati della carta non passano mai da noi: li gestisce interamente Stripe.",
  },
  {
    h: "Dati particolari",
    p: "La convinzione religiosa è una categoria particolare di dati personali ai sensi dell'art. 9 GDPR. La trattiamo solo sulla base del tuo consenso esplicito, che presti ordinando la preghiera, e per il solo scopo di produrla. Puoi revocarlo in qualsiasi momento chiedendo la cancellazione dell'account.",
  },
  {
    h: "Chi li tratta per noi",
    p: "Supabase (banca dati e archiviazione dei file audio), Stripe (pagamenti), OpenAI (composizione del testo) ed ElevenLabs (sintesi vocale). Ai fornitori di intelligenza artificiale inviamo il contenuto della preghiera, non la tua email né i dati di pagamento.",
  },
  {
    h: "Per quanto tempo",
    p: "Le preghiere restano nel tuo archivio finché non ci chiedi di rimuoverle. I dati fiscali degli ordini vengono conservati per il periodo previsto dalla legge.",
  },
  {
    h: "I tuoi diritti",
    p: "Puoi accedere ai tuoi dati, correggerli, esportarli, chiederne la cancellazione o opporti al trattamento scrivendo all'indirizzo di contatto del servizio. Rispondiamo entro trenta giorni.",
  },
  {
    h: "Chi può vedere le tue preghiere",
    p: "Solo tu e chi riceve da te il link privato. Le pagine delle preghiere non sono indicizzate dai motori di ricerca e i file audio sono in archiviazione privata, accessibili solo tramite link firmato a scadenza.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-5xl text-ink">Privacy</h1>
        <p className="mt-4 text-ink-soft">
          In breve: i tuoi dati servono a scrivere la tua preghiera e a nient&apos;altro.
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-2xl text-gold-deep">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{s.p}</p>
            </section>
          ))}
        </div>

        <p className="mt-14 rounded-xl border border-gold/15 bg-card p-5 text-sm leading-relaxed text-ink-soft">
          Questo testo descrive il funzionamento reale del servizio ma non sostituisce
          un&apos;informativa privacy redatta da un professionista: prima di andare in
          produzione, fallo verificare e completa i dati del titolare del trattamento.
        </p>
      </div>
    </div>
  );
}
