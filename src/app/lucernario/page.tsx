import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Lucernario, type PublicSlot } from "@/components/Lucernario";
import { DailyPrayerUpsell } from "@/components/DailyPrayerUpsell";
import { Reveal } from "@/components/Reveal";
import { getLucernario } from "@/lib/pricing";
import { loadWall, remainingLabel } from "@/lib/lucernario";
import { getSessionUser } from "@/lib/supabase/server";

// La parete cambia di continuo: niente cache.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Il Lucernario — AlTuoDioCiPensoIO",
  description:
    "Una parete di candele votive. Scegli tu l'importo, accendine una e resterà accesa per te.",
};

export default async function LucernarioPage({
  searchParams,
}: {
  searchParams: Promise<{ annullato?: string; accesa?: string }>;
}) {
  const { annullato, accesa } = await searchParams;

  const config = getLucernario();
  if (!config.enabled) notFound();

  const [wall, user] = await Promise.all([loadWall(), getSessionUser()]);

  const slots: PublicSlot[] = wall.map((s) => ({
    slot: s.slot,
    lit: s.candle !== null,
    donorName: s.candle?.donor_name ?? null,
    intention: s.candle?.intention ?? null,
    remaining: s.candle ? remainingLabel(s.candle.expires_at) : null,
  }));

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <header className="text-center">
          <p className="rise text-sm uppercase tracking-[0.28em] text-gold-deep">
            Importo libero
          </p>
          <h1
            className="rise mt-5 text-balance font-display text-5xl leading-tight text-ink sm:text-6xl"
            style={{ animationDelay: "180ms" }}
          >
            Il Lucernario
          </h1>
          <p
            className="rise mx-auto mt-6 max-w-xl text-balance leading-relaxed text-ink-soft"
            style={{ animationDelay: "340ms" }}
          >
            {config.slots} candele, come nella nicchia laterale di una chiesa. Scegline
            una spenta, scegli tu l&apos;importo e accendila: resterà accesa
            {config.hours} ore, con il tuo nome sotto se vuoi.
          </p>
        </header>

        {accesa && (
          <p className="mt-10 rounded-xl border border-gold/40 bg-gold/8 px-5 py-4 text-center text-ink">
            La tua candela è accesa. Grazie: resterà così per {config.hours} ore.
          </p>
        )}
        {annullato && (
          <p className="mt-10 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-center text-sm text-ink-soft">
            Pagamento annullato. Nessun addebito è stato effettuato.
          </p>
        )}

        <div className="mt-14">
          <Reveal>
            <Lucernario
              slots={slots}
              hours={config.hours}
              minCents={config.minCents}
              suggestedCents={config.suggestedCents}
              defaultEmail={user?.email ?? ""}
            />
          </Reveal>
        </div>

        <Reveal>
          <section className="mx-auto mt-20 max-w-xl space-y-8 text-center">
            <div>
              <h2 className="font-display text-2xl text-gold-deep">Perché un&apos;importo libero</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Come nelle chiese, dove la candela non ha un listino. Un euro vale
                quanto venti: la candela si accende lo stesso e resta accesa lo
                stesso tempo.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-gold-deep">Cosa vede chi passa</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Solo il nome che scegli di lasciare e la dedica, se la scrivi. Mai la
                cifra, mai la tua email. Se non scrivi nulla, la candela resta anonima.
              </p>
            </div>
          </section>
        </Reveal>

        <DailyPrayerUpsell variant="banner" from="lucernario" className="mt-14" />
      </div>
    </div>
  );
}
