import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";
import { AdSlot } from "@/components/AdSlot";
import { ConversionTracker } from "@/components/ConversionTracker";
import { DivineLight } from "@/components/DivineLight";
import { SiteHeader } from "@/components/SiteHeader";
import { getAdsense } from "@/lib/ads";
import { HOLDER, legalDataMissing } from "@/lib/legal";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AlTuoDioCiPensoIO — Le parole per pregare, quando non ti vengono",
  description:
    "Un archivio libero di preghiere della tradizione, e un testo scritto su misura per la tua intenzione quando nessuna formula dice la tua situazione. A pregarlo sei tu.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "AlTuoDioCiPensoIO",
    description: "Le parole le mettiamo noi. La preghiera la fai tu.",
    type: "website",
    locale: "it_IT",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsense = getAdsense();

  return (
    <html lang="it" className={`${serif.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <DivineLight />

        {/* Tutto il contenuto sta sopra allo strato di luce */}
        <div className="relative z-10">
          <SiteHeader />
          <main>{children}</main>

          <footer className="mt-8 border-t border-gold/15 bg-paper-warm/60 px-6 py-10 text-sm text-ink-soft">
            <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p>
                <span className="font-display text-base text-gold-deep">AlTuoDioCiPensoIO</span>
                <span className="mx-2 opacity-40">·</span>
                Ogni fede, con lo stesso rispetto.
              </p>
              <nav className="flex flex-wrap gap-5">
                {/* Le due hub stanno nel footer di ogni pagina: è così che il
                    crawler raggiunge le 27 landing senza dipendere dalla sitemap. */}
                <Link
                  href="/preghiera-del-giorno?da=footer"
                  className="font-medium text-gold-deep transition-colors hover:text-ink"
                >
                  Preghiera del giorno
                </Link>
                <Link href="/preghiere-tradizionali" className="transition-colors hover:text-ink">
                  Archivio
                </Link>
                <Link href="/preghiere" className="transition-colors hover:text-ink">
                  Per tradizione
                </Link>
                <Link href="/preghiera-per" className="transition-colors hover:text-ink">
                  Per intenzione
                </Link>
                <Link href="/come-funziona" className="transition-colors hover:text-ink">
                  Come funziona
                </Link>
                <Link
                  href="/pregare-con-lintelligenza-artificiale"
                  className="transition-colors hover:text-ink"
                >
                  Preghiera e IA
                </Link>
                <Link href="/lucernario" className="transition-colors hover:text-ink">
                  Lucernario
                </Link>
                <Link href="/pacchetti" className="transition-colors hover:text-ink">
                  I pacchetti
                </Link>
                <Link href="/termini" className="transition-colors hover:text-ink">
                  Termini
                </Link>
                <Link href="/privacy" className="transition-colors hover:text-ink">
                  Privacy
                </Link>
                <Link href="/cookie" className="transition-colors hover:text-ink">
                  Cookie
                </Link>
              </nav>
            </div>
            <p className="mx-auto mt-6 max-w-5xl text-xs leading-relaxed opacity-70">
              I testi su misura sono composti con l&apos;assistenza dell&apos;intelligenza
              artificiale e la registrazione usa una voce sintetica: il servizio fornisce le
              parole, non prega al posto di nessuno. Non è affiliato ad alcuna istituzione
              o autorità religiosa e non sostituisce i riti officiati dai ministri di culto, né
              il sostegno psicologico o le cure mediche.
            </p>

            {/* Unità a piazzamento manuale, inattiva finché non si compilano
                gli ADSENSE_SLOT_*. Con gli annunci automatici accesi non
                disegna nulla: le posizioni le sceglie Google. */}
            <div className="mx-auto mt-8 max-w-md">
              <AdSlot placement="footer" />
            </div>

            {/* Obblighi informativi per il commercio elettronico: identità,
                sede e contatti devono essere accessibili da ogni pagina. */}
            <p className="mx-auto mt-4 max-w-5xl text-xs leading-relaxed opacity-60">
              {legalDataMissing() ? (
                <span className="text-ember">
                  Dati del titolare da completare in src/lib/legal.ts prima della pubblicazione.
                </span>
              ) : (
                <>
                  {HOLDER.name}
                  {HOLDER.form && ` — ${HOLDER.form}`} · {HOLDER.address} · P. IVA {HOLDER.vat}
                  {HOLDER.rea && ` · REA ${HOLDER.rea}`} ·{" "}
                  <a href={`mailto:${HOLDER.email}`} className="hover:text-ink">
                    {HOLDER.email}
                  </a>
                  {HOLDER.pec && ` · PEC ${HOLDER.pec}`}
                </>
              )}
            </p>
          </footer>
        </div>

        {/* Vercel Analytics resta senza cookie e senza profilazione. */}
        <Analytics />

        {/*
          AdSense. Attenzione a cosa comporta, perché non è un dettaglio
          tecnico: questo script imposta cookie di profilazione, e da quando
          c'è il sito NON può più dichiarare di non averne — le informative in
          /cookie, /privacy e /termini sono state riscritte di conseguenza.

          Il consenso per il traffico SEE/UK NON si raccoglie da qui. Google
          pretende una CMP certificata TCF e ne fornisce una gratuita: si
          accende dal cruscotto AdSense in «Privacy e messaggi → messaggio
          GDPR», che è anche il motivo per cui qui non c'è un banner fatto in
          casa — non sarebbe certificato, e Google limiterebbe gli annunci in
          Europa comunque.

          `afterInteractive`: lo script parte dopo che la pagina è
          utilizzabile. Metterlo prima significherebbe far aspettare un
          annuncio a chi è venuto a cercare una preghiera.
        */}
        {adsense.enabled && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense.client}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Legge `?nuovo=` dall'URL, quindi va in Suspense: senza, l'intero
            layout perderebbe il rendering statico. Non disegna nulla. */}
        <Suspense fallback={null}>
          <ConversionTracker />
        </Suspense>
      </body>
    </html>
  );
}
