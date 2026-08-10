import { getLanguage, getReligion } from "./religions";

const API = "https://api.elevenlabs.io/v1";

/** Modello di default: 29 lingue, 10.000 caratteri, quello già collaudato. */
const MODEL_V2 = "eleven_multilingual_v2";
/** 70+ lingue ma solo 5.000 caratteri: lo usiamo dove v2 non arriva. */
const MODEL_V3 = "eleven_v3";
const MAX_CHARS_V3 = 5000;

/**
 * Quale modello serve per questa lingua.
 *
 * `eleven_multilingual_v2` non conosce ebraico, urdu, persiano, punjabi e
 * vietnamita — cioè proprio le lingue in cui pregano ebraismo, islam iraniano
 * e pakistano, sikhismo e buddhismo vietnamita. Per quelle passiamo a v3,
 * lasciando tutto il resto sul modello che già funziona.
 */
export function pickModelId(language: string): string {
  if (getLanguage(language)?.v3) return process.env.ELEVENLABS_MODEL_ID_V3 || MODEL_V3;
  return process.env.ELEVENLABS_MODEL_ID || MODEL_V2;
}

/**
 * Voce di default: timbro maschile grave e posato, adatto alla recitazione
 * liturgica. Override per tradizione tramite variabili d'ambiente.
 */
export function pickVoiceId(religionId: string, language: string): string {
  const preference = getReligion(religionId)?.voice ?? "male";

  // Le lingue a scrittura araba rendono molto meglio con una voce madrelingua:
  // un timbro italiano che legge l'arabo si sente, e in preghiera stona.
  const arabicScript = language === "ar" || language === "ur" || language === "fa";
  if (arabicScript && process.env.ELEVENLABS_VOICE_ID_ARABIC) {
    return process.env.ELEVENLABS_VOICE_ID_ARABIC;
  }
  if (language === "he" && process.env.ELEVENLABS_VOICE_ID_HEBREW) {
    return process.env.ELEVENLABS_VOICE_ID_HEBREW;
  }
  if (preference === "female" && process.env.ELEVENLABS_VOICE_ID_FEMALE) {
    return process.env.ELEVENLABS_VOICE_ID_FEMALE;
  }
  // "Daniel" — baritono profondo, il più vicino a una voce da omelia.
  return process.env.ELEVENLABS_VOICE_ID || "onwK4e9ZLuTAKqWW03F9";
}

/**
 * Inserisce pause naturali fra i paragrafi: una preghiera letta di fila
 * suona come un annuncio, non come una preghiera.
 */
function prepareForSpeech(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

export type SynthesisResult = {
  audio: Buffer;
  voiceId: string;
  contentType: string;
};

export async function synthesizePrayer(opts: {
  text: string;
  religionId: string;
  language: string;
  tone?: string;
}): Promise<SynthesisResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY non configurata");

  const voiceId = pickVoiceId(opts.religionId, opts.language);
  const modelId = pickModelId(opts.language);
  const isV3 = modelId.startsWith("eleven_v3");

  const text = prepareForSpeech(opts.text);

  // v3 si ferma a 5.000 caratteri contro i 10.000 di v2: meglio accorgersene
  // qui che ricevere un 422 opaco a metà generazione.
  if (isV3 && text.length > MAX_CHARS_V3) {
    throw new Error(
      `Testo di ${text.length} caratteri: ${modelId} ne accetta al massimo ${MAX_CHARS_V3}`
    );
  }

  // Tono solenne = più stabilità e meno guizzi espressivi.
  const solemn = opts.tone === "solenne" || opts.tone === "consolatorio";

  // `speed` e `similarity_boost` non esistono su v3: mandarli fa fallire la
  // richiesta. Su v3 perdiamo quindi il rallentamento a 0.92 che rende la
  // recitazione meno da notiziario — si compensa col ritmo del testo.
  const voice_settings = isV3
    ? {
        stability: solemn ? 0.6 : 0.45,
        style: solemn ? 0.25 : 0.45,
        use_speaker_boost: true,
      }
    : {
        stability: solemn ? 0.6 : 0.45,
        similarity_boost: 0.8,
        style: solemn ? 0.25 : 0.45,
        use_speaker_boost: true,
        speed: 0.92, // leggermente rallentata: è una preghiera, non un notiziario
      };

  const res = await fetch(`${API}/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ha risposto ${res.status}: ${detail.slice(0, 500)}`);
  }

  const audio = Buffer.from(await res.arrayBuffer());
  if (audio.byteLength < 1024) throw new Error("ElevenLabs ha restituito un audio vuoto");

  return { audio, voiceId, contentType: "audio/mpeg" };
}

/** Stima della durata: ~150 parole al minuto a velocità 0.92. */
export function estimateDuration(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.round((words / 138) * 60);
}
