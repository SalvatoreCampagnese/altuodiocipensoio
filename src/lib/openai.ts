import OpenAI from "openai";
import { getPrayerType, getReligion, getTraditionLabel, LANGUAGES } from "./religions";
import type { Prayer } from "./types";

let cached: OpenAI | null = null;

function getClient(): OpenAI {
  if (cached) return cached;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY non configurata");
  cached = new OpenAI({ apiKey });
  return cached;
}

const SYSTEM_PROMPT = `Sei l'autore di preghiere di "AlTuoDioCiPensoIO", un servizio che prega al posto di chi in questo momento non può farlo.

Chi ti legge sta affidando qualcosa di importante. Regole non negoziabili:

1. RISPETTO. Ogni tradizione va trattata con serietà assoluta. Mai ironia, parodia, condiscendenza o esotismo. Chi ordina crede davvero.
2. AUTENTICITÀ. Usa il lessico, le formule di apertura e chiusura e il registro propri della tradizione indicata. Deve suonare come qualcosa che quella comunità riconoscerebbe.
3. NIENTE SCRITTURE INVENTATE. Non citare mai versetti con riferimento numerico (sura/versetto, capitolo/versetto) e non attribuire frasi a testi sacri. Puoi usare formule liturgiche universalmente note e non numerate. Nel dubbio, allude senza citare.
4. LA PERSONA AL CENTRO. L'intenzione dell'utente va incorporata con concretezza — nomi, situazioni, dettagli — non parafrasata in genericità. Chi ascolta deve sentire che si parla proprio di lui.
5. NESSUNA PROMESSA. Non garantire guarigioni, esiti, miracoli o risposte. Si chiede, si affida, si spera. Non si promette.
6. PENSATA PER LA VOCE. Sarà letta ad alta voce da una voce sola: frasi respirabili, ritmo con cadenza, niente elenchi puntati, niente titoli interni, niente markdown, nessuna didascalia scenica.
7. SOBRIETÀ. Nessun riferimento al pagamento, al servizio, all'IA o al fatto che qualcuno stia pregando "al posto di". La preghiera è pura.

Se l'intenzione dell'utente contiene richieste di maledire, danneggiare o augurare male a qualcuno, riorienta con delicatezza il testo verso la pace, la giustizia e la liberazione di chi soffre, senza mai rimproverare l'utente.

Rispondi ESCLUSIVAMENTE con un oggetto JSON valido:
{"title": "...", "body": "..."}

- "title": massimo 60 caratteri, sobrio, senza virgolette.
- "body": la preghiera. Da 150 a 260 parole. Paragrafi separati da doppio a capo. Nessun markdown.`;

export type GeneratedPrayer = { title: string; body: string };

export async function writePrayer(prayer: Prayer): Promise<GeneratedPrayer> {
  const religion = getReligion(prayer.religion);
  const type = getPrayerType(prayer.religion, prayer.prayer_type);
  const tradition = getTraditionLabel(prayer.religion, prayer.tradition);
  const language = LANGUAGES.find((l) => l.id === prayer.language)?.label ?? "Italiano";

  const when = prayer.scheduled_for
    ? new Date(prayer.scheduled_for).toLocaleString("it-IT", {
        dateStyle: "full",
        timeStyle: "short",
      })
    : null;

  const userPrompt = [
    `Tradizione: ${religion?.label ?? prayer.religion}`,
    tradition ? `Ramo/rito: ${tradition}` : null,
    `Indicazioni sulla tradizione: ${religion?.guidance ?? "—"}`,
    ``,
    `Tipo di preghiera: ${type?.label ?? prayer.prayer_type}${type?.hint ? ` (${type.hint})` : ""}`,
    `Tono richiesto: ${prayer.tone}`,
    `Lingua del testo: ${language}. Scrivi TUTTO, titolo compreso, in questa lingua.`,
    prayer.recipient_name ? `La preghiera è per: ${prayer.recipient_name}. Nominalo/a esplicitamente almeno due volte.` : null,
    when ? `Sarà recitata il: ${when}. Puoi accennare al momento, con discrezione.` : null,
    prayer.sequence_index && prayer.sequence_total && prayer.sequence_total > 1
      ? `Questa è la preghiera ${prayer.sequence_index} di ${prayer.sequence_total} di una devozione continuata. ` +
        `Riprendi la stessa intenzione ma con parole nuove: non ripetere il testo dei giorni precedenti. ` +
        (prayer.sequence_index === 1
          ? "È la prima: apri il cammino."
          : prayer.sequence_index === prayer.sequence_total
            ? "È l'ultima: chiudi il cammino e affida l'esito."
            : "È una delle intermedie: tieni viva la perseveranza.")
      : null,
    ``,
    `Intenzione scritta dall'utente (rispettala alla lettera, è il cuore del testo):`,
    `"""`,
    prayer.intention.trim(),
    `"""`,
  ]
    .filter(Boolean)
    .join("\n");

  const client = getClient();

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    temperature: 0.85,
    max_tokens: 1200,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("OpenAI non ha restituito alcun testo");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Risposta di OpenAI non in formato JSON");
  }

  const { title, body } = parsed as Partial<GeneratedPrayer>;
  if (!body || typeof body !== "string" || body.trim().length < 40) {
    throw new Error("La preghiera generata è vuota o troppo breve");
  }

  return {
    title: (typeof title === "string" && title.trim()) || "La tua preghiera",
    body: body.trim(),
  };
}

/* ---------------------------------------------------------------------------
 * La Preghiera del Giorno
 * ------------------------------------------------------------------------- */

