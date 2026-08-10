import Link from "next/link";
import type { PublicProduct } from "@/lib/pricing";

const CADENCE_LABEL: Record<PublicProduct["cadence"], string> = {
  instant: "subito",
  daily: "una al giorno",
  monthly: "una al mese",
};

/** Griglia del listino. Presentazionale: l'acquisto avviene su /pacchetti. */
export function ProductGrid({ products }: { products: PublicProduct[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <article
          key={p.id}
          className={`card card-hover relative flex flex-col rounded-2xl p-6 ${
            p.featured ? "border-gold/45 shadow-lg" : ""
          }`}
        >
          {p.featured && (
            <span className="btn-gold absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-medium text-white">
              Il più scelto
            </span>
          )}

          <h3 className="font-display text-2xl text-ink">{p.name}</h3>
          <p className="mt-1 text-sm text-ink-soft">{p.tagline}</p>

          <p className="mt-5 font-display text-5xl text-gold-deep">{p.price}</p>
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
            className={`mt-6 block rounded-xl py-3 text-center font-medium transition-all duration-300 ${
              p.featured
                ? "btn-gold text-white"
                : "border border-gold/35 text-ink hover:border-gold/70 hover:bg-gold/5"
            }`}
          >
            {p.credits === 1 ? "Comincia" : "Prendilo"}
          </Link>
        </article>
      ))}
    </div>
  );
}
