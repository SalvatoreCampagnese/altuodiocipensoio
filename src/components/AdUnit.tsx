"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Una singola unità AdSense.
 *
 * Client component perché l'unità va "spinta" nella coda di AdSense dopo che
 * il nodo esiste nel DOM: lo script di Google riempie il primo `<ins>` vuoto
 * che trova a ogni `push()`, quindi ne serve esattamente uno per unità.
 *
 * La guardia con `useRef` non è difensiva a caso: in sviluppo React monta i
 * componenti due volte, e la seconda `push()` trova l'unità già riempita e
 * fallisce con «All ins elements in the DOM with class=adsbygoogle already
 * have ads in them». Senza guardia sarebbe un errore in console a ogni
 * caricamento.
 */
export function AdUnit({
  client,
  slot,
  testMode,
  className = "",
}: {
  client: string;
  slot: string;
  testMode: boolean;
  className?: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Blocco degli annunci, script non caricato, rete assente: l'unità
      // resta vuota e la pagina funziona lo stesso. Non è un errore da
      // rilanciare — chi usa un ad blocker non ha rotto niente.
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
      // Annunci finti fuori produzione: le impression su localhost o in
      // anteprima sono traffico non valido, e Google sospende per questo.
      {...(testMode ? { "data-adtest": "on" } : {})}
    />
  );
}
