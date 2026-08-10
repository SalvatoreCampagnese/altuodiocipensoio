import { NextResponse } from "next/server";
import { loadAccessiblePrayer } from "@/lib/access";
import { getAudioUrl } from "@/lib/generate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Stato della preghiera + signed URL dell'audio. Usato per il polling. */
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const token = new URL(req.url).searchParams.get("token");

  const prayer = await loadAccessiblePrayer(id, token);
  if (!prayer) {
    return NextResponse.json({ error: "Preghiera non trovata" }, { status: 404 });
  }

  const audioUrl = prayer.audio_path ? await getAudioUrl(prayer.audio_path) : null;

  return NextResponse.json({
    id: prayer.id,
    status: prayer.status,
    title: prayer.title,
    body: prayer.body,
    audioUrl,
    duration: prayer.audio_duration,
    error: prayer.error_message,
    religion: prayer.religion,
    prayerType: prayer.prayer_type,
    recipientName: prayer.recipient_name,
    scheduledFor: prayer.scheduled_for,
    createdAt: prayer.created_at,
  });
}
