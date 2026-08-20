import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DailyPrayerUpsell } from "@/components/DailyPrayerUpsell";
import { PrayerView } from "@/components/PrayerView";
import { loadAccessiblePrayer } from "@/lib/access";
import { getAudioUrl } from "@/lib/generate";
import { getPrayerType, getReligion } from "@/lib/religions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "La tua preghiera",
  robots: { index: false, follow: false },
};

export default async function PrayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  const prayer = await loadAccessiblePrayer(id, token);
  if (!prayer) notFound();

  const audioUrl = prayer.audio_path ? await getAudioUrl(prayer.audio_path) : null;

  return (
    <div className="sunlit px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <PrayerView
          token={token}
          initial={{
            id: prayer.id,
            status: prayer.status,
            title: prayer.title,
            body: prayer.body,
            audioUrl,
            duration: prayer.audio_duration,
            error: prayer.error_message,
          }}
          meta={{
            religion: getReligion(prayer.religion)?.label ?? prayer.religion,
            prayerType:
              getPrayerType(prayer.religion, prayer.prayer_type)?.label ?? prayer.prayer_type,
            recipient: prayer.recipient_name,
            scheduledFor: prayer.scheduled_for,
          }}
        />

        {/* Il momento migliore per proporre l'abbonamento è questo: la
            preghiera è appena arrivata e ha funzionato. */}
        <DailyPrayerUpsell variant="banner" from="preghiera-consegnata" className="mt-12" />
      </div>
    </div>
  );
}
