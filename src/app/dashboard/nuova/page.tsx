import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PrayerForm } from "@/components/PrayerForm";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";
import { availableCredits, nextUnlockDate, type Bundle } from "@/lib/types";
import { formatPrice, getSingle } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Usa una preghiera — AlTuoDioCiPensoIO",
  robots: { index: false, follow: false },
};

export default async function RedeemPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const db = createAdminClient();
  const { data: bundles } = await db
    .from("bundles")
    .select("*")
    .or(`user_id.eq.${user.id},email.eq.${user.email?.toLowerCase() ?? ""}`)
    .returns<Bundle[]>();

  const single = getSingle();
  const packs = bundles ?? [];
  const credits = packs.reduce((sum, b) => sum + availableCredits(b), 0);

  if (credits === 0) {
    const next = packs
      .map(nextUnlockDate)
      .filter((d): d is Date => d !== null)
      .sort((a, b) => a.getTime() - b.getTime())[0];

    return (
      <div className="px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-ink">Nessuna preghiera disponibile</h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
          {next
            ? `Hai già usato le preghiere disponibili. La prossima si sblocca il ${next.toLocaleDateString("it-IT")}.`
            :"Il tuo pacchetto è esaurito. Puoi prenderne un altro o comprare una singola preghiera."}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/nuova-preghiera"
            className="rounded-xl btn-gold px-6 py-3 font-medium text-white"
          >
            Una preghiera — {formatPrice(single.amountCents)}
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-gold/30 px-6 py-3 transition-colors hover:border-gold/60 hover:bg-gold/5"
          >
            Torna all&apos;archivio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sunlit px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <h1 className="font-display text-4xl text-ink sm:text-5xl">
            La tua prossima preghiera
          </h1>
          <p className="mt-4 text-ink-soft">
            {credits === 1
              ?"Hai una preghiera disponibile."
              : `Hai ${credits} preghiere disponibili.`}{" "}
            Niente da pagare.
          </p>
        </header>

        <PrayerForm mode="redeem" defaultEmail={user.email ?? ""} lockEmail />
      </div>
    </div>
  );
}
