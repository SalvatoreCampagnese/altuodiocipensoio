import Stripe from "stripe";
import type { Product } from "./pricing";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY non configurata");

  // Versione API fissata a quella dei tipi installati: aggiornala insieme al pacchetto.
  cached = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  return cached;
}

/**
 * Usa il Price ID configurato se presente, altrimenti costruisce il prezzo al
 * volo dal catalogo: così cambiare listino richiede solo una variabile d'ambiente,
 * senza creare prodotti su Stripe.
 */
export function lineItemFor(product: Product): Stripe.Checkout.SessionCreateParams.LineItem {
  if (product.stripePriceId?.startsWith("price_")) {
    return { price: product.stripePriceId, quantity: 1 };
  }

  return {
    quantity: 1,
    price_data: {
      currency: "eur",
      unit_amount: product.amountCents,
      product_data: {
        name: `AlTuoDioCiPensoIO — ${product.name}`,
        description:
          product.credits > 1
            ? `${product.description} (${product.credits} preghiere)`
            : product.description,
      },
    },
  };
}
