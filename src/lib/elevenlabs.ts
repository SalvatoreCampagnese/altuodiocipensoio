import { getReligion } from "./religions";

const API = "https://api.elevenlabs.io/v1";

/**
 * Voce di default: timbro maschile grave e posato, adatto alla recitazione
 * liturgica. Override per tradizione tramite variabili d'ambiente.
 */
export function pickVoiceId(religionId: string, language: string): string {
  const preference = getReligion(religionId)?.voice ?? "male";

  if (language === "ar" && process.env.ELEVENLABS_VOICE_ID_ARABIC) {
    return process.env.ELEVENLABS_VOICE_ID_ARABIC;
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
  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

  // Tono solenne = più stabilità e meno guizzi espressivi.
  const solemn = opts.tone === "solenne" || opts.tone === "consolatorio";

  const res = await fetch(`${API}/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: prepareForSpeech(opts.text),
      model_id: modelId,
      voice_settings: {
        stability: solemn ? 0.6 : 0.45,
        similarity_boost: 0.8,
        style: solemn ? 0.25 : 0.45,
        use_speaker_boost: true,
        speed: 0.92, // leggermente rallentata: è una preghiera, non un notiziario
      },
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
