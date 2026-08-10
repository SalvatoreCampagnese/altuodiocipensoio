import { NextResponse } from "next/server";
import { loadAccessiblePrayer } from "@/lib/access";
import { generatePrayer, getAudioUrl } from "@/lib/generate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * Avvia (o riprende) la generazione. La chiama la pagina della preghiera dopo
 * il pagamento: il webhook crea il record, questa route lo riempie.
 * La funzione sottostante è idempotente e protetta da lock.
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const token = new URL(req.url).searchParams.get("token");

  const prayer = await loadAccessiblePrayer(id, token);
  if (!prayer) {
    return NextResponse.json({ error: "Preghiera non trovata" }, { status: 404 });
  }
  if (prayer.status === "draft") {
    return NextResponse.json({ error: "Questa preghiera non è ancora stata pagata" }, { status: 402 });
  }

  try {
    const result = await generatePrayer(id);
    const audioUrl = result.audio_path ? await getAudioUrl(result.audio_path) : null;

    return NextResponse.json({
      id: result.id,
      status: result.status,
      title: result.title,
      body: result.body,
      audioUrl,
      duration: result.audio_duration,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generazione fallita";
    console.error("[generate]", id, message);
    return NextResponse.json({ status: "failed", error: message }, { status: 500 });
  }
}
