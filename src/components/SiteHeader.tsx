import Link from "next/link";
import { getSessionUser } from "@/lib/supabase/server";
import { formatPrice, getDailySubscription } from "@/lib/pricing";
import { Candle } from "./Candle";

/**
 * La testata.
 *
 * Il bottone d'oro è l'abbonamento e non più la preghiera singola: è l'unico
 * prodotto ricorrente del catalogo, ed è quello che va offerto per primo a
 * chi arriva senza sapere cosa cercare. Il su misura resta a un clic di
 * distanza, ma come voce di menu — chi lo vuole lo sta già cercando.
 */
export async function SiteHeader() {
  const user = await getSessionUser();
  const sub = getDailySubscription();

  return (
    <header className="sticky top-0 z-50 border-b border-gold/15 bg-paper/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <Candle className="h-6 w-6 transition-transform duration-500 group-hover:scale-110" />
          <span className="font-display text-xl tracking-wide text-ink">
            AlTuoDio<span className="text-gold-deep">CiPensoIO</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/preghiere-tradizionali"
            className="hidden rounded-lg px-3 py-2 text-ink-soft transition-colors hover:text-ink lg:block"
          >
            Archivio
          </Link>
          <Link
            href="/nuova-preghiera"
            className="hidden rounded-lg px-3 py-2 text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Su misura
          </Link>
          <Link
            href="/lucernario"
            className="hidden rounded-lg px-3 py-2 text-ink-soft transition-colors hover:text-ink lg:block"
          >
            Lucernario
          </Link>
          <Link
            href="/pacchetti"
            className="hidden rounded-lg px-3 py-2 text-ink-soft transition-colors hover:text-ink lg:block"
          >
            Pacchetti
          </Link>
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-ink-soft transition-colors hover:text-ink"
            >
              Le mie preghiere
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-ink-soft transition-colors hover:text-ink"
            >
              Accedi
            </Link>
          )}
          <Link
            href="/preghiera-del-giorno?da=header"
            className="btn-gold rounded-lg px-4 py-2 font-medium text-white"
          >
            Preghiera del giorno
            <span className="ml-1.5 hidden opacity-85 sm:inline">
              {formatPrice(sub.perDayCents)}/giorno
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
