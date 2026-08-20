import { getAdsense } from "@/lib/ads";

export const runtime = "nodejs";
// Come le pagine con i prezzi: il contenuto viene dalle variabili d'ambiente,
// così cambiare editore non richiede un rebuild.
export const dynamic = "force-dynamic";

/**
 * ads.txt — Authorized Digital Sellers (IAB Tech Lab).
 *
 * Dichiara chi è autorizzato a vendere lo spazio pubblicitario di questo
 * dominio. Senza, gli acquirenti non possono distinguere il nostro inventario
 * da quello di chi si spaccia per noi, e AdSense segnala il sito come «non
 * autorizzato» limitando i ricavi.
 *
 * Generato invece che messo in `public/` per lo stesso motivo per cui lo sono
 * `robots.txt` e `sitemap.xml`: l'identificativo dell'editore vive già in
 * `ADSENSE_CLIENT`, e un file statico sarebbe una seconda copia destinata a
 * divergere. Se qualcuno cambiasse la variabile senza ricordarsi del file,
 * l'ads.txt continuerebbe ad autorizzare l'editore sbagliato — e il guasto
 * sarebbe silenzioso: nessun errore, solo annunci che smettono di rendere.
 */
export async function GET() {
  const { enabled, client } = getAdsense();

  /**
   * Con la pubblicità spenta si risponde 404, MAI un file vuoto.
   *
   * La differenza non è cosmetica ed è il punto più facile da sbagliare di
   * tutto il file: per la specifica, un ads.txt assente significa «nessuna
   * restrizione» e gli annunci continuano a essere serviti, mentre un
   * ads.txt presente ma vuoto significa «nessuno è autorizzato a vendere
   * questo inventario» e blocca la pubblicità sull'intero dominio.
   */
  if (!enabled) {
    return new Response("Not Found", { status: 404 });
  }

  // Il record vuole `pub-…`, mentre lo script e i tag `<ins>` vogliono
  // `ca-pub-…`. È lo stesso identificativo con due grafie, ed è il motivo
  // per cui qui si toglie il prefisso invece di scrivere il numero a mano.
  const publisherId = client.replace(/^ca-/, "");

  // Campi, nell'ordine imposto dalla specifica:
  //   dominio del sistema pubblicitario, ID editore, tipo di rapporto,
  //   ID dell'autorità di certificazione (per Google è questo, ed è fisso).
  const body = [
    "# ads.txt — Authorized Digital Sellers",
    "# Aggiornalo dalla variabile ADSENSE_CLIENT, non a mano.",
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Google ripassa circa una volta al giorno: un'ora di cache alleggerisce
      // senza ritardare in modo apprezzabile un cambio di editore.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