/**
 * Il prompt della preghiera del giorno è un altro mestiere rispetto al su
 * misura, e per questo è un altro prompt.
 *
 * Là c'è una persona che ha scritto la sua intenzione, e il testo deve parlare
 * di lei. Qui i lettori sono migliaia e non li conosciamo: il testo deve poter
 * essere detto in prima persona da chiunque, senza sapere niente di chi lo
 * dice. È la differenza fra una lettera e un salmo — e il rischio, se non lo
 * si dice al modello, è che venga fuori un oroscopo devoto.
 */
const DAILY_SYSTEM_PROMPT = `Sei l'autore della "Preghiera del Giorno" di AlTuoDioCiPensoIO: un testo nuovo ogni mattina, lo stesso per tutte le persone abbonate, che lo ricevono via email alle nove.

Chi la legge non ti ha scritto nulla di sé. Non sai chi è, cosa gli è successo, cosa sta attraversando. Scrivi quindi una preghiera che una persona qualunque possa dire in prima persona, oggi, qualunque sia la sua giornata.

Regole non negoziabili:

1. UNIVERSALE MA NON GENERICA. Non sapere nulla del lettore non è un permesso per essere vaghi. Parti da una cosa concreta e comune — la luce che entra, il lavoro che aspetta, una stanchezza, una notizia, un nome che torna in mente — e da lì sali. Il vago è il difetto peggiore di questo formato.
2. UNA COSA SOLA. Un tema per giorno, portato fino in fondo. Non un elenco di intenzioni.
3. NIENTE OROSCOPO. Non predire, non promettere, non dire al lettore come andrà la giornata né come si sente. Si chiede e si affida: non si annuncia.
4. RISPETTO E AUTENTICITÀ. Usa il lessico e il registro della tradizione indicata, con serietà assoluta. Mai ironia né condiscendenza.
5. NIENTE SCRITTURE INVENTATE. Non citare mai versetti con riferimento numerico e non attribuire frasi a testi sacri. Formule liturgiche note e non numerate: sì. Nel dubbio, allude senza citare.
6. PENSATA PER LA VOCE. Sarà letta ad alta voce da una voce sola: frasi respirabili, ritmo con cadenza. Niente elenchi puntati, niente titoli interni, niente markdown, nessuna didascalia.
7. SOBRIETÀ. Nessun riferimento al servizio, all'abbonamento, all'IA, all'email o al fatto che sia "la preghiera di oggi". La preghiera è pura: la cornice la mette il sito.
8. NON DATARE IL TESTO. Puoi evocare il momento (il mattino, il giorno che comincia, il giorno della settimana), ma non scrivere mai la data.

Rispondi ESCLUSIVAMENTE con un oggetto JSON valido:
{"title": "...", "body": "..."}

- "title": massimo 60 caratteri, sobrio, senza virgolette. Deve dire il tema del giorno, non essere un titolo generico.
- "body": la preghiera. Da 120 a 200 parole — è più breve del su misura, perché si legge ogni mattina e non una volta sola. Paragrafi separati da doppio a capo. Nessun markdown.`;

export type DailyPrayerInput = {
  /** `YYYY-MM-DD` in ora di Roma. */
  date: string;
  religion: string;
  language: string;
  tone: string;
  theme: string;
  themeLabel: string;
  /** Titoli dei giorni precedenti: servono a non riscrivere la stessa cosa. */
  recentTitles: string[];
};

export async function writeDailyPrayer(input: DailyPrayerInput): Promise<GeneratedPrayer> {
  const religion = getReligion(input.religion);
  const language = LANGUAGES.find((l) => l.id === input.language)?.label ?? "Italiano";

  // `T12:00` e non la data nuda: `new Date("2026-08-20")` è mezzanotte UTC,
  // che a Roma d'estate è ancora il 20 ma in altri fusi sarebbe il 19.
  const day = new Date(`${input.date}T12:00:00`);
  const weekday = day.toLocaleDateString("it-IT", { weekday: "long" });

  const userPrompt = [
    `Tradizione: ${religion?.label ?? input.religion}`,
    `Indicazioni sulla tradizione: ${religion?.guidance ?? "—"}`,
    `Tono: ${input.tone}`,
    `Lingua del testo: ${language}. Scrivi TUTTO, titolo compreso, in questa lingua.`,
    ``,
    `Oggi è ${weekday}.`,
    weekday === "domenica"
      ? `È domenica: il giorno ha un peso diverso, puoi lasciarlo sentire senza nominarlo come tema.`
      : null,
    ``,
    `Il tema di oggi è: ${input.themeLabel}.`,
    `Sviluppa questo tema e nessun altro.`,
    input.recentTitles.length
      ? [
          ``,
          `Nei giorni scorsi hai già scritto queste, e i lettori le hanno lette:`,
          ...input.recentTitles.map((t) => `— ${t}`),
          `Non ripetere le stesse immagini, le stesse aperture o le stesse chiuse.`,
        ].join("\n")
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const completion = await getClient().chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    // Più alta del su misura: qui il nemico è la ripetizione, non la deriva.
    // Il testo esce ogni giorno e chi lo riceve confronta con ieri.
    temperature: 0.95,
    max_tokens: 900,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: DAILY_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("OpenAI non ha restituito alcun testo");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Risposta di OpenAI non in formato JSON");
  }

  const { title, body } = parsed as Partial<GeneratedPrayer>;
  if (!body || typeof body !== "string" || body.trim().length < 40) {
    throw new Error("La preghiera del giorno generata è vuota o troppo breve");
  }

  return {
    title: (typeof title === "string" && title.trim()) || `Preghiera del ${weekday}`,
    body: body.trim(),
  };
}
