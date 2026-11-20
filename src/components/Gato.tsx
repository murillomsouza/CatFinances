// Carinha de gato em SVG (mascote do app)
export default function Gato({ className = "size-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {/* orelhas */}
      <polygon points="9,32 11,5 31,17" fill="#ffa9c6" stroke="#5a3a44" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="55,32 53,5 33,17" fill="#ffa9c6" stroke="#5a3a44" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="13,25 14,12 24,18" fill="#ffe1eb" />
      <polygon points="51,25 50,12 40,18" fill="#ffe1eb" />
      {/* cabeça */}
      <ellipse cx="32" cy="38" rx="24" ry="20" fill="#ffffff" stroke="#5a3a44" strokeWidth="2.5" />
      {/* bochechas */}
      <circle cx="16" cy="43" r="4" fill="#ffc8db" />
      <circle cx="48" cy="43" r="4" fill="#ffc8db" />
      {/* olhos */}
      <circle cx="23" cy="36" r="2.8" fill="#5a3a44" />
      <circle cx="41" cy="36" r="2.8" fill="#5a3a44" />
      {/* nariz e boca */}
      <polygon points="29.5,41.5 34.5,41.5 32,44.5" fill="#ff86ae" />
      <path d="M32 44.5 q-3 4 -6 2 M32 44.5 q3 4 6 2" stroke="#5a3a44" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* bigodes */}
      <path d="M10 40 L2 38 M10 44 L3 46 M54 40 L62 38 M54 44 L61 46" stroke="#5a3a44" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
