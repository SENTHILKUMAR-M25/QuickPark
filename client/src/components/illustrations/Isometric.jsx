import React from "react";

function IsoCar({ x, y, color = "#2563eb", flip = false }) {
  const g = (f) => (flip ? `scale(-1 1) translate(${-f} 0)` : `translate(${f} 0)`);
  return (
    <g transform={g(x * 2 + 26)}>
      <g transform={`translate(0 ${y})`}>
        <ellipse cx="0" cy="16" rx="16" ry="5" fill="rgba(17,24,39,0.16)" />
        <path
          d="M-16 2 L-13 -6 L-7 -12 L6 -12 L13 -5 L15 2 Z"
          fill={color}
          stroke="rgba(17,24,39,0.18)"
          strokeWidth="1"
        />
        <path d="M-6 -10 L-2 -12 L4 -12 L9 -9 Z" fill="rgba(255,255,255,0.75)" />
        <rect x="-15" y="-4" width="6" height="5" rx="2" fill="#0f172a" />
        <rect x="9" y="-4" width="6" height="5" rx="2" fill="#0f172a" />
        <rect x="-15" y="2" width="6" height="5" rx="2" fill="#0f172a" />
        <rect x="9" y="2" width="6" height="5" rx="2" fill="#0f172a" />
      </g>
    </g>
  );
}

export function IsoParking({ className = "" }) {
  const slot = (x, y, filled = false, tone = "#2563eb") => (
    <g>
      <path d={`M${x} ${y} l24 -13 l24 13 l-24 13 z`} fill={filled ? tone : "#eef2ff"} stroke="rgba(17,24,39,0.14)" strokeWidth="1" />
      <path d={`M${x} ${y} l24 -13 M${x} ${y} l24 13`} stroke={filled ? "rgba(255,255,255,0.5)" : "rgba(99,102,241,0.35)"} strokeWidth="1" strokeDasharray="3 3" />
    </g>
  );

  return (
    <svg viewBox="0 0 300 220" className={className} role="img" aria-label="Isometric parking lot illustration">
      <defs>
        <linearGradient id="iso-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f5f7ff" />
          <stop offset="100%" stopColor="#ecfdf5" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="288" height="208" rx="20" fill="url(#iso-bg)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />

      {/* ground plane */}
      <path d="M30 40 L150 78 L270 40 L270 178 L150 200 L30 178 Z" fill="#ffffff" stroke="rgba(17,24,39,0.12)" strokeWidth="1.5" />
      <path d="M30 40 L150 78 L270 40" fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeDasharray="6 5" />

      {/* parking slots */}
      {slot(52, 70, true, "#2563eb")}
      {slot(96, 56, false)}
      {slot(52, 108, true, "#10b981")}
      {slot(96, 94, true, "#2563eb")}
      {slot(52, 146, false)}
      {slot(96, 132, true, "#f97316")}
      {slot(200, 70, true, "#2563eb")}
      {slot(200, 108, false)}

      {/* cars */}
      <IsoCar x={0} y={40} color="#2563eb" />
      <IsoCar x={24} y={82} color="#10b981" flip />
      <IsoCar x={124} y={40} color="#f97316" />

      {/* barrier arm */}
      <g transform="translate(148 70)">
        <rect x="-4" y="0" width="8" height="16" rx="3" fill="#1f2937" />
        {arm()}
      </g>

      {/* roof canopy */}
      <path d="M48 120 L150 152 L252 120" fill="none" stroke="rgba(37,99,235,0.35)" strokeWidth="2" strokeDasharray="4 4" />

      {/* floating coins */}
      <g>
        <circle cx="238" cy="40" r="8" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="238" y="44" textAnchor="middle" fontSize="9" fontWeight="700" fill="#92400e">₹</text>
      </g>
      <g>
        <circle cx="260" cy="60" r="8" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="260" y="64" textAnchor="middle" fontSize="9" fontWeight="700" fill="#92400e">₹</text>
      </g>
    </svg>
  );
}

function arm() {
  return <rect x="3" y="-2" width="34" height="4" rx="2" fill="#f97316" />;
}

