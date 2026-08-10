/**
 * Una candela del lucernario. Accesa: vetro ambrato, fiamma, alone che pulsa.
 * Spenta: vetro chiaro e stoppino nero, in attesa.
 */
export function VotiveCandle({
  lit,
  selected = false,
  className = "h-16 w-12",
}: {
  lit: boolean;
  selected?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 32 44" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="votive-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f9d178" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#f6c25c" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f6c25c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="votive-glass-lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe6b0" />
          <stop offset="100%" stopColor="#e9a642" />
        </linearGradient>
        <linearGradient id="votive-glass-off" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbf8f2" />
          <stop offset="100%" stopColor="#ece5d7" />
        </linearGradient>
        <radialGradient id="votive-flame" cx="50%" cy="65%" r="55%">
          <stop offset="0%" stopColor="#fffdf3" />
          <stop offset="50%" stopColor="#f8cf72" />
          <stop offset="100%" stopColor="#dd8f2c" />
        </radialGradient>
      </defs>

      {lit && <circle cx="16" cy="12" r="15" fill="url(#votive-glow)" className="halo-pulse" />}

      {/* Fiamma */}
      {lit ? (
        <path
          d="M16 4c1.9 2.3 3 3.9 3 5.5a3 3 0 1 1-6 0C13 7.9 14.1 6.3 16 4z"
          fill="url(#votive-flame)"
        />
      ) : (
        <path d="M16 9.5v2" stroke="#9a9081" strokeWidth="1.3" strokeLinecap="round" />
      )}

      {/* Bicchiere */}
      <rect
        x="6"
        y="14"
        width="20"
        height="26"
        rx="3"
        fill={lit ? "url(#votive-glass-lit)" : "url(#votive-glass-off)"}
      />
      <rect
        x="6"
        y="14"
        width="20"
        height="26"
        rx="3"
        fill="none"
        stroke={selected ? "#8a6119" : lit ? "#d59b3c" : "#d8cfbd"}
        strokeWidth={selected ? "2" : "1"}
      />
      {/* Riflesso sul vetro */}
      <rect x="9" y="17" width="3.5" height="20" rx="1.75" fill="#fff" opacity="0.45" />
    </svg>
  );
}
