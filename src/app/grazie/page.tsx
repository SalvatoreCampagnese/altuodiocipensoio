import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { fulfillBySessionId } from "@/lib/fulfillment";
import { Candle } from "@/components/Candle";

export const dynamic = "force-dynamic";

// Pagina di passaggio dopo il pagamento: non ha senso in SERP e porterebbe
// visitatori su un vicolo cieco senza session_id.
export const metadata: Metadata = {
  title: "Grazie — AlTuoDioCiPensoIO",
  robots: { index: false, follow: false },
};

/**
 * Ponte fra Stripe e la preghiera. Non si limita ad aspettare il webhook:
 * verifica il pagamento direttamente su Stripe e, se serve, completa
 * l'ordine da sé. Così funziona anche in locale senza `stripe listen`.
 */
export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) redirect("/");

  let message: string;

  try {
    const result = await fulfillBySessionId(sessionId);

    if (!result) {
      message = "Il pagamento risulta ancora in elaborazione. Appena viene confermato ti mandiamo la preghiera via email.";
    } else if (result.order.product_id === "lucernario") {
      // `nuovo` è il segnale che ConversionTracker aspetta: da qui in poi
      // reindirizziamo, e senza questo parametro la conversione andrebbe persa.
      redirect(result.candleSlot ? "/lucernario?accesa=1&nuovo=lucernario" : "/lucernario?nuovo=lucernario");
    } else if (result.prayerId) {
      const db = createAdminClient();
      const { data } = await db
        .from("prayers")
        .select("access_token")
        .eq("id", result.prayerId)
        .single<{ access_token: string }>();

      redirect(
        `/preghiera/${result.prayerId}?token=${data?.access_token ?? ""}&nuovo=${result.order.product_id}`
      );
    } else {
      redirect(`/dashboard?bundle=1&nuovo=${result.order.product_id}`);
    }
  } catch (err) {
    // `redirect()` lancia per progetto: rilancia senza trattarlo come errore.
    if (err && typeof err === "object" && "digest" in err) throw err;
    message = "Il pagamento è andato a buon fine, ma non riusciamo a mostrarti subito la preghiera. Controlla la tua email fra poco.";
  }

  return (
    <div className="sunlit px-6 py-28 text-center">
      <Candle className="mx-auto h-16 w-16" />
      <h1 className="mt-8 font-display text-4xl text-ink">Grazie</h1>
      <p className="mx-auto mt-4 max-w-md text-balance leading-relaxed text-ink-soft">
        {message}
      </p>
      <Link
        href="/dashboard"
        className="mt-10 inline-block rounded-xl border border-gold/30 px-8 py-3 transition-colors hover:border-gold/60 hover:bg-gold/5"
      >
        Vai alle mie preghiere
      </Link>
    </div>
  );
}
