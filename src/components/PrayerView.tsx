"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Candle } from "./Candle";

type PrayerState = {
  id: string;
  status: "draft" | "queued" | "generating" | "ready" | "failed";
  title: string | null;
  body: string | null;
  audioUrl: string | null;
  duration: number | null;
  error?: string | null;
};

const WAITING_LINES = [
  "Accendiamo la candela…",
  "Cerchiamo le parole giuste…",
  "Scriviamo la tua intenzione…",
  "La voce si prepara a recitarla…",
  "Ancora qualche istante…",
];

export function PrayerView({
  initial,
  token,
  meta,
}: {
  initial: PrayerState;
  token?: string;
  meta: { religion: string; prayerType: string; recipient?: string | null; scheduledFor?: string | null };
}) {
  const [state, setState] = useState<PrayerState>(initial);
  const [line, setLine] = useState(0);
  const inFlight = useRef(false);

  const pending = state.status === "queued" || state.status === "generating";
  const qs = token ? `?token=${encodeURIComponent(token)}` : "";

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/prayers/${initial.id}${qs}`, { cache: "no-store" });
    if (!res.ok) return;
    setState(await res.json());
  }, [initial.id, qs]);

  /**
   * Avvia la generazione, e la riavvia se il server ha rimesso la preghiera in
   * coda dopo un errore. Nessun pulsante: i tentativi sono automatici e il
   * limite lo decide il server, così non si può insistere a mano (ogni giro
   * costerebbe un'altra sintesi vocale).
   */
  const kick = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch(`/api/prayers/${initial.id}/generate${qs}`, { method: "POST" });
      const data = await res.json();
      setState((prev) => ({ ...prev, ...data }));
    } catch {
      await refresh();
    } finally {
      inFlight.current = false;
    }
  }, [initial.id, qs, refresh]);

  useEffect(() => {
    if (state.status === "queued") void kick();
  }, [state.status, kick]);

  // Rete di sicurezza: se la richiesta cade (timeout del proxy, tab in
  // background), il polling recupera comunque lo stato reale.
  useEffect(() => {
    if (!pending) return;
    const poll = setInterval(refresh, 4000);
    const rotate = setInterval(() => setLine((i) => (i + 1) % WAITING_LINES.length), 3500);
    return () => {
      clearInterval(poll);
      clearInterval(rotate);
    };
  }, [pending, refresh]);

  if (pending) {
    return (
      <div className="py-28 text-center">
        <div className="relative mx-auto h-32 w-32">
          <div className="halo-pulse absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(248,207,114,0.45),transparent_70%)]" />
          <Candle className="absolute inset-0 m-auto h-20 w-20" />
        </div>
        <p
          key={line}
          className="rise mt-10 font-display text-3xl text-ink sm:text-4xl"
        >
          {WAITING_LINES[line]}
        </p>
        <p className="mt-5 text-sm text-ink-soft">
          Di solito meno di un minuto. Puoi restare qui: appena è pronta te la
          mandiamo anche via email.
        </p>
      </div>
    );
  }

  if (state.status === "failed") {
    return (
      <div className="py-24 text-center">
        <Candle className="mx-auto h-12 w-12 opacity-40" />
        <p className="mt-8 font-display text-3xl text-ink sm:text-4xl">
          Ci vuole ancora un po&apos;
        </p>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-ink-soft">
          La tua preghiera non è riuscita a completarsi e ce ne stiamo occupando
          noi: siamo già stati avvisati. Non devi fare nulla e non devi pagare
          altro. Appena è pronta te la mandiamo via email.
        </p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink-soft/70">
          Se preferisci essere rimborsato, rispondi all&apos;email dell&apos;ordine:
          ti restituiamo tutto senza domande.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block rounded-xl border border-gold/35 px-7 py-3 transition-colors hover:border-gold/70 hover:bg-gold/5"
        >
          Torna all&apos;inizio
        </Link>
      </div>
    );
  }

  const scheduled = meta.scheduledFor
    ? new Date(meta.scheduledFor).toLocaleString("it-IT", { dateStyle: "long", timeStyle: "short" })
    : null;

  return (
    <article className="revelation relative py-10">
      {/* Bagliore che si apre una sola volta, all'apparire della preghiera */}
      <div
        className="flare pointer-events-none absolute left-1/2 top-24 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(248,207,114,0.55),transparent_70%)]"
        aria-hidden="true"
      />
      <header className="text-center">
        <Candle className="mx-auto h-14 w-14" />
        <h1 className="mt-6 text-balance font-display text-4xl leading-tight text-ink sm:text-5xl">
          {state.title}
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          {meta.prayerType}
          <span className="mx-2 opacity-40">·</span>
          {meta.religion}
          {meta.recipient && (
            <>
              <span className="mx-2 opacity-40">·</span>
              per {meta.recipient}
            </>
          )}
        </p>
        {scheduled && (
          <p className="mt-2 text-sm text-gold-deep">Recitata per il {scheduled}</p>
        )}
      </header>

      {state.audioUrl && (
        <div className="card mt-10 rounded-2xl p-6">
          <p className="mb-4 text-center text-sm uppercase tracking-[0.2em] text-gold-deep">
            Ascolta la tua preghiera
          </p>
          <audio controls preload="metadata" className="w-full" src={state.audioUrl}>
            Il tuo browser non riesce a riprodurre l&apos;audio.
          </audio>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row">
            <a
              href={state.audioUrl}
              download="preghiera.mp3"
              className="rounded-lg border border-gold/30 px-4 py-2 transition-colors hover:border-gold/60 hover:bg-gold/5"
            >
              Scarica l&apos;MP3
            </a>
            <ShareButton />
            {state.duration && (
              <span className="text-ink-soft/60">
                circa {Math.floor(state.duration / 60)}:
                {String(state.duration % 60).padStart(2, "0")}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="card mt-10 rounded-2xl px-7 py-10 sm:px-12">
        <p className="prayer-body text-ink">{state.body}</p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 text-center">
        <Link
          href="/nuova-preghiera"
          className="btn-gold rounded-xl px-8 py-3 font-medium text-white"
        >
          Accendi un&apos;altra candela
        </Link>
        <p className="text-xs text-ink-soft/60">
          Questo link è privato e resta valido: salvalo o mandalo a chi vuoi.
        </p>
      </div>
    </article>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      onClick={copy}
      className="rounded-lg border border-gold/30 px-4 py-2 transition-colors hover:border-gold/60 hover:bg-gold/5"
    >
      {copied ?"Link copiato" :"Copia il link"}
    </button>
  );
}
