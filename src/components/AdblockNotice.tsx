"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { detectAdblock } from "@/lib/adblock";
import { Candle } from "./Candle";

const KEY = "atdcp:adblock-visto";

/**
 * L'avviso a chi ha un blocco pubblicità.
 *
 * Il tono qui è una scelta di prodotto, non di copywriting. Su questo sito si
 * arriva spesso di notte, per una diagnosi o per un lutto, e ci si arriva
 * fidandosi: tutto il resto delle pagine promette di non ingannare nessuno e
 * di non promettere niente. Un avviso che facesse leva sul senso di colpa —
 * o peggio, sulla fede di chi legge — smentirebbe quelle pagine in tre righe,
 * e varrebbe molto meno di quanto costerebbe.
 *
 * Quindi: si spiega cosa pagano gli annunci, si chiede una volta, si dice a
 * chiare lettere che si può dire di no, e si lascia entrare comunque. Chi
 * chiude non se lo ritrova per un mese.
 *
 * Non è un muro anche per una ragione pratica: chi cerca «preghiera per mia
 * madre malata» alle tre di notte e trova una porta chiusa torna in SERP e
 * clicca il risultato dopo. Un blocco duro qui non converte, fa rimbalzare.
 */
export function AdblockNotice({
  dismissDays,
  delaySeconds,
  mode,
}: {
  dismissDays: number;
  delaySeconds: number;
  mode: "avviso" | "blocco";
}) {
  const blocking = mode === "blocco";

  const [open, setOpen] = useState(false);
  // In modalità muro le istruzioni sono il contenuto principale, non un
  // dettaglio da scoprire: chi è murato deve sapere subito come uscirne.
  const [howTo, setHowTo] = useState(mode === "blocco");
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback(
    (reason: string) => {
      // Il muro non si chiude: si supera togliendo il blocco pubblicità.
      if (blocking) return;
      setOpen(false);
      track("adblock_avviso_chiuso", { motivo: reason });
      try {
        const until = Date.now() + dismissDays * 24 * 60 * 60 * 1000;
        window.localStorage.setItem(KEY, String(until));
      } catch {
        // Storage negato: l'avviso ricomparirà. Meglio che non funzionare.
      }
    },
    [dismissDays, blocking]
  );

  useEffect(() => {
    let alive = true;

    // Scorciatoia per provarlo senza installare un blocco: ?adblock=test
    const forced =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("adblock") === "test";

    if (!forced) {
      try {
        const until = Number(window.localStorage.getItem(KEY));
        if (Number.isFinite(until) && until > Date.now()) return;
      } catch {
        /* storage negato: si prosegue */
      }
    }

    // Il ritardo non è estetico: lo script di Google parte dopo che la pagina
    // è interattiva, e misurare subito accuserebbe di blocco chi ha soltanto
    // una connessione lenta.
    const timer = setTimeout(
      async () => {
        if (forced) {
          if (alive) setOpen(true);
          return;
        }
        const blocked = await detectAdblock(blocking);
        if (alive && blocked) {
          setOpen(true);
          track("adblock_rilevato");
        }
      },
      forced ? 0 : delaySeconds * 1000
    );

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [delaySeconds, blocking]);

  // Uscite facili: Esc, la X, il fondo, il bottone. Chiudere non deve costare
  // fatica a nessuno — è la differenza fra chiedere e trattenere.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss("esc");
    };
    if (!blocking) document.addEventListener("keydown", onKey);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, dismiss, blocking]);

  /**
   * Nasconde il contenuto sotto al muro.
   *
   * `visibility` e non la rimozione dal DOM: il testo resta dove sta, quindi
   * la pagina che Googlebot ha già ricevuto non cambia di una riga — e il
   * crawler, che non ha blocchi pubblicitari, non arriva nemmeno qui.
   *
   * Chi apre gli strumenti per sviluppatori può scoprirlo. Vale per qualunque
   * muro lato browser mai scritto, compresi quelli dei grandi editori: la
   * difesa vera è che le persone che bloccano la pubblicità per abitudine non
   * sono le stesse che ispezionano il DOM per leggere una preghiera.
   */
  useEffect(() => {
    if (!open || !blocking) return;
    const root = document.querySelector("main");
    if (!(root instanceof HTMLElement)) return;

    const previous = root.style.visibility;
    root.style.visibility = "hidden";
    return () => {
      root.style.visibility = previous;
    };
  }, [open, blocking]);

  /** «L'ho tolto»: si rimisura, e se è vero il muro cade senza ricaricare. */
  const recheck = useCallback(async () => {
    setChecking(true);
    setFailed(false);
    // Un attimo di margine: disattivare un'estensione non ha effetto
    // immediato sulla pagina già disegnata.
    await new Promise((r) => setTimeout(r, 1200));
    const stillBlocked = await detectAdblock(true);
    if (!stillBlocked) {
      track("adblock_muro_superato");
      setOpen(false);
      // Ricarica: gli annunci non erano partiti e questa pagina è nata senza.
      window.location.reload();
      return;
    }
    setFailed(true);
    setChecking(false);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={(e) => {
        if (!blocking && e.target === e.currentTarget) dismiss("sfondo");
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="adblock-titolo"
        className="rise relative w-full max-w-lg rounded-2xl border border-gold/30 bg-paper p-7 shadow-2xl sm:p-9"
      >
        {!blocking && (
          <button
            ref={closeRef}
            type="button"
            onClick={() => dismiss("x")}
            aria-label="Chiudi"
            className="absolute right-4 top-4 rounded-lg px-2 py-1 text-xl leading-none text-ink-soft transition-colors hover:text-ink"
          >
            ×
          </button>
        )}

        <Candle className="h-12 w-12" />

        <h2
          id="adblock-titolo"
          className="mt-5 text-balance font-display text-3xl leading-tight text-ink"
        >
          {blocking
            ? "Per leggere, disattiva il blocco pubblicità."
            : "Una cosa sola, poi ti lasciamo leggere."}
        </h2>

        <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-soft">
          {blocking ? (
            <>
              <p>
                Hai un blocco pubblicità attivo, e fai bene ad averlo: gran parte di internet
                se l&apos;è meritato.
              </p>
              <p>
                Qui però gli annunci pagano una cosa precisa. L&apos;archivio delle preghiere
                della tradizione — il Padre nostro, il Salmo 23, l&apos;eterno riposo, il Mi
                Sheberach, la Fātiḥa — è{" "}
                <strong className="font-medium text-ink">gratuito</strong>, senza registrazione
                e senza limiti. Sono gli annunci a tenerlo aperto, e senza di loro non
                resterebbe aperto a lungo.
              </p>
              <p>
                Ti chiediamo di metterci fra le eccezioni: è la cosa di un momento spiegata
                qui sotto, e non ti costa nulla. Poi la pagina si apre da sola.
              </p>
            </>
          ) : (
            <>
              <p>
                Hai un blocco pubblicità attivo, e fai bene ad averlo: gran parte di internet
                se l&apos;è meritato.
              </p>
              <p>
                Qui però gli annunci pagano una cosa precisa. L&apos;archivio delle preghiere
                della tradizione — il Padre nostro, il Salmo 23, l&apos;eterno riposo, il Mi
                Sheberach, la Fātiḥa — è{" "}
                <strong className="font-medium text-ink">gratuito</strong>, senza registrazione
                e senza limiti, e resta così. Sono gli annunci a tenerlo aperto.
              </p>
              <p>
                Se puoi metterci fra le eccezioni, aiuti chi arriva qui alle tre di notte e non
                ha voglia di pagare per delle parole. Se non puoi o non vuoi,{" "}
                <strong className="font-medium text-ink">va bene lo stesso</strong>: entra e
                leggi. Non ti chiudiamo niente e non ti chiederemo altro.
              </p>
            </>
          )}
        </div>

        {howTo && (
          <div className="mt-5 rounded-xl border border-gold/20 bg-paper-warm/60 p-5 text-sm leading-relaxed text-ink-soft">
            <p className="font-medium text-ink">Come si aggiunge un&apos;eccezione</p>
            <p className="mt-2">
              Clicca l&apos;icona della tua estensione nella barra del browser — uBlock Origin,
              AdBlock, AdGuard — e scegli di disattivarla{" "}
              <em>solo per questo sito</em>. In uBlock Origin è il grande pulsante di
              accensione; nelle altre di solito è una voce «Sospendi su questo sito».
            </p>
            <p className="mt-2">
              Se il blocco è del browser (Brave) o della tua rete di casa, l&apos;impostazione
              è lì e non in un&apos;estensione. In quel caso lascia perdere davvero: non ne vale
              la fatica.
            </p>
          </div>
        )}

        {blocking && failed && (
          <p className="mt-5 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm leading-relaxed text-ink">
            Il blocco risulta ancora attivo. Se l&apos;hai appena disattivato prova a{" "}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-medium underline underline-offset-2"
            >
              ricaricare la pagina
            </button>
            . Se il blocco è del browser o della tua rete, l&apos;impostazione è lì e non in
            un&apos;estensione.
          </p>
        )}

        <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
          {blocking ? (
            <button
              type="button"
              onClick={recheck}
              disabled={checking}
              className="btn-gold w-full rounded-xl px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {checking ? "Controllo…" : "L'ho disattivato"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => dismiss("continua")}
              className="btn-gold w-full rounded-xl px-6 py-3 font-medium text-white sm:w-auto"
            >
              Continua a leggere
            </button>
          )}
          {!blocking && (
            <button
              type="button"
              onClick={() => {
                setHowTo((v) => !v);
                if (!howTo) track("adblock_istruzioni_aperte");
              }}
              className="w-full rounded-xl border border-gold/35 px-6 py-3 text-ink transition-colors hover:border-gold/70 hover:bg-gold/5 sm:w-auto"
            >
              {howTo ? "Chiudi le istruzioni" : "Come si aggiunge un'eccezione"}
            </button>
          )}
        </div>

        <p className="mt-6 border-t border-gold/15 pt-5 text-center font-display text-lg text-gold-deep">
          Che tu trovi le parole che sei venuto a cercare.
        </p>
      </div>
    </div>
  );
}
