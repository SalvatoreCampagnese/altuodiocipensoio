import Link from "next/link";
import { DailyPrayerUpsell } from "./DailyPrayerUpsell";
import type { PublicProduct } from "@/lib/pricing";

const CADENCE_LABEL: Record<PublicProduct["cadence"], string> = {
  instant: "subito",
  daily: "una al giorno",
  monthly: "una al mese",
  // I prodotti a crediti non hanno questa cadenza: è dell'abbonamento, che
  // nella griglia entra dal suo componente e non da questa lista.
  subscription: "ogni giorno",
};

/**
 * Griglia del listino. Presentazionale: l'acquisto avviene su /pacchetti.
 *
 * L'abbonamento sta in prima posizione e non fra i prodotti: non arriva da
 * `listProducts()` perché non è un prodotto a crediti — non ha un numero di
 * preghiere né un prezzo unitario da confrontare — e infilarlo in quella
 * lista avrebbe voluto dire un campo opzionale in più su ogni riga del
 * catalogo per un solo caso.
 */
export function ProductGrid({
  products,
  withSubscription = true,
}: {
  products: PublicProduct[];
  withSubscription?: boolean;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {withSubscription && <DailyPrayerUpsell variant="card" from="listino" />}

      {products.map((p) => (
        <article
          key={p.id}
          className="card card-hover relative flex flex-col rounded-2xl p-6"
        >
          <h3 className="font-display text-2xl text-ink">{p.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">{p.tagline}</p>

          <p className="mt-5 font-display text-5xl text-ink-soft">{p.price}</p>
          <p className="mt-1.5 text-xs text-ink-soft">
            {p.credits === 1
              ? "una preghiera"
              : `${p.credits} preghiere · ${CADENCE_LABEL[p.cadence]} · ${p.perPrayer} l'una`}
          </p>

          <p className="mt-5 flex-1 text-sm leading-relaxed text-ink-soft">{p.description}</p>

          {p.savings && (
            <p className="mt-4 text-sm font-medium text-gold-deep">Risparmi {p.savings}</p>
          )}

          <Link
            href={p.credits === 1 ? "/nuova-preghiera" : `/pacchetti#${p.id}`}
            className="mt-6 block rounded-xl border border-gold/35 py-3 text-center font-medium text-ink transition-all duration-300 hover:border-gold/70 hover:bg-gold/5"
          >
            {p.credits === 1 ? "Comincia" : "Prendilo"}
          </Link>
        </article>
      ))}
    </div>
  );
}
