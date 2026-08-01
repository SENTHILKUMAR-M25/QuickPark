import React, { useMemo } from "react";
import { motion } from "framer-motion";

function Building({ x, y, w, h, color, rounded = 6 }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={rounded}
      fill={color}
      opacity={0.92}
    />
  );
}

function CarDot({ x, y, angle = 0, color = "#1f2937" }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x={-7} y={-3.5} width={14} height={7} rx={3} fill={color} />
      <rect x={-4} y={-5} width={8} height={2.6} rx={1.3} fill="rgba(255,255,255,0.85)" />
      <rect x={-4} y={2.4} width={8} height={2.6} rx={1.3} fill="rgba(255,255,255,0.85)" />
    </g>
  );
}

function Tree({ cx, cy, r = 5 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#10b981" opacity={0.7} />
      <circle cx={cx - r * 0.4} cy={cy - r * 0.3} r={r * 0.6} fill="#34d399" opacity={0.9} />
    </g>
  );
}

function MapPinMarker({ x, y, tone = "brand", delay = 0 }) {
  const stroke = tone === "mint" ? "#10b981" : tone === "ember" ? "#f97316" : "#2563eb";
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g
        initial={{ opacity: 0.7, scale: 0.6 }}
        animate={{ opacity: [0.7, 0, 0], scale: [0.6, 2.3, 2.3] }}
        transition={{ duration: 2.6, delay, repeat: Infinity, ease: "easeOut" }}
      >
        <circle r={11} fill={stroke} opacity={0.25} />
      </motion.g>
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0 -12 C 7 -12, 11 -6, 11 0 C 11 7, 5 12, 0 13 C -5 12, -11 7, -11 0 C -11 -6, -7 -12, 0 -12 Z"
          fill={stroke}
          stroke="white"
          strokeWidth="2"
        />
        <circle cy={-0.5} r={3.4} fill="white" />
      </motion.g>
    </g>
  );
}

