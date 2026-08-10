import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";
import { Candle } from "@/components/Candle";

export const metadata: Metadata = {
  title: "Accedi — AlTuoDioCiPensoIO",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="sunlit px-6 py-24">
      <div className="mx-auto max-w-sm text-center">
        <Candle className="mx-auto h-14 w-14" />
        <h1 className="mt-8 font-display text-4xl text-ink">Le tue preghiere</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Nessuna password. Ti mandiamo un link: cliccalo e sei dentro.
        </p>

        <div className="mt-10 text-left">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
