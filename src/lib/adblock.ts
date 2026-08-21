/**
 * Rilevamento dei blocchi pubblicitari.
 *
 * Nessun singolo segnale li prende tutti, e chi promette il contrario non ha
 * capito il problema: i blocchi lavorano a livelli diversi, e ogni livello si
 * vede solo con la prova giusta.
 *
 *   - I filtri COSMETICI (uBlock Origin, AdBlock Plus) nascondono elementi
 *     che assomigliano a pubblicità: si vedono con un'esca nel DOM.
 *   - I filtri DI RETE bloccano le richieste verso i domini pubblicitari:
 *     si vedono con una richiesta che deve fallire.
 *   - I blocchi DI SISTEMA (Pi-hole, NextDNS, gli scudi di Brave) intervengono
 *     prima del browser: non toccano il DOM, quindi l'esca non li vede, ma
 *     fanno fallire la rete.
 *
 * Restano fuori i casi che nessuna tecnica lato pagina può vedere — un proxy
 * aziendale che restituisce uno script vuoto, un'estensione che simula il
 * caricamento. È un limite reale e va detto invece che nascosto.
 *
 * Il rischio speculare è il FALSO POSITIVO: una rete lenta, una connessione
 * caduta, un firewall d'ufficio. Per questo la rete si prova solo se il
 * browser si dichiara online, si aspetta prima di misurare, e la conclusione
 * è un avviso che si chiude — mai un muro.
 */

/** Classi che praticamente ogni lista di filtri nasconde. */
const BAIT_CLASSES = [
  "adsbox",
  "ad-banner",
  "ad-placement",
  "adsbygoogle",
  "banner-ads",
  "pub_300x250",
  "text-ad",
  "sponsored-ad",
].join(" ");

/**
 * Aspetta che il browser abbia davvero disegnato, non solo eseguito.
 *
 * Il `setTimeout` non è una cintura di sicurezza teorica: in una scheda in
 * SECONDO PIANO `requestAnimationFrame` non scatta affatto, perché non c'è
 * niente da disegnare. Ed è un caso frequentissimo, non un caso limite — chi
 * apre tre risultati di ricerca con il tasto centrale sta esattamente lì.
 * Senza questa uscita la rilevazione resterebbe appesa per sempre e l'avviso
 * non comparirebbe mai a quelle persone.
 */
function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    requestAnimationFrame(() => requestAnimationFrame(finish));
    setTimeout(finish, 250);
  });
}

/** Non lasciare mai una promessa appesa: oltre il tempo, la risposta è no. */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

/**
 * Segnale 1 — l'esca nel DOM.
 *
 * Un elemento che sembra un annuncio. Se il filtro cosmetico lo nasconde,
 * altezza o visibilità cadono. Sta fuori dallo schermo perché nessun utente
 * lo veda mai, e viene rimosso subito dopo la misura.
 */
async function baitIsHidden(): Promise<boolean> {
  const bait = document.createElement("div");
  bait.className = BAIT_CLASSES;
  bait.setAttribute("aria-hidden", "true");
  bait.style.cssText =
    "position:absolute;left:-9999px;top:-9999px;width:2px;height:2px;pointer-events:none;";
  document.body.appendChild(bait);

  await nextPaint();

  const style = window.getComputedStyle(bait);
  const hidden =
    bait.offsetHeight === 0 ||
    bait.offsetParent === null ||
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0";

  bait.remove();
  return hidden;
}

/**
 * Segnale 2 — la richiesta di rete.
 *
 * `no-cors` perché non ci serve leggere la risposta: ci serve sapere se parte.
 * Verso un dominio bloccato la fetch solleva un TypeError; verso uno
 * raggiungibile restituisce una risposta opaca che non guardiamo.
 */
async function networkIsBlocked(): Promise<boolean> {
  // Offline non è un blocco pubblicitario: è un treno in galleria.
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    return false;
  } catch {
    // Un abort per timeout è una rete lenta, non un blocco: non accusare.
    return !controller.signal.aborted;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Segnale 3 — lo script di Google è arrivato in pagina?
 *
 * Il tag <script> resta nel DOM anche quando il contenuto è stato bloccato,
 * quindi non basta cercarlo: si guarda se ha davvero caricato qualcosa.
 * `adsbygoogle` diventa un array vero solo quando lo script gira; se resta
 * `undefined` mentre il tag c'è, qualcosa l'ha fermato per strada.
 */
function scriptDidNotLoad(): boolean {
  const tag = document.querySelector('script[src*="adsbygoogle.js"]');
  if (!tag) return false; // la pubblicità è spenta: non è colpa dell'utente
  return typeof (window as { adsbygoogle?: unknown }).adsbygoogle === "undefined";
}

/**
 * Il verdetto.
 *
 * L'esca da sola basta — un filtro cosmetico attivo è già una risposta. Rete
 * e script devono invece concordare fra loro, perché ciascuno preso da solo
 * sbaglia troppo spesso: un firewall aziendale fa fallire la rete senza che
 * l'utente abbia installato niente, e uno script può mancare per mille motivi.
 */
export async function detectAdblock(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const [bait, network] = await Promise.all([
      withTimeout(baitIsHidden(), 2000, false),
      withTimeout(networkIsBlocked(), 6000, false),
    ]);
    return bait || (network && scriptDidNotLoad());
  } catch {
    // Nel dubbio, non accusare nessuno.
    return false;
  }
}