export function IsoCarSolo({ className = "", color = "#2563eb" }) {
  return (
    <svg viewBox="0 0 220 130" className={className} role="img" aria-label="3D car illustration">
      <defs>
        <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="112" rx="78" ry="12" fill="rgba(17,24,39,0.14)" />
      <path
        d="M40 70 C40 66 42 62 46 60 L74 48 C84 42 92 40 104 40 L140 40 C154 40 166 46 176 56 L188 64 C192 66 194 70 194 74 L194 92 C194 98 190 102 184 102 L36 102 C30 102 26 98 26 92 Z"
        fill="url(#car-body)"
        stroke="rgba(17,24,39,0.2)"
        strokeWidth="1.5"
      />
      <path
        d="M70 48 L82 42 C92 38 100 36 110 36 L138 36 C150 36 162 42 172 52 L182 60 C186 62 189 66 189 70 L189 72 C189 74 188 76 186 76 L58 76 C54 76 52 74 52 70 L52 60 C52 54 56 50 62 48 Z"
        fill="rgba(255,255,255,0.2)"
      />
      <rect x="70" y="50" width="70" height="16" rx="7" fill="rgba(255,255,255,0.28)" />
      <rect x="34" y="76" width="20" height="18" rx="6" fill="#0f172a" />
      <rect x="182" y="76" width="20" height="18" rx="6" fill="#0f172a" />
      <ellipse cx="66" cy="100" rx="12" ry="8" fill="#0f172a" />
      <ellipse cx="66" cy="100" rx="5" ry="3.4" fill="#cbd5e1" />
      <ellipse cx="166" cy="100" rx="12" ry="8" fill="#0f172a" />
      <ellipse cx="166" cy="100" rx="5" ry="3.4" fill="#cbd5e1" />
    </svg>
  );
}

export function IsoPhone({ className = "" }) {
  return (
    <svg viewBox="0 0 160 300" className={className} role="img" aria-label="Smartphone illustration">
      <rect x="22" y="10" width="116" height="280" rx="26" fill="#0b1220" />
      <rect x="28" y="16" width="104" height="268" rx="20" fill="#ffffff" />
      <rect x="64" y="22" width="32" height="8" rx="4" fill="#0b1220" />
      <rect x="30" y="30" width="100" height="176" rx="12" fill="#f2f5ff" />
      <circle cx="46" cy="48" r="7" fill="#2563eb" />
      <rect x="60" y="42" width="44" height="5" rx="2.5" fill="#1e293b" />
      <rect x="60" y="52" width="30" height="4" rx="2" fill="#94a3b8" />
      <rect x="30" y="66" width="100" height="120" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="36" y="74" width="46" height="5" rx="2.5" fill="#2563eb" />
      <rect x="36" y="86" width="88" height="4" rx="2" fill="#cbd5e1" />
      <rect x="36" y="96" width="88" height="4" rx="2" fill="#e2e8f0" />
      <rect x="36" y="106" width="60" height="4" rx="2" fill="#e2e8f0" />
      <circle cx="130" cy="138" r="10" fill="#10b981" />
      <rect x="30" y="210" width="100" height="60" rx="12" fill="#2563eb" />
      <rect x="38" y="228" width="60" height="5" rx="2.5" fill="rgba(255,255,255,0.85)" />
      <rect x="38" y="240" width="40" height="4" rx="2" fill="rgba(255,255,255,0.6)" />
      <circle cx="120" cy="120" r="16" fill="#2563eb" opacity="0.15" />
    </svg>
  );
}

export function IsoBarrier({ className = "" }) {
  return (
    <svg viewBox="0 0 200 120" className={className} role="img" aria-label="Parking barrier illustration">
      <rect x="10" y="10" width="180" height="100" rx="16" fill="#f5f7ff" stroke="rgba(255,255,255,0.9)" />
      <rect x="30" y="66" width="34" height="30" rx="6" fill="#1f2937" />
      <rect x="44" y="40" width="6" height="26" rx="3" fill="#374151" />
      <rect x="47" y="34" width="34" height="6" rx="3" fill="#f97316" transform="rotate(-24 47 34)" />
      <circle cx="50" cy="64" r="9" fill="#2563eb" />
      <circle cx="50" cy="64" r="4" fill="#bfdbfe" />
      <rect x="66" y="70" width="16" height="18" rx="4" fill="#cbd5e1" />
      <rect x="88" y="62" width="18" height="26" rx="4" fill="#e2e8f0" />
      <text x="120" y="78" fontSize="14" fontWeight="700" fill="#10b981" fontFamily="monospace">OPEN</text>
      <circle cx="170" cy="70" r="14" fill="#10b981" />
      <path d="M164 70 l5 5 l8 -9" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}
