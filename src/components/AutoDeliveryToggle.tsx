"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AutoDeliveryToggle({
  bundleId,
  enabled: initial,
  hasTemplate,
}: {
  bundleId: string;
  enabled: boolean;
  hasTemplate: boolean;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !enabled;
    setEnabled(next); // ottimistico: l'interruttore risponde subito
    setSaving(true);

    try {
      const res = await fetch(`/api/bundle/${bundleId}/auto-deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setEnabled(!next); // rimetti com'era
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Consegna automatica"
        onClick={toggle}
        disabled={saving}
        className={`mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-300 disabled:opacity-60 ${
          enabled ? "bg-gold" : "bg-ink-soft/25"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
            enabled ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>

      <div className="text-sm leading-relaxed text-ink-soft">
        <span className="font-medium text-ink">Consegna automatica</span>
        <p className="mt-0.5">
          {!hasTemplate
            ? "Scrivi la prima preghiera del pacchetto: da lì in poi le successive arrivano da sole, ogni giorno, via email."
            : enabled
              ? "La preghiera del giorno arriva da sola nella tua email. Non devi fare nulla."
              : "Sospesa. I crediti restano tuoi: puoi usarli a mano quando vuoi."}
        </p>
      </div>
    </div>
  );
}
