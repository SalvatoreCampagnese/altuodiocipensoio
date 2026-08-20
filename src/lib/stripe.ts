import Stripe from "stripe";
import { intervalLabel, type Product, type Subscription } from "./pricing";

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

/**
 * Riga di checkout per l'abbonamento alla Preghiera del Giorno.
 *
 * Come sopra: se c'è un Price ID configurato vince quello, altrimenti il
 * prezzo ricorrente si costruisce al volo dalle env. La differenza è che qui
 * serve `recurring`, ed è quello a rendere la sessione un abbonamento invece
 * di un pagamento singolo.
 *
 * Nel nome del prodotto va il prezzo GIORNALIERO, perché è quello annunciato
 * sul sito: trovare "4,90 €" sulla ricevuta senza spiegazione, dopo aver
 * letto "0,70 € al giorno", è il modo più veloce per prendersi un chargeback.
 */
export function subscriptionLineItem(
  sub: Subscription
): Stripe.Checkout.SessionCreateParams.LineItem {
  if (sub.stripePriceId?.startsWith("price_")) {
    return { price: sub.stripePriceId, quantity: 1 };
  }

  return {
    quantity: 1,
    price_data: {
      currency: "eur",
      unit_amount: sub.amountCents,
      recurring: { interval: sub.interval },
      product_data: {
        name: `AlTuoDioCiPensoIO — ${sub.name}`,
        description:
          `Una preghiera nuova ogni mattina via email. ` +
          `${(sub.perDayCents / 100).toFixed(2).replace(".", ",")} € al giorno, ` +
          `addebitati ${(sub.amountCents / 100).toFixed(2).replace(".", ",")} € ` +
          `${intervalLabel(sub.interval)}. Disdici quando vuoi.`,
      },
    },
  };
}