export default function CityMap({ className = "" }) {
  const buildings = useMemo(
    () => [
      { x: 40, y: 40, w: 74, h: 52, color: "#e6e9f0" },
      { x: 132, y: 30, w: 56, h: 74, color: "#eae6fd" },
      { x: 208, y: 48, w: 88, h: 46, color: "#dfe7fe" },
      { x: 320, y: 26, w: 64, h: 62, color: "#e9f5ee" },
      { x: 404, y: 44, w: 96, h: 54, color: "#e6e9f0" },
      { x: 38, y: 156, w: 60, h: 66, color: "#fdeee1" },
      { x: 118, y: 148, w: 72, h: 48, color: "#dfe7fe" },
      { x: 330, y: 132, w: 74, h: 56, color: "#eae6fd" },
      { x: 430, y: 128, w: 70, h: 84, color: "#e6e9f0" },
      { x: 48, y: 284, w: 96, h: 62, color: "#e9f5ee" },
      { x: 168, y: 272, w: 66, h: 50, color: "#e6e9f0" },
      { x: 258, y: 264, w: 84, h: 72, color: "#fdeee1" },
      { x: 380, y: 256, w: 62, h: 54, color: "#dfe7fe" },
      { x: 470, y: 240, w: 88, h: 52, color: "#eae6fd" },
      { x: 40, y: 392, w: 88, h: 54, color: "#dfe7fe" },
      { x: 250, y: 386, w: 70, h: 60, color: "#e6e9f0" },
      { x: 350, y: 376, w: 90, h: 44, color: "#e9f5ee" },
      { x: 462, y: 392, w: 66, h: 56, color: "#fdeee1" },
    ],
    []
  );

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 560 480"
        className="h-full w-full"
        role="img"
        aria-label="Interactive map of a smart city with available parking locations"
      >
        <defs>
          <linearGradient id="map-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2f5ff" />
            <stop offset="55%" stopColor="#eefbf6" />
            <stop offset="100%" stopColor="#f5f2ff" />
          </linearGradient>
          <filter id="blob-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor="#2563eb" floodOpacity="0.14" />
          </filter>
        </defs>

        {/* Map canvas */}
        <rect x="0" y="0" width="560" height="480" rx="36" fill="url(#map-bg)" />
        <rect x="0" y="0" width="560" height="480" rx="36" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />

        {/* subtle grid */}
        <g opacity="0.35">
          {[...Array(12)].map((_, i) => (
            <line key={`v${i}`} x1={i * 48} y1="0" x2={i * 48} y2="480" stroke="#c7d2fe" strokeWidth="0.5" strokeDasharray="2 6" />
          ))}
          {[...Array(11)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 48} x2="560" y2={i * 48} stroke="#c7d2fe" strokeWidth="0.5" strokeDasharray="2 6" />
          ))}
        </g>

        {/* Park / green blocks */}
        <rect x="222" y="96" width="82" height="40" rx="14" fill="#d1fae5" opacity="0.9" />
        <rect x="520" y="330" width="30" height="60" rx="10" fill="#d1fae5" opacity="0.7" />
        <rect x="10" y="250" width="22" height="48" rx="10" fill="#d1fae5" opacity="0.7" />

        {/* Buildings */}
        {buildings.map((b, i) => (
          <g key={i}>
            <Building {...b} />
            {/* window grid for hero buildings */}
            {b.w > 60 &&
              [...Array(Math.floor(b.w / 16))].map((_, wx) =>
                [...Array(Math.floor(b.h / 16))].map((_, wy) => (
                  <rect
                    key={`${wx}-${wy}`}
                    x={b.x + 8 + wx * 16}
                    y={b.y + 8 + wy * 16}
                    width={8}
                    height={8}
                    rx={2.4}
                    fill="rgba(255,255,255,0.85)"
                  />
                ))
              )}
          </g>
        ))}

        {/* Trees */}
        <Tree cx={120} cy={96} r={6} />
        <Tree cx={160} cy={252} r={5} />
        <Tree cx={320} cy={222} r={5} />
        <Tree cx={30} cy={352} r={6} />
        <Tree cx={520} cy={96} r={5} />
        <Tree cx={540} cy={216} r={6} />
        <Tree cx={420} cy={340} r={5} />

        {/* Route from current location to parking */}
        <motion.path
          d="M 100 120 C 150 150, 150 190, 196 196"
          fill="none"
          stroke="#10b981"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1 12"
          initial={{ pathLength: 0, opacity: 0.9 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
          filter="url(#blob-shadow)"
        />
        <motion.path
          d="M 196 196 L 210 210"
          fill="none"
          stroke="#10b981"
          strokeWidth="5"
          strokeLinecap="round"
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 0.9, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Cars on roads */}
        <CarDot x={180} y={96} angle={0} color="#1d4fd8" />
        <CarDot x={330} y={196} angle={0} color="#0f766e" />
        <CarDot x={120} y={150} angle={-90} color="#f97316" />
        <CarDot x={470} y={210} angle={180} color="#111827" />
        <CarDot x={252} y={316} angle={0} color="#1e3a8a" />
        <CarDot x={96} y={384} angle={90} color="#0f766e" />
        <CarDot x={420} y={344} angle={180} color="#f97316" />

        {/* Parking markers */}
        <MapPinMarker x={210} y={210} tone="mint" delay={0} />
        <MapPinMarker x={360} y={96} tone="brand" delay={0.7} />
        <MapPinMarker x={470} y={320} tone="brand" delay={1.3} />
        <MapPinMarker x={96} y={212} tone="ember" delay={1.9} />
        <MapPinMarker x={320} y={330} tone="brand" delay={2.5} />

        {/* Current location */}
        <g transform="translate(100 120)">
          <circle r="14" fill="#2563eb" opacity="0.12" />
          <circle r="9" fill="#2563eb" opacity="0.2" />
          <circle r="4.5" fill="#2563eb" />
          <circle r="4.5" fill="none" stroke="white" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
