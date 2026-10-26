import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FPS } from "./theme";
import { P, E } from "./anim";

/**
 * Fixed HUD of every religious reel (positions from the 002 reel + Ayman's reference works):
 * - header y≈92: Latin mono label left (e.g. "QURAN · 09:102"), Arabic right: <gold category> · <grey topic>
 * - thin L-brackets in the 4 corners, hairlines under the header / above the footer
 * - footer y≈1826: counter "01 / 03" left, spaced mono transliterated title centre, watermark "aymen.1303" right
 * Fades in after the logo intro (t≈1.9 s). Hidden during the outro (the big name is shown there).
 */
export type HudProps = {
  left: string; // "QURAN · 09:102"  /  "HADITH QUDSI"  /  "FIG.01 — SLEEP"
  category: string; // gold: "القرآن الكريم" / "حديث قدسي" / "بروتوكول الفجر"
  topic: string; // grey: "سورة التوبة" / "حسن الظن بالله"
  counter?: string; // "01 / 03"
  title?: string; // "AT-TAWBAH · 9 : 102 — 104"
  watermark?: string; // always "aymen.1303"
  inAt?: number; // seconds
  outAt?: number; // seconds (outro start)
  brackets?: boolean;
  /** briefly dip label/counter when the page changes (pass switch times) */
  switches?: number[];
};

const Bracket: React.FC<{ x: number; y: number; sx: number; sy: number; o: number }> = ({ x, y, sx, sy, o }) => (
  <path
    d={`M${x + sx * 46},${y} L${x},${y} L${x},${y + sy * 46}`}
    stroke={C.mgold}
    strokeWidth={1.6}
    fill="none"
    opacity={0.55 * o}
  />
);

export const HudFrame: React.FC<HudProps> = ({
  left,
  category,
  topic,
  counter,
  title,
  watermark = "aymen.1303",
  inAt = 1.9,
  outAt = 1e9,
  brackets = true,
  switches = [],
}) => {
  const t = useCurrentFrame() / FPS;
  const op = P(t, inAt, 0.9, E.s) * (1 - P(t, outAt + 0.3, 0.8, E.s));
  let ch = 1;
  for (const a of switches) if (t > a - 0.3 && t < a + 0.35) ch = Math.min(ch, Math.abs(t - a) / 0.3);
  ch = E.s(Math.min(1, ch));
  const hud: React.CSSProperties = {
    position: "absolute",
    fontFamily: FONT.mono,
    letterSpacing: ".32em",
    fontSize: 21,
    color: C.teal,
    direction: "ltr",
    whiteSpace: "nowrap",
  };
  const [dotA, dotB] = watermark.split(".");
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {brackets && (
          <>
            <Bracket x={40} y={40} sx={1} sy={1} o={op} />
            <Bracket x={1040} y={40} sx={-1} sy={1} o={op} />
            <Bracket x={40} y={1880} sx={1} sy={-1} o={op} />
            <Bracket x={1040} y={1880} sx={-1} sy={-1} o={op} />
          </>
        )}
        <line x1={78} x2={1002} y1={142} y2={142} stroke={C.teal} strokeWidth={1} opacity={0.35 * op} />
        <line x1={78} x2={1002} y1={1806} y2={1806} stroke={C.teal} strokeWidth={1} opacity={0.35 * op} />
      </svg>
      <div style={{ ...hud, left: 78, top: 92, opacity: op * ch }}>{left}</div>
      <div
        style={{
          ...hud,
          right: 78,
          top: 84,
          fontFamily: FONT.ar,
          fontWeight: 500,
          fontSize: 27,
          letterSpacing: 0,
          direction: "rtl",
          color: C.grey,
          opacity: op,
        }}
      >
        <span style={{ color: C.mgold }}>{category}</span> · {topic}
      </div>
      {counter && <div style={{ ...hud, left: 78, top: 1826, opacity: op * ch }}>{counter}</div>}
      {title && (
        <div
          style={{ ...hud, left: 0, width: 1080, textAlign: "center", top: 1826, fontSize: 19, letterSpacing: ".42em", color: C.footer, opacity: op }}
        >
          {title}
        </div>
      )}
      <div
        style={{ ...hud, right: 78, top: 1828, fontFamily: FONT.monoR, fontSize: 18, letterSpacing: ".22em", color: C.gold, opacity: 0.5 * op }}
      >
        {dotA}
        {dotB !== undefined && <span style={{ color: C.grey }}>.</span>}
        {dotB}
      </div>
    </>
  );
};

/** small progress ticks (one per page/scene); current one pulses gold */
export const ProgressTicks: React.FC<{ count: number; index: number; y?: number; opacity?: number }> = ({
  count,
  index,
  y = 1770,
  opacity = 1,
}) => {
  const t = useCurrentFrame() / FPS;
  const w = 26, gap = 12, x0 = 540 - (count * w + (count - 1) * gap) / 2;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }, (_, i) => (
        <rect
          key={i}
          x={x0 + i * (w + gap)}
          y={y}
          width={w}
          height={3}
          rx={1.5}
          fill={i === index ? C.gold : C.mgold}
          opacity={opacity * (i <= index ? 0.85 : 0.22) * (i === index ? 0.7 + 0.3 * Math.sin(t * 3) : 1)}
        />
      ))}
    </svg>
  );
};
