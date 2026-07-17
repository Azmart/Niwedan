/**
 * A romantic "official" wax seal. Decorative — hidden from screen readers.
 */
export default function Seal({ size = 116, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={`drop-shadow-[0_8px_24px_rgba(140,15,36,0.6)] ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="seal-fill" cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#ff6582" />
          <stop offset="55%" stopColor="#c41e3a" />
          <stop offset="100%" stopColor="#7a0c1f" />
        </radialGradient>
        <linearGradient id="seal-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffd9e0" />
          <stop offset="1" stopColor="#7df0ff" />
        </linearGradient>
        <path
          id="seal-arc"
          d="M60 60 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"
          fill="none"
        />
      </defs>

      {/* scalloped wax edge */}
      <g fill="url(#seal-fill)">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2
          const cx = 60 + Math.cos(a) * 52
          const cy = 60 + Math.sin(a) * 52
          return <circle key={i} cx={cx} cy={cy} r="9" />
        })}
      </g>

      <circle cx="60" cy="60" r="50" fill="url(#seal-fill)" />
      <circle
        cx="60"
        cy="60"
        r="44"
        fill="none"
        stroke="url(#seal-ring)"
        strokeWidth="1.4"
        opacity="0.85"
      />

      {/* circular text */}
      <text
        fill="#ffe9ee"
        fontSize="8.4"
        fontFamily="ui-monospace, monospace"
        letterSpacing="2.2"
      >
        <textPath href="#seal-arc" startOffset="2%">
          · OFFICE OF AFFECTIONS · REQUEST ART-001 ·
        </textPath>
      </text>

      {/* center heart */}
      <path
        d="M60 78C49 71 43 65 43 58.5 43 54 46.6 50.5 51 50.5c2.9 0 5.4 1.5 7 3.8 1.6-2.3 4.1-3.8 7-3.8 4.4 0 8 3.5 8 8C73 65 71 71 60 78Z"
        fill="#ffe9ee"
      />
      <text
        x="60"
        y="92"
        textAnchor="middle"
        fill="#ffd9e0"
        fontSize="7"
        fontFamily="ui-monospace, monospace"
        letterSpacing="1.5"
      >
        SEALED
      </text>
    </svg>
  )
}
