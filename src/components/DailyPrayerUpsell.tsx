import Link from "next/link";
import { Candle } from "./Candle";
import { getDailySubscription, toPublicSubscription } from "@/lib/pricing";

/**
 * L'offerta di punta, in quattro formati.
 *
 * Un solo componente e non quattro copie sparse: il prezzo e le condizioni
 * dell'abbonamento compaiono in una dozzina di punti del sito, e la prima
 * volta che cambia il listino senza che cambino tutti insieme si è pubblicato
 * un prezzo sbagliato. Qui la fonte è una — `getDailySubscription()` — e la
 * variante decide solo quanto spazio occupa.
 *
 *   banner  striscia sottile, in cima alle pagine di servizio
 *   card    riquadro con il bottone, nelle colonne e nelle griglie
 *   inline  una riga di testo in fondo a un contenuto
 *   hero    la sezione grande, per la home
 *
 * Nessuna variante contiene il modulo d'iscrizione: portano tutte a
 * `/preghiera-del-giorno`, dove c'è la preghiera di oggi da leggere. Un
 * campo email in fondo a un articolo converte molto meno di una pagina che
 * prima fa vedere il prodotto.
 */
export function DailyPrayerUpsell({
  variant = "card",
  from = "",
  className = "",
}: {
  variant?: "banner" | "card" | "inline" | "hero";
  /** Da quale pagina arriva: finisce nel link e poi nell'attribuzione. */
  from?: string;
  className?: string;
}) {
  const config = getDailySubscription();
  if (!config.enabled) return null;

  const sub = toPublicSubscription(config);
  const href = from ? `/preghiera-del-giorno?da=${encodeURIComponent(from)}` : "/preghiera-del-giorno";
  const hour = `${sub.deliveryHour}`;

  if (variant === "inline") {
    return (
      <p className={`text-sm leading-relaxed text-ink-soft ${className}`}>
        <span className="text-gold-deep">✦</span> Ogni mattina alle {hour} una preghiera nuova
        nella tua email, {sub.perDay} al giorno.{" "}
        <Link href={href} className="font-medium text-gold-deep underline underline-offset-2">
          La Preghiera del Giorno
        </Link>
        .
      </p>
    );
  }

  if (variant === "banner") {
    return (
      <Link
        href={href}
        className={`group flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-2xl border border-gold/30 bg-gold/[0.06] px-5 py-3 text-center text-sm transition-colors hover:border-gold/60 hover:bg-gold/10 ${className}`}
      >
        <span className="font-medium text-ink">
          La Preghiera del Giorno, ogni mattina alle {hour}
        </span>
        <span className="text-ink-soft">
          {sub.perDay} al giorno · disdici quando vuoi
        </span>
        <span className="font-medium text-gold-deep">
          Comincia <span aria-hidden="true">→</span>
        </span>
      </Link>
    );
  }

  if (variant === "hero") {
    return (
      <section
        className={`sunlit border-y border-gold/20 bg-gold/[0.04] px-6 py-24 ${className}`}
      >
        <div className="mx-auto max-w-3xl text-center">
          <Candle className="mx-auto h-14 w-14" />
          <p className="mt-7 text-sm uppercase tracking-[0.28em] text-gold-deep">
            Il modo più semplice di cominciare
          </p>
          <h2 className="mt-5 text-balance font-display text-4xl leading-tight text-ink sm:text-6xl">
            La Preghiera del Giorno,
            <span className="mt-1 block text-gold-deep">ogni mattina alle {hour}.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-balance text-lg leading-relaxed text-ink-soft">
            Una preghiera nuova ogni giorno, scritta all&apos;alba e uguale per tutti quelli
            che la ricevono. Non devi scrivere niente, non devi ricordarti niente: apri la
            posta e c&apos;è.
          </p>

          <p className="mt-9 font-display text-6xl text-gold-deep">{sub.perDay}</p>
          <p className="mt-2 text-sm text-ink-soft">
            al giorno — addebitati {sub.billing}
          </p>

          <Link
            href={href}
            className="btn-gold mt-9 inline-block rounded-xl px-9 py-4 text-lg font-medium text-white"
          >
            Comincia domani mattina
          </Link>
          <p className="mt-5 text-sm text-ink-soft/80">
            Disdici quando vuoi, con un clic dal link in fondo a ogni email.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div
      className={`card relative rounded-2xl border-gold/45 p-6 shadow-lg ${className}`}
    >
      <span className="btn-gold absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-medium text-white">
        Il più scelto
      </span>

      <h3 className="font-display text-2xl text-ink">{sub.name}</h3>
      <p className="mt-1 text-sm text-ink-soft">Ogni mattina alle {hour}, nella tua email</p>

      <p className="mt-5 font-display text-5xl text-gold-deep">{sub.perDay}</p>
      <p className="mt-1.5 text-xs text-ink-soft">al giorno · addebitati {sub.billing}</p>

      <p className="mt-5 text-sm leading-relaxed text-ink-soft">
        Una preghiera nuova ogni giorno, la stessa per tutti quelli che la ricevono. Niente da
        scrivere, niente da ricordare.
      </p>

      <Link
        href={href}
        className="btn-gold mt-6 block rounded-xl py-3 text-center font-medium text-white"
      >
        Comincia
      </Link>
      <p className="mt-3 text-center text-xs text-ink-soft/75">Disdici quando vuoi</p>
    </div>
  );
}
