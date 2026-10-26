import React from "react";
import { C } from "./theme";
import { rad } from "./anim";

/**
 * Thin gold/teal line-art (1–2 px) in the upper-middle, strict centre-axis symmetry (x = 540).
 * Motion vocabulary from Ayman's reels: draw-on, orbit, pulse, spotlight lens on a word.
 * Every abstract idea becomes an object: up = divine, down = worldly; squiggle = straying,
 * taut line pulled up = returning; rising particles = prayers; rays/arch from the top = divine mercy.
 * Path generators ported from the 002 reel (lib.js).
 */
export const arcD = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  const s = p(a0), e = p(a1);
  return `M${s[0]},${s[1]} A${r},${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${e[0]},${e[1]}`;
};
export const circD = (cx: number, cy: number, r: number) => `M${cx},${cy - r} A${r},${r} 0 1 1 ${cx - 0.01},${cy - r}`;
/** 8-pointed star (two squares) — octagram / Rub el Hizb motif */
export const starD = (cx: number, cy: number, r: number) => {
  let d = "";
  for (let k = 0; k < 2; k++) {
    const pts = [0, 1, 2, 3].map((i) => {
      const a = rad(45 * k + 90 * i - 90);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    d += `M${pts[0]} L${pts[1]} L${pts[2]} L${pts[3]} Z `;
  }
  return d;
};
/** round arch (door / mihrab) standing on y=base */
export const archD = (x: number, base: number, w: number, h: number, pad = 0) => {
  const X0 = x - w / 2 - pad, X1 = x + w / 2 + pad, top = base - h - pad, r = w / 2 + pad;
  return `M${X0},${base} L${X0},${top + r} A${r},${r} 0 0 1 ${X1},${top + r} L${X1},${base}`;
};
/** pointed (Islamic) arch */
export const pointArchD = (x: number, base: number, w: number, h: number) => {
  const X0 = x - w / 2, X1 = x + w / 2, sh = base - h * 0.55, top = base - h;
  return `M${X0},${base} L${X0},${sh} C${X0},${sh - h * 0.28} ${x - w * 0.18},${top + h * 0.1} ${x},${top} C${x + w * 0.18},${top + h * 0.1} ${X1},${sh - h * 0.28} ${X1},${sh} L${X1},${base}`;
};
/** wave: amp 0 = straight line (worries -> calm: animate amp to 0 and colour coral -> gold) */
export const waveD = (x0: number, x1: number, y: number, amp: number, per: number, ph: number) => {
  let d = "";
  for (let x = x0; x <= x1; x += 4) {
    const y1 = y + amp * Math.sin(((x - x0) / per) * 2 * Math.PI + ph) * Math.sin((Math.PI * (x - x0)) / (x1 - x0));
    d += (d ? " L" : "M") + x.toFixed(1) + "," + y1.toFixed(1);
  }
  return d;
};
export const ellD = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx},${cy} A${rx},${ry} 0 1 0 ${cx + rx},${cy} A${rx},${ry} 0 1 0 ${cx - rx},${cy}`;

/** stroke draw-on without measuring: pathLength=1 */
export const DrawPath: React.FC<{
  d: string;
  progress: number; // 0..1
  color?: string;
  width?: number;
  opacity?: number;
  dash?: string; // e.g. "2 9" for dotted guides (drawn without draw-on)
  glow?: boolean;
}> = ({ d, progress, color = C.gold, width = 1.8, opacity = 1, dash, glow }) => {
  if (progress <= 0 || opacity <= 0.001) return null;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      pathLength={dash ? undefined : 1}
      strokeDasharray={dash ?? "1 1"}
      strokeDashoffset={dash ? 0 : 1 - progress}
      style={glow ? { filter: `drop-shadow(0 0 6px ${color})` } : undefined}
    />
  );
};

/** soft glowing orb (a soul, a prayer, a good deed) — never draw a person for prophets/angels */
export const Orb: React.FC<{ x: number; y: number; r?: number; color?: string; opacity?: number }> = ({ x, y, r = 13, color = "#FFF0C4", opacity = 1 }) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={r * 3.5} fill={C.gold} opacity={0.12} />
    <circle cx={x} cy={y} r={r * 1.8} fill={C.gold} opacity={0.22} />
    <circle cx={x} cy={y} r={r} fill={color} style={{ filter: `drop-shadow(0 0 8px ${C.gold})` }} />
  </g>
);

/** gold spotlight cone from the top + floor ellipse (character reels) */
export const Spotlight: React.FC<{ x: number; floor: number; opacity: number; top?: number; spread?: number }> = ({ x, floor, opacity, top = 0, spread = 170 }) =>
  opacity <= 0.001 ? null : (
    <g opacity={opacity}>
      <defs>
        <linearGradient id={`cone${x}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.gold} stopOpacity={0.0} />
          <stop offset="0.25" stopColor={C.gold} stopOpacity={0.18} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <path d={`M${x - 28},${top} L${x + 28},${top} L${x + spread},${floor} L${x - spread},${floor} Z`} fill={`url(#cone${x})`} style={{ filter: "blur(6px)" }} />
      <ellipse cx={x} cy={floor + 4} rx={spread} ry={22} fill={C.gold} opacity={0.18} style={{ filter: "blur(4px)" }} />
    </g>
  );
