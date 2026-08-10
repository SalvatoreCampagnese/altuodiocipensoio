import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Candle } from "@/components/Candle";
import { SignOutButton } from "@/components/SignOutButton";
import { AutoDeliveryToggle } from "@/components/AutoDeliveryToggle";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/lib/supabase/server";
import { getPrayerType, getReligion } from "@/lib/religions";
import { formatPrice, getSingle } from "@/lib/pricing";
import { availableCredits, nextUnlockDate, type Bundle, type Prayer } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le mie preghiere — AlTuoDioCiPensoIO",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<Prayer["status"], string> = {
  draft: "In attesa di pagamento",
  queued: "In preparazione",
  generating: "In preparazione",
  ready: "Pronta",
  failed: "Non riuscita",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ bundle?: string }>;
}) {
  const { bundle: justBought } = await searchParams;

  const user = await getSessionUser();
  if (!user) redirect("/login");

  const db = createAdminClient();
  const email = user.email?.toLowerCase() ?? "";

  const [{ data: prayers }, { data: bundles }] = await Promise.all([
    db
      .from("prayers")
      .select("*")
      .or(`user_id.eq.${user.id},email.eq.${email}`)
      .order("created_at", { ascending: false })
      .returns<Prayer[]>(),
    db
      .from("bundles")
      .select("*")
      .or(`user_id.eq.${user.id},email.eq.${email}`)
      .order("created_at", { ascending: true })
      .returns<Bundle[]>(),
  ]);

  const single = getSingle();
  const list = prayers ?? [];
  const packs = bundles ?? [];
  const credits = packs.reduce((sum, b) => sum + availableCredits(b), 0);
  const remaining = packs.reduce((sum, b) => sum + (b.total_credits - b.used_credits), 0);
  const nextUnlock = packs
    .map(nextUnlockDate)
    .filter((d): d is Date => d !== null)
    .sort((a, b) => a.getTime() - b.getTime())[0];

  return (
    <div className="px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-ink">Le mie preghiere</h1>
            <p className="mt-2 text-sm text-ink-soft">{user.email}</p>
          </div>
          <SignOutButton />
        </header>

        {justBought && (
          <p className="mt-8 rounded-xl border border-gold/30 bg-gold/5 px-5 py-4 text-sm text-ink">
            Il pacchetto è tuo. La prima preghiera è già disponibile: le altre si
            sbloccano una alla volta, secondo il ritmo del pacchetto.
          </p>
        )}

        {/* Crediti */}
        <section className="mt-8 rounded-2xl border border-gold/20 bg-card p-6">
          {packs.length === 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-ink">Nessun pacchetto attivo</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  Novena, anno o trigesimo: una devozione intera, un giorno alla volta.
                  Oppure una preghiera sola a {formatPrice(single.amountCents)}.
                </p>
              </div>
              <Link
                href="/pacchetti"
                className="rounded-xl border border-gold/30 px-5 py-2.5 text-sm transition-colors hover:border-gold/60 hover:bg-gold/5"
              >
                Vedi i pacchetti
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-ink">
                  {credits > 0
                    ? `${credits} ${credits === 1 ? "preghiera disponibile" : "preghiere disponibili"}`
                    : "Nessuna preghiera disponibile adesso"}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {remaining} rimaste in totale
                  {nextUnlock && (
                    <>
                      <span className="mx-2 opacity-40">·</span>
                      prossima il {nextUnlock.toLocaleDateString("it-IT")}
                    </>
                  )}
                </p>
              </div>
              {credits > 0 ? (
                <Link
                  href="/dashboard/nuova"
                  className="rounded-xl btn-gold px-5 py-2.5 text-sm font-medium text-white"
                >
                  Usa una preghiera
                </Link>
              ) : (
                <Link
                  href="/nuova-preghiera"
                  className="rounded-xl border border-gold/30 px-5 py-2.5 text-sm transition-colors hover:border-gold/60 hover:bg-gold/5"
                >
                  Comprane una a {formatPrice(single.amountCents)}
                </Link>
              )}
            </div>
          )}

          {/* Consegna automatica, un interruttore per pacchetto */}
          {packs.length > 0 && (
            <div className="mt-6 space-y-4 border-t border-gold/15 pt-6">
              {packs
                .filter((b) => b.total_credits - b.used_credits > 0)
                .map((b) => (
                  <div key={b.id}>
                    {packs.length > 1 && (
                      <p className="mb-1.5 text-xs uppercase tracking-wider text-ink-soft/70">
                        {b.product_name ?? b.product_id}
                      </p>
                    )}
                    <AutoDeliveryToggle
                      bundleId={b.id}
                      enabled={b.auto_deliver}
                      hasTemplate={Boolean(b.template)}
                    />
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Archivio */}
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">Archivio</h2>

          {list.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gold/20 py-16 text-center">
              <Candle className="mx-auto h-12 w-12" />
              <p className="mt-6 font-display text-2xl text-ink">Ancora nessuna candela</p>
              <p className="mt-2 text-sm text-ink-soft">
                La prima preghiera che ordini comparirà qui.
              </p>
              <Link
                href="/nuova-preghiera"
                className="mt-8 inline-block rounded-xl btn-gold px-6 py-3 font-medium text-white"
              >
                Accendi una candela
              </Link>
            </div>
          ) : (
            <ul className="mt-6 space-y-3">
              {list.map((p) => {
                const religion = getReligion(p.religion);
                const type = getPrayerType(p.religion, p.prayer_type);
                return (
                  <li key={p.id}>
                    <Link
                      href={`/preghiera/${p.id}`}
                      className="block rounded-xl border border-gold/15 bg-card p-5 transition-colors hover:border-gold/40"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-display text-xl text-ink">
                            {p.title ?? type?.label ?? "Preghiera"}
                          </p>
                          <p className="mt-1 text-sm text-ink-soft">
                            {religion?.emoji} {religion?.label ?? p.religion}
                            <span className="mx-2 opacity-40">·</span>
                            {type?.label ?? p.prayer_type}
                            {p.recipient_name && (
                              <>
                                <span className="mx-2 opacity-40">·</span>
                                per {p.recipient_name}
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-right text-xs">
                          <span
                            className={
                              p.status === "ready"
                                ?"text-gold"
                                : p.status === "failed"
                                  ?"text-ember"
                                  :"text-ink-soft"
                            }
                          >
                            {STATUS_LABEL[p.status]}
                          </span>
                          <p className="mt-1 text-ink-soft/60">
                            {new Date(p.created_at).toLocaleDateString("it-IT")}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
