import type { Metadata } from "next";
import { PrayerForm } from "@/components/PrayerForm";
import { getSessionUser } from "@/lib/supabase/server";
import { formatPrice, getEtaMinutes, getSingle } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Una nuova preghiera — AlTuoDioCiPensoIO",
  description: "Scegli la tua fede, il tipo di preghiera e scrivi la tua intenzione.",
};

export default async function NewPrayerPage({
  searchParams,
}: {
  searchParams: Promise<{
    annullato?: string;
    /** Precompilazioni che arrivano dalle landing. */
    fede?: string;
    intenzione?: string;
    lingua?: string;
    /** Landing di provenienza, per l'attribuzione della conversione. */
    da?: string;
  }>;
}) {
  const { annullato, fede, intenzione, lingua, da } = await searchParams;

  const email = (await getSessionUser())?.email ?? "";
  const single = getSingle();
  const eta = getEtaMinutes();

  return (
    <div className="sunlit px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">La tua preghiera</h1>
          <p className="mx-auto mt-4 max-w-lg text-balance leading-relaxed text-ink-soft">
            Quattro campi e {formatPrice(single.amountCents)}. Testo e voce
            sono pronti entro {eta} {eta === 1 ? "minuto" : "minuti"}.
          </p>
        </header>

        {annullato && (
          <p className="mb-8 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-center text-sm text-ink-soft">
            Pagamento annullato. Quello che avevi scritto è ancora qui: puoi riprovare
            quando vuoi.
          </p>
        )}

        <PrayerForm
          defaultEmail={email}
          priceLabel={formatPrice(single.amountCents)}
          etaMinutes={eta}
          initialReligion={fede}
          initialPrayerType={intenzione}
          initialLanguage={lingua}
          landing={da}
        />
      </div>
    </div>
  );
}
