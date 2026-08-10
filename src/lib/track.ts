"use client";

import { track } from "@vercel/analytics";

/**
 * Attribuzione della conversione alla landing di partenza.
 *
 * Il problema che risolve: fra il clic sulla landing e la conversione c'è il
 * checkout di Stripe, che porta l'utente fuori dal sito e lo riporta indietro
 * su `/grazie`. Tutto lo stato in memoria muore in quel salto, e senza
 * memoria la conversione risulterebbe originata da Stripe — cioè da nessuna
 * parte. Parcheggiamo quindi la provenienza in localStorage e la ripeschiamo
 * al ritorno.
 *
 * localStorage e non sessionStorage: Stripe può riportare l'utente in una
 * scheda diversa (link nell'email, browser che ripristina la sessione), e
 * sessionStorage non sopravvive al cambio di scheda.
 */

const KEY = "atdcp:landing";
/** Oltre questo, la provenienza è di un acquisto vecchio e non c'entra più. */
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

type Stored = { landing: string; at: number };

export function rememberLanding(landing: string): void {
  if (typeof window === "undefined" || !landing) return;
  try {
    const payload: Stored = { landing, at: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    // Storage pieno o disabilitato: l'attribuzione si perde, l'acquisto no.
  }
}

export function recallLanding(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.landing || typeof parsed.at !== "number") return null;
    if (Date.now() - parsed.at > MAX_AGE_MS) {
      window.localStorage.removeItem(KEY);
      return null;
    }
    return parsed.landing;
  } catch {
    return null;
  }
}

export function forgetLanding(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* vedi sopra */
  }
}

/** Checkout avviato: l'ultimo evento che vediamo prima di perdere l'utente. */
export function trackCheckoutStarted(extra: { productId: string; religion: string }): void {
  track("checkout_avviato", {
    landing: recallLanding() ?? "diretto",
    prodotto: extra.productId,
    fede: extra.religion,
  });
}

/**
 * Conversione completata. Da chiamare una volta sola su `/grazie`: è questo
 * l'evento che dice quale landing porta soldi, non solo clic.
 */
export function trackConversion(productId: string): void {
  track("conversione", {
    landing: recallLanding() ?? "diretto",
    prodotto: productId,
  });
  forgetLanding();
}
