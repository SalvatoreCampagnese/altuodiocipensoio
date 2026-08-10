import Link from "next/link";
import { Candle } from "@/components/Candle";

export default function NotFound() {
  return (
    <div className="px-6 py-32 text-center">
      <Candle className="mx-auto h-14 w-14" />
      <h1 className="mt-8 font-display text-4xl text-ink">Qui non c&apos;è nulla</h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink-soft">
        La pagina non esiste, oppure il link a questa preghiera non è più valido o
        non è tuo.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block rounded-xl btn-gold px-6 py-3 font-medium text-white"
      >
        Torna all&apos;inizio
      </Link>
    </div>
  );
}
