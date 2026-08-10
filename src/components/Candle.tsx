/**
 * La candela del marchio, ridisegnata per fondo chiaro: cera color crema con
 * contorno caldo, fiamma dorata dentro un alone che pulsa.
 */
export function Candle({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="candle-flame" cx="50%" cy="62%" r="58%">
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="45%" stopColor="#f5c964" />
          <stop offset="100%" stopColor="#d98b2b" />
        </radialGradient>
        <radialGradient id="candle-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f8cf72" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#f8cf72" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f8cf72" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="candle-wax" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="45%" stopColor="#f6eddb" />
          <stop offset="100%" stopColor="#e6d7bd" />
        </linearGradient>
      </defs>

      <circle cx="12" cy="7" r="11" fill="url(#candle-halo)" className="halo-pulse" />

      <path
        d="M12 1c2.6 3.1 4.2 5.3 4.2 7.6a4.2 4.2 0 1 1-8.4 0C7.8 6.3 9.4 4.1 12 1z"
        fill="url(#candle-flame)"
      />
      <path
        d="M12 4.6c1.3 1.7 2.1 2.9 2.1 4.1a2.1 2.1 0 1 1-4.2 0c0-1.2.8-2.4 2.1-4.1z"
        fill="#fffdf5"
        opacity="0.6"
      />

      <rect x="7.5" y="13" width="9" height="17" rx="1.6" fill="url(#candle-wax)" />
      <rect
        x="7.5"
        y="13"
        width="9"
        height="17"
        rx="1.6"
        fill="none"
        stroke="#dcc79f"
        strokeWidth="0.7"
      />
      <path d="M12 11.5v1.7" stroke="#8a6119" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
