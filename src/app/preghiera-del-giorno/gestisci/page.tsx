import type { Metadata } from "next";
import Link from "next/link";
import { Candle } from "@/components/Candle";
import { ManageSubscription } from "@/components/ManageSubscription";
import {
  activeSubscriptionFor,
  describeSubscription,
  subscriptionByToken,
} from "@/lib/dailyPrayer";
import { getDailySubscription, toPublicSubscription } from "@/lib/pricing";
import { getSessionUser } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gestisci l'abbonamento",
  // Pagina personale raggiunta da un token: non ha niente da fare in SERP,
  // e indicizzarla significherebbe pubblicare un URL che dà accesso.
  robots: { index: false, follow: false },
};

export default async function ManagePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const config = getDailySubscription();
  const pub = toPublicSubscription(config);

  const user = await getSessionUser();
  const sub =
    (token ? await subscriptionByToken(token) : null) ??
    (user?.email ? await activeSubscriptionFor(user.email) : null);

  if (!sub) {
    return (
      <div className="px-6 py-24 text-center">
        <Candle className="mx-auto h-14 w-14" />
        <h1 className="mt-8 font-display text-4xl text-ink">Abbonamento non trovato</h1>
        <p className="mx-auto mt-4 max-w-md text-balance leading-relaxed text-ink-soft">
          Il link potrebbe essere incompleto: gli indirizzi lunghi vengono spesso spezzati a
          metà dai programmi di posta. Riaprilo dall&apos;email originale, o accedi con
          l&apos;indirizzo con cui ti sei abbonato.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-gold/35 px-6 py-3 text-sm transition-colors hover:border-gold/60 hover:bg-gold/5"
          >
            Accedi
          </Link>
          <Link
            href="/preghiera-del-giorno"
            className="btn-gold rounded-xl px-6 py-3 text-sm font-medium text-white"
          >
            La Preghiera del Giorno
          </Link>
        </div>
      </div>
    );
  }

  const ended = sub.status === "canceled";
  const stopping = sub.cancel_at_period_end;

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-xl">
        <header className="text-center">
          <Candle className="mx-auto h-14 w-14" />
          <h1 className="mt-7 font-display text-4xl text-ink">Il tuo abbonamento</h1>
          <p className="mt-3 text-sm text-ink-soft">{sub.email}</p>
        </header>

        <section className="card mt-10 rounded-2xl p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-2xl text-ink">{config.name}</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                ended || stopping
                  ? "border border-ink-soft/25 text-ink-soft"
                  : "btn-gold text-white"
              }`}
            >
              {ended ? "Terminato" : stopping ? "In scadenza" : "Attivo"}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-ink-soft">{describeSubscription(sub)}</p>

          <dl className="mt-6 space-y-2 border-t border-gold/15 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Prezzo</dt>
              <dd className="text-ink">
                {pub.perDay} al giorno · {pub.billing}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Consegna</dt>
              <dd className="text-ink">Ogni mattina alle {pub.deliveryHour}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Attivo dal</dt>
              <dd className="text-ink">
                {new Date(sub.started_at).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </section>

        {!ended && (
          <section className="mt-8 rounded-2xl border border-gold/15 bg-paper-warm/40 p-6">
            {/* Il blocco resta anche a disdetta già data: fino alla scadenza
                si può ancora avere bisogno di una ricevuta o di correggere
                la carta per l'ultimo addebito. */}
            {stopping && (
              <p className="mb-4 text-sm leading-relaxed text-ink-soft">
                La disdetta è già registrata: non c&apos;è altro da fare. Il portale qui sotto
                resta aperto finché l&apos;abbonamento è in corso, per le ricevute.
              </p>
            )}
            <ManageSubscription
              token={sub.manage_token}
              canCancel={!stopping}
              needsCard={sub.status === "past_due"}
            />
          </section>
        )}

        {(ended || stopping) && (
          <p className="mt-8 text-center text-sm leading-relaxed text-ink-soft">
            Se cambi idea puoi riabbonarti quando vuoi, dalla{" "}
            <Link
              href="/preghiera-del-giorno"
              className="font-medium text-gold-deep underline underline-offset-2"
            >
              pagina della Preghiera del Giorno
            </Link>
            .
          </p>
        )}

        <p className="mt-10 text-center text-sm">
          <Link
            href={`/preghiera-del-giorno?token=${encodeURIComponent(sub.manage_token)}`}
            className="text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Leggi la preghiera di oggi
          </Link>
        </p>
      </div>
    </div>
  );
}
