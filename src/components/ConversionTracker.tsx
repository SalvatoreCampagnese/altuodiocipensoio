"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackConversion } from "@/lib/track";

/**
 * Segna la conversione al ritorno da Stripe.
 *
 * Sta nel layout e non su `/grazie` perché `/grazie` quasi sempre reindirizza:
 * alla preghiera appena creata, al lucernario o alla dashboard. Un tracker
 * montato lì vedrebbe solo i pagamenti rimasti in sospeso, cioè i casi rari.
 *
 * Il segnale è quindi il parametro `?nuovo=<prodotto>`, che `/grazie` attacca
 * a ogni destinazione. Vale una volta sola: appena letto lo togliamo dall'URL,
 * così un refresh o un link condiviso non contano una seconda conversione.
 *
 * L'evento è lato client perché è qui che vive la memoria della landing di
 * partenza (localStorage). Il webhook sa che l'ordine è pagato, ma non da
 * quale pagina era partito.
 */
export function ConversionTracker() {
  const params = useSearchParams();
  const nuovo = params.get("nuovo");
  const done = useRef(false);

  useEffect(() => {
    if (!nuovo || done.current) return;
    // In sviluppo React monta due volte: senza guardia si conterebbe doppio.
    done.current = true;

    trackConversion(nuovo);

    // Pulisci l'URL senza ricaricare né aggiungere una voce alla cronologia.
    const url = new URL(window.location.href);
    url.searchParams.delete("nuovo");
    window.history.replaceState(null, "", url.toString());
  }, [nuovo]);

  return null;
}
