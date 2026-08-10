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
