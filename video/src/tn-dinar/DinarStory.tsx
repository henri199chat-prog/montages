import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { E, P, env, hash, lerp, clamp } from "../religious/anim";
import { T, F, useTnFonts, USD_TND, rateAt } from "./theme";
import data from "./data/dinar.json";

/**
 * «قصة الدينار التونسي» — economic documentary reel (1080×1920, ~122 s). v2 after an mg-styles-15 rubric review:
 * cold-open hook (the coin slams in, flies to the balance), motivated transitions (zoom-through into the coin that becomes
 * the chart's first point, whip pans, a full red wipe as signature on 3 seams), a camera that follows the chart line and
 * pulls back on 3.04 (hero), punch-ins on key words, giant background words for depth, bigger composition.
 * Fps-agnostic: render at 60 fps and blend pairs of frames → 30 fps for a 180° motion-blur shutter (see README).
 * Voice: ElevenLabs «Jaleel / Celil – Arabic Narrator» (eleven_v4). Data: World Bank PA.NUS.FCRF 1975–2025 + Nov 2026 ≈ 3.04.
 */
type W = { t: string; k: string; on: number; off: number };
type Ch = { i: number; on: number; off: number; words: W[] };
const D = data as unknown as { off: number; voiceDur: number; total: number; chunks: Ch[] };
const CH = D.chunks;
const c = (i: number) => CH[i].on;
const ce = (i: number) => CH[i].off;
const cw = (i: number, j: number) => CH[i].words[Math.min(j, CH[i].words.length - 1)].on;
const END = ce(CH.length - 1);
export const DINAR_STORY_TOTAL = D.total;

// scene starts; seam k = start of scene k (k ≥ 1)
const SB = [0, c(4), c(9), c(17), c(20), c(23), c(27), c(29), c(32), c(34), c(37), c(40), c(42)];
type Seam = "zoom" | "whip" | "slab";
const SEAM: Record<number, Seam> = { 1: "zoom", 2: "zoom", 3: "slab", 4: "whip", 5: "zoom", 6: "slab", 7: "zoom", 8: "whip", 9: "whip", 10: "slab", 11: "whip", 12: "zoom" };
const sceneEnd = (k: number) => (k + 1 < SB.length ? SB[k + 1] : D.total);
/** near-cut visibility: the seam's motion (zoom / whip / wipe) carries the change */
const sceneOp = (t: number, k: number) => {
  const a = k ? SB[k] : -1, b = k + 1 < SB.length ? SB[k + 1] : D.total + 1;
  return env(t, a - 0.05, 0.1, b - 0.05, 0.1);
};
const sceneU = (t: number, k: number) => clamp((t - SB[k]) / (sceneEnd(k) - SB[k]));

// ---------- camera ----------
type Cam = { s: number; fx: number; fy: number; tx: number };
const camStr = (c0: Cam) => `translate(${540 + c0.tx},800) scale(${c0.s}) translate(${-c0.fx},${-c0.fy})`;
/** persistent punch-ins: each adds zoom with a little overshoot */
const PUNCH: Record<number, [number, number][]> = {};
/** camera of a normal scene k: arrival (zoom/whip in), slow push, punch-ins, departure (zoom into focal / whip out) */
const sceneCam = (t: number, k: number, focalOut?: [number, number]): Cam => {
  let s = 1 + 0.05 * E.s(sceneU(t, k));
  for (const [at, amt] of PUNCH[k] ?? []) s += amt * P(t, at, 0.45, E.back);
  let fx = 540, fy = 800, tx = 0;
  if (k > 0) {
    const m = SEAM[k];
    if (m === "zoom") s *= lerp(1.6, 1, P(t, SB[k], 0.55, E.o));
    if (m === "whip") tx += lerp(1300, 0, P(t, SB[k], 0.34, E.o));
  }
  if (k + 1 < SB.length) {
    const T1 = SB[k + 1], m = SEAM[k + 1];
    if (m === "zoom" && focalOut) {
      const u = P(t, T1 - 0.34, 0.34, E.i);
      fx = lerp(fx, focalOut[0], P(t, T1 - 0.45, 0.3, E.o));
      fy = lerp(fy, focalOut[1], P(t, T1 - 0.45, 0.3, E.o));
      s *= lerp(1, 7, u);
    }
    if (m === "whip") tx -= lerp(0, 1300, P(t, T1 - 0.3, 0.3, E.i));
  }
  return { s, fx, fy, tx };
};

// ---------- small drawing helpers ----------
const Txt: React.FC<{ x: number; y: number; s: number; children: React.ReactNode; color?: string; font?: string; w?: number; op?: number; anchor?: "middle" | "start" | "end" }> = ({
  x, y, s, children, color = T.white, font = F.ar, w = 800, op = 1, anchor = "middle",
}) =>
  op <= 0.001 ? null : (
    // in RTL text SVG's start/end are mirrored: map so that anchor="end" still means "right edge at x"
    <text x={x} y={y} textAnchor={anchor === "end" ? "start" : anchor === "start" ? "end" : "middle"} fill={color} opacity={op} style={{ fontFamily: font, fontSize: s, fontWeight: w }} direction="rtl">
      {children}
    </text>
  );
const Mono: React.FC<{ x: number; y: number; text: string; op?: number; color?: string; s?: number; anchor?: "middle" | "start" | "end" }> = ({ x, y, text, op = 1, color = T.grey, s = 20, anchor = "middle" }) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor={anchor} fill={color} opacity={op} style={{ fontFamily: F.mono, fontSize: s, letterSpacing: ".16em" }}>
      {text}
    </text>
  );
const Line: React.FC<{ d: string; u: number; color?: string; w?: number; op?: number; glow?: boolean }> = ({ d, u, color = T.white, w = 3, op = 1, glow }) =>
  u <= 0 || op <= 0.001 ? null : (
    <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={op} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - u} style={glow ? { filter: `drop-shadow(0 0 10px ${color})` } : undefined} />
  );
/** a coin: dinar (red, «د.ت»), dollar (steel, $), euro (blue, €) */
const Coin: React.FC<{ x: number; y: number; r: number; kind: "tnd" | "usd" | "eur"; op?: number; label?: string }> = ({ x, y, r, kind, op = 1, label }) => {
  if (op <= 0.001 || r <= 0.5) return null;
  const col = kind === "tnd" ? T.red : kind === "usd" ? T.steel : T.euro;
  const sym = kind === "tnd" ? "د.ت" : kind === "usd" ? "$" : "€";
  return (
    <g opacity={op}>
      <circle cx={x} cy={y + r * 0.1} r={r} fill="#000" opacity={0.5} />
      <circle cx={x} cy={y} r={r} fill={kind === "tnd" ? T.redDeep : "#1d2229"} stroke={col} strokeWidth={Math.max(2, r * 0.07)} />
      <circle cx={x} cy={y} r={r * 0.8} fill="none" stroke={col} strokeWidth={Math.max(1, r * 0.025)} strokeDasharray={`${r * 0.05} ${r * 0.06}`} opacity={0.8} />
      {/* specular sweep */}
      <path d={`M${x - r * 0.7},${y - r * 0.45} A${r * 0.85},${r * 0.85} 0 0 1 ${x + r * 0.3},${y - r * 0.82}`} fill="none" stroke="#fff" strokeOpacity={0.25} strokeWidth={Math.max(1.5, r * 0.05)} strokeLinecap="round" />
      <text x={x} y={y + (kind === "tnd" ? r * 0.28 : r * 0.36)} textAnchor="middle" fill={kind === "tnd" ? T.white : col} style={{ fontFamily: kind === "tnd" ? F.ar : F.hit, fontWeight: 900, fontSize: kind === "tnd" ? r * 0.78 : r * 1.05 }}>
        {sym}
      </text>
      {label && <Mono x={x} y={y + r + 40} text={label} color={col} s={Math.max(18, r * 0.2)} />}
    </g>
  );
};

// ---------- the chart (dinars per 1 US dollar) ----------
const CX0 = 120, CX1 = 980, CY0 = 1240, CY1 = 440, VMAX = 3.5, Y0 = 1975, Y1 = 2026.88;
const cx = (y: number) => CX0 + ((y - Y0) / (Y1 - Y0)) * (CX1 - CX0);
const cy = (v: number) => CY0 - (v / VMAX) * (CY0 - CY1);
const pathTo = (yEnd: number) => {
  const pts: [number, number][] = [];
  for (const [y, v] of USD_TND) {
    if (y > yEnd) break;
    pts.push([cx(y), cy(v)]);
  }
  if (yEnd > Y0 && yEnd < Y1) pts.push([cx(yEnd), cy(rateAt(yEnd))]);
  return pts;
};
const drawToAt = (t: number) => {
  let d = 1975;
  d = lerp(d, 1993, P(t, c(9), c(10) - c(9) + 0.6, E.io));
  d = lerp(d, 2011, P(t, c(12), c(13) - c(12), E.io));
  d = lerp(d, Y1, P(t, c(14) + 0.4, c(15) - c(14) + 0.6, E.i));
  return d;
};
/** chart camera: follows the line head while it draws, pulls back on 3.04; frames the 2011–2022 band; dives into 3.04 */
const chartCam = (t: number): Cam => {
  const head = (() => {
    const y = drawToAt(t);
    return [cx(y), cy(rateAt(y))];
  })();
  if (t < SB[3] + 0.5) {
    const pull = P(t, c(15) + 0.9, 1.3, E.io);
    const fx = lerp(clamp(head[0], 330, 760), 560, pull), fy = lerp(clamp(head[1], 640, 1060), 830, pull);
    let s = lerp(1.55, 1.0, pull) * lerp(2.2, 1, P(t, SB[2], 0.6, E.o));
    s += 0.06 * P(t, c(15) + 0.9, 0.45, E.back) * (1 - pull) ; // tiny overshoot into the reveal
    return { s, fx, fy, tx: 0 };
  }
  if (t < SB[6] + 0.5) {
    const settle = P(t, SB[5], 0.6, E.o);
    const fx = lerp(cx(2016.5), 600, P(t, c(26) - 0.2, 1.0, E.io)), fy = lerp(cy(2.15), 840, P(t, c(26) - 0.2, 1.0, E.io));
    const s = lerp(2.2, 1.35, settle) * lerp(1, 0.82, P(t, c(26) - 0.2, 1.0, E.io)) + 0.05 * P(t, c(25) + 1.3, 0.45, E.back);
    return { s, fx, fy, tx: 0 };
  }
  // question scene: frame the end of the line, then dive into the 3.04 point (it becomes the coin)
  const T1 = SB[12];
  const dive = P(t, T1 - 0.34, 0.34, E.i);
  const fx = lerp(lerp(cx(2016), cx(Y1), P(t, T1 - 0.6, 0.4, E.o)), cx(Y1), dive);
  const fy = lerp(lerp(cy(2.4), cy(3.04), P(t, T1 - 0.6, 0.4, E.o)), cy(3.04), dive);
  let tx = lerp(1300, 0, P(t, SB[11], 0.34, E.o));
  const s = 1.3 * lerp(1, 9, dive);
  return { s, fx, fy, tx };
};

const Chart: React.FC<{ t: number; op: number; drawTo: number; band: number; futures: number; titleOp: number }> = ({ t, op, drawTo, band, futures, titleOp }) => {
  if (op <= 0.001) return null;
  const pts = pathTo(drawTo);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = pts.length > 1 ? `${d} L${pts[pts.length - 1][0]},${CY0} L${pts[0][0]},${CY0} Z` : "";
  const head = pts[pts.length - 1] ?? [cx(Y0), cy(USD_TND[0][1])];
  const mark = (yr: number, v: number, label: string, col: string, show: number, up = true) =>
    show <= 0.001 ? null : (
      <g opacity={show}>
        <circle cx={cx(yr)} cy={cy(v)} r={10 + 22 * (1 - show)} fill="none" stroke={col} strokeWidth={2.5} opacity={1 - 0.5 * show} />
        <circle cx={cx(yr)} cy={cy(v)} r={9} fill={col} />
        <text x={cx(yr)} y={cy(v) + (up ? -30 : 62)} textAnchor="middle" fill={col} style={{ fontFamily: F.num, fontSize: 66 }}>
          {label}
        </text>
      </g>
    );
  return (
    <g opacity={op}>
      {[0.5, 1, 1.5, 2, 2.5, 3, 3.5].map((v) => (
        <g key={v}>
          <line x1={CX0} x2={CX1} y1={cy(v)} y2={cy(v)} stroke={T.white} strokeOpacity={v === 1 ? 0 : 0.07} strokeWidth={1} />
          <Mono x={CX0 - 14} y={cy(v) + 7} text={v.toFixed(1)} anchor="end" s={18} color={T.dim} />
        </g>
      ))}
      <line x1={CX0} x2={CX1} y1={CY0} y2={CY0} stroke={T.grey} strokeWidth={1.5} opacity={0.6} />
      {[1975, 1993, 2011, 2022].map((y) => (
        <Mono key={y} x={cx(y)} y={CY0 + 42} text={`${y}`} s={20} color={T.grey} />
      ))}
      <Mono x={cx(Y1)} y={CY0 + 42} text="2026" s={20} color={T.red} />
      <line x1={CX0} x2={CX1} y1={cy(1)} y2={cy(1)} stroke={T.white} strokeOpacity={0.4} strokeDasharray="8 10" strokeWidth={2} />
      <Txt x={CX0 + 10} y={cy(1) - 16} s={30} w={800} anchor="start" color={T.grey}>
        التعادل
      </Txt>
      {band > 0.001 && (
        <g opacity={band}>
          <rect x={cx(2011)} y={CY1 - 20} width={(cx(2022) - cx(2011)) * band} height={CY0 - CY1 + 20} fill={T.red} opacity={0.14} />
          <line x1={cx(2011)} x2={cx(2011)} y1={CY1 - 20} y2={CY0} stroke={T.red} strokeWidth={3} strokeDasharray="6 8" />
          <line x1={cx(2022)} x2={cx(2022)} y1={CY1 - 20} y2={CY0} stroke={T.red} strokeWidth={3} strokeDasharray="6 8" opacity={band} />
        </g>
      )}
      {area && <path d={area} fill="url(#areaG)" opacity={0.95} />}
      {d && <path d={d} fill="none" stroke={T.red} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${T.red})` }} opacity={lerp(1, 0.6, band)} />}
      {pts.length > 0 && (
        <g>
          <circle cx={head[0]} cy={head[1]} r={26 + 6 * Math.sin(t * 6)} fill="url(#headG)" />
          <circle cx={head[0]} cy={head[1]} r={8} fill={T.white} />
        </g>
      )}
      {mark(1975, 0.402, "0.40", T.white, drawTo >= 1975.2 ? P(drawTo, 1975.2, 1.5) : 0, false)}
      {mark(1993, 1.004, "1.00", T.white, drawTo >= 1993 ? P(drawTo, 1993, 2) : 0)}
      {mark(2011, 1.408, "1.41", T.white, drawTo >= 2011 ? P(drawTo, 2011, 2) : 0)}
      {mark(Y1, 3.04, "3.04", T.red, drawTo >= Y1 - 0.08 ? 1 : 0)}
      {futures > 0.001 && (
        <g opacity={futures}>
          <path d={`M${cx(Y1)},${cy(3.04)} Q${cx(Y1) + 40},${cy(2.9)} ${cx(Y1) + 70},${cy(2.5)}`} fill="none" stroke={T.white} strokeWidth={5} strokeDasharray="12 10" />
          <path d={`M${cx(Y1)},${cy(3.04)} Q${cx(Y1) + 40},${cy(3.2)} ${cx(Y1) + 70},${cy(3.45)}`} fill="none" stroke={T.red} strokeWidth={5} strokeDasharray="12 10" />
        </g>
      )}
      {/* the title only when the whole chart is in frame (zoomed in it would be cut by the frame edge) */}
      <Txt x={CX1} y={CY1 - 82} s={42} w={900} anchor="end" color={T.white} op={titleOp}>
        كم دينارًا يساوي الدولار؟
      </Txt>
      <Txt x={CX1} y={CY1 - 40} s={22} w={600} anchor="end" color={T.grey} op={titleOp}>
        المصدر: البنك الدولي (المعدل السنوي) · 2026: سعر السوق
      </Txt>
    </g>
  );
};

/** giant outlined word far behind each scene (depth + parallax) */
const BG_WORD = ["TND", "1975", "USD/TND", "≠", "1958", "−55%", "WHY", "INFLATION", "DEFICIT", "2011", "TUNISIA", "?", "TUNISIE"];

// ---------- scenes ----------
const Scene: React.FC<{ t: number }> = ({ t }) => {
  const op = (k: number) => sceneOp(t, k);
  // S0 hook — cold open: the coin slams in, then flies into the left pan; the dollar drops into the right pan
  const slamIn = P(t, 0, 0.32, E.back);
  const fly = P(t, 0.75, 0.6, E.io);
  const scaleIn = P(t, 0.35, 0.7, E.o);
  const usdDrop = P(t, 1.25, 0.55, E.back);
  const tilt = lerp(0, 15, P(t, cw(2, 1) - 0.1, 1.0, E.back));
  const slam = P(t, c(3) + 0.2, 0.35, E.back);
  const rot = (x: number, y: number, a: number, ox: number, oy: number) => {
    const r = (a * Math.PI) / 180;
    return [ox + (x - ox) * Math.cos(r) - (y - oy) * Math.sin(r), oy + (x - ox) * Math.sin(r) + (y - oy) * Math.cos(r)];
  };
  const leftEnd = rot(200, 700, -tilt, 540, 700);
  const coinPan = [leftEnd[0], leftEnd[1] + 102];
  const coin0 = [lerp(540, coinPan[0], fly), lerp(760, coinPan[1], fly) - Math.sin(Math.PI * fly) * 160];
  const coinR = lerp(lerp(320, 210, slamIn), 80, fly);
  // S1 1975
  const rewind = P(t, c(4), 1.5, E.o);
  const yearShown = Math.round(lerp(2026, 1975, rewind));
  const eq1 = P(t, c(6) - 0.1, 0.6, E.o);
  const flip = P(t, c(8) - 0.1, 0.8, E.io);
  // chart (S2, S5, S11)
  const chartOp = Math.max(op(2), op(5), op(11));
  const drawTo = drawToAt(t);
  const band = P(t, c(24) - 0.2, 1.4, E.io) * (1 - P(t, SB[6] - 0.4, 0.4));
  const futures = P(t, c(40) + 0.3, 1.2, E.o);
  // S3
  const warn = P(t, c(17) - 0.1, 0.6, E.back);
  const neq = P(t, c(18) + 0.3, 0.8, E.o);
  // S4
  const notesIn = P(t, c(20) + 0.6, 1.4, E.o);
  const collapse = P(t, c(22) - 0.2, 1.4, E.io);
  // S6
  const q = P(t, c(27) - 0.15, 0.6, E.back);
  const tiles = P(t, c(28) - 0.1, 0.9, E.o);
  // S7
  const prices = P(t, cw(29, 1) - 0.1, 2.6, E.io);
  const shrink = P(t, c(31) - 0.1, 1.2, E.io);
  // S8
  const imp = P(t, cw(32, 1) - 0.2, 1.0, E.o);
  const exp = P(t, cw(32, 3) - 0.2, 1.0, E.o);
  const reserve = P(t, c(33) - 0.1, 2.2, E.io);
  // S9
  const growth = P(t, cw(34, 3) - 0.6, 1.6, E.io);
  const flex = P(t, c(35) - 0.1, 1.4, E.io);
  const imf = P(t, c(36) + 0.2, 0.8, E.back);
  // S10
  const fall = P(t, c(37) + 0.2, 2.4);
  const basket = P(t, c(38) + 0.4, 1.6, E.io);
  const child = P(t, c(39) - 0.1, 1.0, E.o);
  // S12
  const flagU = P(t, c(43) - 0.3, 1.4, E.io);

  // punch-ins (filled once; pure function of the timeline)
  if (!PUNCH[0]) {
    Object.assign(PUNCH, {
      0: [[c(3) + 0.2, 0.08]],
      1: [[c(6), 0.05], [c(8), 0.06]],
      3: [[c(18) + 0.3, 0.07]],
      4: [[c(22) + 0.8, 0.07]],
      6: [[c(28), 0.05]],
      7: [[c(31), 0.06]],
      8: [[c(33), 0.06]],
      9: [[c(36) + 0.2, 0.06]],
      10: [[c(39), 0.07]],
      12: [[c(43) + 0.6, 0.06]],
    });
  }
  const cam0 = sceneCam(t, 0, [coinPan[0], coinPan[1]]);
  const cam1 = sceneCam(t, 1, [790, 860]);
  const cam4 = sceneCam(t, 4, [540, 880]);
  const cam6 = sceneCam(t, 6, [540, 940]);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T.red} stopOpacity={0.42} />
          <stop offset="1" stopColor={T.red} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="spot">
          <stop offset="0" stopColor={T.red} stopOpacity={0.3} />
          <stop offset="1" stopColor={T.red} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="headG">
          <stop offset="0" stopColor="#ffd2d6" stopOpacity={0.9} />
          <stop offset="0.35" stopColor={T.red} stopOpacity={0.55} />
          <stop offset="1" stopColor={T.red} stopOpacity={0} />
        </radialGradient>
        <clipPath id="halfCoin">
          <rect x={0} y={0} width={1080} height={764} />
        </clipPath>
      </defs>

      {/* giant background words, parallax (slower than the scene camera) */}
      {BG_WORD.map((wd, k) => {
        const o = op(k) * 0.06;
        if (o <= 0.001) return null;
        return (
          <text key={k} x={540 - 120 * sceneU(t, k)} y={1060} textAnchor="middle" fill="none" stroke={T.white} strokeWidth={2} opacity={o} style={{ fontFamily: F.hit, fontSize: wd.length > 5 ? 230 : 420 }}>
            {wd}
          </text>
        );
      })}

      {/* ===== S0 hook ===== */}
      {op(0) > 0.001 && (
        <g opacity={op(0)} transform={camStr(cam0)}>
          <ellipse cx={540} cy={800} rx={500} ry={420} fill="url(#spot)" />
          <g opacity={scaleIn}>
            <line x1={540} x2={540} y1={700} y2={1150} stroke={T.grey} strokeWidth={9} strokeLinecap="round" />
            <path d="M430,1160 L650,1160 L600,1115 L480,1115 Z" fill={T.grey} />
            <g transform={`rotate(${-tilt} 540 700)`}>
              <line x1={200} x2={880} y1={700} y2={700} stroke={T.white} strokeWidth={9} strokeLinecap="round" />
              <circle cx={540} cy={700} r={16} fill={T.white} />
              <g transform={`rotate(${tilt} 200 700)`}>
                <line x1={200} x2={130} y1={700} y2={880} stroke={T.grey} strokeWidth={3} />
                <line x1={200} x2={270} y1={700} y2={880} stroke={T.grey} strokeWidth={3} />
                <path d="M100,880 Q200,940 300,880 Z" fill={T.grey} />
              </g>
              <g transform={`rotate(${tilt} 880 700)`}>
                <line x1={880} x2={810} y1={700} y2={880} stroke={T.grey} strokeWidth={3} />
                <line x1={880} x2={950} y1={700} y2={880} stroke={T.grey} strokeWidth={3} />
                <path d="M780,880 Q880,940 980,880 Z" fill={T.grey} />
                <Coin x={880} y={lerp(-200, 808, usdDrop)} r={64} kind="usd" op={P(t, 1.25, 0.15)} />
              </g>
            </g>
          </g>
          {/* the dinar coin: slams in at frame 0, then flies on an arc into the left pan */}
          <circle cx={540} cy={760} r={lerp(80, 520, slamIn) * (1 - fly)} fill="none" stroke={T.red} strokeWidth={6} opacity={(1 - slamIn) * 0.9 + 0.001} />
          <Coin x={coin0[0]} y={coin0[1]} r={coinR} kind="tnd" />
          {slam > 0.001 && (
            <g transform={`translate(540,470) scale(${lerp(1.7, 1, slam)})`} opacity={slam}>
              <text x={0} y={0} textAnchor="middle" fill={T.red} style={{ fontFamily: F.hit, fontSize: 240, filter: `drop-shadow(0 0 34px ${T.red})` }}>
                ×2.48
              </text>
            </g>
          )}
        </g>
      )}

      {/* ===== S1 1975 ===== */}
      {op(1) > 0.001 && (
        <g opacity={op(1)} transform={camStr(cam1)}>
          <text x={540} y={600} textAnchor="middle" fill={T.white} style={{ fontFamily: F.num, fontSize: 360 }} opacity={1 - 0.65 * eq1}>
            {yearShown}
          </text>
          {rewind < 1 && <Mono x={540} y={670} text="◀◀ REWIND" color={T.red} s={26} op={1 - rewind} />}
          {eq1 > 0.001 && (
            <g opacity={eq1 * (1 - flip)}>
              <Coin x={290} y={900} r={130} kind="usd" label="1 USD" />
              <text x={540} y={940} textAnchor="middle" fill={T.grey} style={{ fontFamily: F.hit, fontSize: 130 }}>=</text>
              <Coin x={790} y={900} r={130 * Math.sqrt(0.402)} kind="tnd" label="0.40 TND" />
            </g>
          )}
          {flip > 0.001 && (
            <g opacity={flip}>
              <Coin x={790} y={860} r={140} kind="tnd" label="1 TND" />
              <text x={590} y={900} textAnchor="middle" fill={T.grey} style={{ fontFamily: F.hit, fontSize: 110 }}>≈</text>
              {[0, 1, 2].map((i) => (
                <g key={i} opacity={P(t, c(8) + 0.2 + i * 0.35, 0.4, E.o)} transform={`translate(0,${(1 - P(t, c(8) + 0.2 + i * 0.35, 0.4, E.back)) * -120})`} clipPath={i === 2 ? "url(#halfCoin)" : undefined}>
                  <Coin x={360} y={924 - i * 80} r={92} kind="usd" />
                </g>
              ))}
              <text x={360} y={1130} textAnchor="middle" fill={T.steel} style={{ fontFamily: F.num, fontSize: 100 }}>2.48 $</text>
            </g>
          )}
        </g>
      )}

      {/* ===== the chart (S2, S5, S11) ===== */}
      {chartOp > 0.001 && (
        <g transform={camStr(chartCam(t))}>
          <Chart t={t} op={chartOp} drawTo={drawTo} band={band} futures={futures} titleOp={clamp(1 - (chartCam(t).s - 1.03) * 6)} />
          {op(2) > 0.001 && P(t, c(16), 0.5) > 0.001 && (
            <g opacity={op(2) * P(t, c(16), 0.5, E.o)}>
              <line x1={cx(Y1) - 130} x2={cx(Y1)} y1={cy(3.35)} y2={cy(3.35)} stroke={T.euro} strokeWidth={4} strokeDasharray="10 8" />
              <circle cx={cx(Y1)} cy={cy(3.35)} r={9} fill={T.euro} />
              <text x={cx(Y1) - 150} y={cy(3.35) + 22} textAnchor="end" fill={T.euro} style={{ fontFamily: F.num, fontSize: 62 }}>
                € 3.35
              </text>
            </g>
          )}
        </g>
      )}

      {/* ===== S3 warning ===== */}
      {op(3) > 0.001 && (
        <g opacity={op(3)} transform={camStr(sceneCam(t, 3))}>
          <g transform={`translate(540,560) scale(${lerp(0.5, 1.25, warn)})`} opacity={warn}>
            <path d="M0,-110 L120,100 L-120,100 Z" fill="none" stroke={T.amber} strokeWidth={10} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 18px ${T.amber})` }} />
            <text x={0} y={70} textAnchor="middle" fill={T.amber} style={{ fontFamily: F.hit, fontSize: 130 }}>!</text>
          </g>
          <g opacity={neq} transform={`translate(0,${(1 - neq) * 30})`}>
            <Txt x={810} y={960} s={66} w={900}>قوة العملة</Txt>
            <line x1={495} x2={585} y1={920} y2={920} stroke={T.amber} strokeWidth={16} strokeLinecap="round" />
            <line x1={495} x2={585} y1={965} y2={965} stroke={T.amber} strokeWidth={16} strokeLinecap="round" />
            <line x1={512} y1={1005} x2={568} y2={880} stroke={T.amber} strokeWidth={14} strokeLinecap="round" />
            <Txt x={270} y={960} s={66} w={900}>قوة الاقتصاد</Txt>
            <Mono x={540} y={1080} text="EXCHANGE RATE  ≠  ECONOMIC SIZE" color={T.grey} s={22} />
          </g>
        </g>
      )}

      {/* ===== S4 1958: 1000 francs = 1 dinar ===== */}
      {op(4) > 0.001 && (
        <g opacity={op(4)} transform={camStr(cam4)}>
          <text x={540} y={520} textAnchor="middle" fill={T.white} style={{ fontFamily: F.num, fontSize: 260 }} opacity={P(t, c(20) + 0.6, 0.5)}>
            1958
          </text>
          {Array.from({ length: 100 }, (_, i) => {
            const col = i % 10, row = Math.floor(i / 10);
            const x0 = 270 + col * 60, y0 = 640 + row * 42;
            const u = P(collapse, (i / 100) * 0.5, 0.5, E.io);
            const x = lerp(x0, 540, u), y = lerp(y0, 880, u);
            return <rect key={i} x={x - 24} y={y - 15} width={48} height={30} rx={3} fill="none" stroke={T.steel} strokeWidth={1.6} opacity={P(notesIn, (i / 100) * 0.7, 0.3) * (1 - u)} />;
          })}
          <Mono x={540} y={1110} text="1000 FRANCS" color={T.steel} s={26} op={notesIn * (1 - collapse)} />
          <Coin x={540} y={880} r={lerp(20, 160, collapse)} kind="tnd" op={collapse} label={collapse > 0.8 ? "1 DINAR" : undefined} />
        </g>
      )}

      {/* ===== S6 why? ===== */}
      {op(6) > 0.001 && (
        <g opacity={op(6)} transform={camStr(cam6)}>
          <text x={540} y={760} textAnchor="middle" fill={T.red} transform={`translate(540,640) scale(${lerp(0.4, 1, q)}) translate(-540,-640)`} style={{ fontFamily: F.hit, fontSize: 440, filter: `drop-shadow(0 0 34px ${T.red})` }} opacity={q * (1 - 0.6 * tiles)}>
            ؟
          </text>
          {[0, 1, 2].map((i) => (
            <g key={i} opacity={P(tiles, i * 0.2, 0.5, E.o)} transform={`translate(${(1 - P(tiles, i * 0.2, 0.5, E.o)) * 80},0)`}>
              <rect x={150} y={880 + i * 140} width={780} height={116} rx={16} fill={T.panel} stroke={i === 0 ? T.red : T.dim} strokeWidth={2.5} />
              <text x={230} y={962 + i * 140} textAnchor="middle" fill={T.red} style={{ fontFamily: F.num, fontSize: 80 }}>{`0${i + 1}`}</text>
              <Txt x={890} y={958 + i * 140} s={46} w={800} anchor="end">{["التضخّم", "العجز التجاري", "تباطؤ الاقتصاد"][i]}</Txt>
            </g>
          ))}
        </g>
      )}

      {/* ===== S7 inflation ===== */}
      {op(7) > 0.001 && (
        <g opacity={op(7)} transform={camStr(sceneCam(t, 7))}>
          <Mono x={540} y={330} text="01 · INFLATION" color={T.red} s={28} />
          <Txt x={540} y={400} s={32} w={600} color={T.grey} op={prices}>الأسعار (رسم توضيحي)</Txt>
          {[
            { lab: "تونس", h: 640, col: T.red, x: 360 },
            { lab: "أمريكا وأوروبا", h: 300, col: T.grey, x: 720 },
          ].map((b, i) => (
            <g key={i}>
              <rect x={b.x - 110} y={1180 - b.h * prices} width={220} height={b.h * prices} fill={b.col} opacity={0.88} rx={8} />
              <path d={`M${b.x},${1180 - b.h * prices - 84} l-32,42 l64,0 Z`} fill={b.col} opacity={prices} />
              <Txt x={b.x} y={1245} s={42} w={800} color={b.col === T.red ? T.white : T.grey}>{b.lab}</Txt>
            </g>
          ))}
          {/* price tags rising beside the Tunisian bar */}
          {Array.from({ length: 6 }, (_, i) => {
            const u = ((t * 0.45 + i / 6) % 1) * prices;
            return (
              <g key={i} opacity={Math.sin(Math.PI * u) * 0.85} transform={`translate(${210 - 30 * Math.sin(i)},${1150 - u * 640})`}>
                <path d="M0,0 L44,0 L60,16 L44,32 L0,32 Z" fill="none" stroke={T.amber} strokeWidth={2.5} />
                <circle cx={46} cy={16} r={3.5} fill={T.amber} />
              </g>
            );
          })}
          <g opacity={shrink}>
            <Coin x={860} y={600} r={lerp(96, 50, shrink)} kind="tnd" />
            {shrink > 0.5 && <path d="M838,556 L864,600 L846,634" fill="none" stroke={T.bg} strokeWidth={6} />}
          </g>
        </g>
      )}

      {/* ===== S8 trade deficit ===== */}
      {op(8) > 0.001 && (
        <g opacity={op(8)} transform={camStr(sceneCam(t, 8))}>
          <Mono x={540} y={330} text="02 · TRADE DEFICIT" color={T.red} s={28} />
          <rect x={340} y={560} width={400} height={300} rx={22} fill={T.panel} stroke={T.white} strokeWidth={3} />
          <Txt x={540} y={735} s={64} w={900}>تونس</Txt>
          <g opacity={imp}>
            <path d={`M60,660 L${lerp(60, 300, imp)},660`} stroke={T.red} strokeWidth={84} />
            <path d={`M${lerp(60, 300, imp)},590 l46,70 l-46,70 Z`} fill={T.red} />
            <path d={`M60,660 L300,660`} stroke={T.bg} strokeWidth={5} strokeDasharray="18 22" strokeDashoffset={-t * 120} opacity={imp} />
            <Txt x={170} y={570} s={40} w={800} color={T.red}>واردات</Txt>
          </g>
          <g opacity={exp}>
            <path d={`M760,780 L${lerp(760, 990, exp)},780`} stroke={T.grey} strokeWidth={28} />
            <path d={`M${lerp(760, 990, exp)},754 l28,26 l-28,26 Z`} fill={T.grey} />
            <Txt x={890} y={870} s={40} w={800} color={T.grey}>صادرات</Txt>
          </g>
          <g opacity={P(t, c(33) - 0.3, 0.5)}>
            <Txt x={540} y={950} s={34} w={800} color={T.steel}>العملة الصعبة</Txt>
            <rect x={400} y={975} width={280} height={280} rx={14} fill="none" stroke={T.steel} strokeWidth={3} />
            {/* liquid with a moving surface */}
            <path
              d={`M406,${981 + 268 * reserve * 0.75} ${Array.from({ length: 15 }, (_, i) => `L${406 + i * 19},${981 + 268 * reserve * 0.75 + 6 * Math.sin(i * 0.9 + t * 4)}`).join(" ")} L674,1249 L406,1249 Z`}
              fill={T.steel}
              opacity={0.28}
            />
            {[0, 1, 2, 3, 4].map((i) => {
              const u = ((t * 0.9 + i / 5) % 1) * reserve;
              return <Coin key={i} x={540 + (i % 2 ? 46 : -46)} y={1280 + u * 120} r={24} kind={i % 2 ? "eur" : "usd"} op={Math.sin(Math.PI * u)} />;
            })}
          </g>
        </g>
      )}

      {/* ===== S9 slowdown, flexible rate, IMF ===== */}
      {op(9) > 0.001 && (
        <g opacity={op(9)} transform={camStr(sceneCam(t, 9))}>
          <Mono x={540} y={330} text="03 · SLOWDOWN" color={T.red} s={28} />
          <Txt x={540} y={410} s={32} w={600} color={T.grey}>النمو الاقتصادي (رسم توضيحي)</Txt>
          <line x1={110} x2={970} y1={820} y2={820} stroke={T.dim} strokeWidth={2} />
          <Line d="M110,800 C250,750 340,670 460,620" u={P(t, c(34) - 0.2, 0.8)} color={T.white} w={7} />
          <Line d="M460,620 C580,660 720,740 970,770" u={growth} color={T.red} w={7} glow />
          <line x1={460} x2={460} y1={570} y2={840} stroke={T.red} strokeDasharray="5 7" strokeWidth={2.5} opacity={growth} />
          <Mono x={460} y={876} text="2011" color={T.red} s={24} op={growth} />
          <g opacity={flex}>
            <Txt x={540} y={985} s={42} w={800} color={T.white}>سعر الصرف</Txt>
            <path
              d={Array.from({ length: 56 }, (_, i) => {
                const x = 130 + i * 15;
                const y = 1075 + flex * (Math.sin(i * 0.7 + t * 2) * 30 + i * 1.7);
                return `${i ? "L" : "M"}${x},${y.toFixed(1)}`;
              }).join(" ")}
              fill="none"
              stroke={T.amber}
              strokeWidth={6}
              style={{ filter: `drop-shadow(0 0 8px ${T.amber})` }}
            />
            <Mono x={540} y={1225} text={flex > 0.5 ? "FIXED → FLEXIBLE" : "FIXED"} color={T.amber} s={22} />
          </g>
          <g opacity={imf} transform={`translate(540,1310) scale(${lerp(0.8, 1, imf)})`}>
            <rect x={-300} y={-46} width={600} height={100} rx={14} fill={T.panel} stroke={T.steel} strokeWidth={2.5} />
            <Txt x={0} y={20} s={38} w={800} color={T.steel}>صندوق النقد الدولي · IMF</Txt>
          </g>
        </g>
      )}

      {/* ===== S10 the citizen ===== */}
      {op(10) > 0.001 && (
        <g opacity={op(10)} transform={camStr(sceneCam(t, 10))}>
          <ellipse cx={540} cy={820} rx={330} ry={420} fill="url(#spot)" />
          <ellipse cx={540} cy={1150} rx={460} ry={60} fill={T.red} opacity={0.1} />
          <g transform="translate(540,1150) scale(1.25) translate(-540,-1060)">
            <g fill={T.white} opacity={0.94}>
              <circle cx={470} cy={640} r={58} />
              <path d="M390,1060 L390,780 Q470,710 550,780 L550,1060 Z" />
            </g>
            {/* red rim light */}
            <path d="M550,1060 L550,780 Q520,752 490,744" fill="none" stroke={T.red} strokeWidth={6} opacity={0.8} />
            <g fill={T.white} opacity={child * 0.94}>
              <circle cx={660} cy={820} r={40} />
              <path d="M612,1060 L612,900 Q660,860 708,900 L708,1060 Z" />
              <path d="M550,900 Q585,920 615,920" stroke={T.white} strokeWidth={14} fill="none" strokeLinecap="round" />
            </g>
            {Array.from({ length: 8 }, (_, i) => {
              const u = clamp(fall * 1.6 - i * 0.09);
              const yy = 900 + Math.min(u * 1.3, 1) * 150 - (u > 0.77 ? Math.sin(((u - 0.77) / 0.23) * Math.PI) * 26 : 0);
              return u > 0 && u < 1 ? <Coin key={i} x={360 + hash(i, 1) * 40 - u * 40} y={yy} r={18} kind="tnd" op={1 - u * 0.7} /> : null;
            })}
            <g transform={`translate(270,1000) scale(${lerp(1, 0.5, basket)})`} opacity={P(t, c(38), 0.5)}>
              <path d="M-80,-40 L80,-40 L60,40 L-60,40 Z" fill="none" stroke={T.amber} strokeWidth={6} strokeLinejoin="round" />
              <path d="M-50,-40 Q0,-110 50,-40" fill="none" stroke={T.amber} strokeWidth={6} />
            </g>
          </g>
          <Txt x={250} y={1240} s={36} w={800} color={T.amber} op={P(t, c(38) + 0.3, 0.5)}>القدرة الشرائية</Txt>
          <Txt x={740} y={1240} s={36} w={800} color={T.white} op={child}>المستقبل</Txt>
        </g>
      )}

      {/* ===== S12 the flag ===== */}
      {op(12) > 0.001 && (
        <g opacity={op(12)} transform={camStr(sceneCam(t, 12))}>
          <ellipse cx={540} cy={780} rx={520} ry={420} fill="url(#spot)" opacity={flagU} />
          <Coin x={540} y={780} r={lerp(170, 0, flagU)} kind="tnd" op={1 - flagU} />
          {flagU > 0.001 && (
            <g opacity={flagU} transform={`translate(540,780) scale(${lerp(0.4, 1.15, flagU)}) rotate(${lerp(-6, 0, flagU)})`}>
              <rect x={-300} y={-200} width={600} height={400} fill={T.red} rx={6} style={{ filter: "drop-shadow(0 24px 48px rgba(0,0,0,.65))" }} />
              <circle cx={0} cy={0} r={100} fill={T.white} />
              <circle cx={0} cy={0} r={75} fill={T.red} />
              <circle cx={19} cy={0} r={60} fill={T.white} />
              <path
                d={
                  Array.from({ length: 10 }, (_, i) => {
                    const a = -Math.PI / 2 + (i * Math.PI) / 5 - Math.PI / 2;
                    const r = i % 2 ? 18 : 45;
                    return `${i ? "L" : "M"}${(20 + r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
                  }).join(" ") + " Z"
                }
                fill={T.red}
              />
              {/* light sweep across the flag */}
              <rect x={-300} y={-200} width={600} height={400} fill="url(#sweep)" opacity={env(t, c(43) + 0.8, 0.4, c(43) + 1.8, 0.5)} />
            </g>
          )}
          <defs>
            <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0.3" gradientTransform={`translate(${lerp(-1, 1, P(t, c(43) + 0.8, 1.2, E.io))},0)`}>
              <stop offset="0.35" stopColor="#fff" stopOpacity={0} />
              <stop offset="0.5" stopColor="#fff" stopOpacity={0.35} />
              <stop offset="0.65" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <g opacity={P(t, END + 0.4, 0.8, E.o)} transform={`translate(0,${(1 - P(t, END + 0.4, 0.8, E.o)) * 24})`}>
            <Txt x={540} y={1150} s={78} w={900}>قصة الدينار التونسي</Txt>
            <Mono x={540} y={1215} text="1958 — 2026 · USD/TND 0.40 → 3.04" color={T.grey} s={24} />
          </g>
        </g>
      )}
    </svg>
  );
};

// ---------- screen-space overlays that must not move with the camera ----------
const Overlays: React.FC<{ t: number }> = ({ t }) => {
  const s5 = sceneOp(t, 5);
  const drain = P(t, c(25) - 0.2, 2.0, E.io);
  const hit = P(t, c(25) + 1.3, 0.4, E.back);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {s5 > 0.001 && (
        <g opacity={s5 * P(t, c(25) - 0.4, 0.5)}>
          <Txt x={940} y={1300} s={32} w={800} anchor="end" color={T.grey}>
            قيمة الدينار بالدولار
          </Txt>
          <text x={140} y={1302} fill={T.white} style={{ fontFamily: F.num, fontSize: 56 }}>
            {`${lerp(0.71, 0.32, drain).toFixed(2)} $`}
          </text>
          <rect x={140} y={1320} width={800} height={64} rx={12} fill="rgba(10,10,12,.7)" stroke={T.grey} strokeWidth={2} />
          <rect x={147} y={1327} width={786 * lerp(1, 0.322 / 0.71, drain)} height={50} rx={8} fill={T.red} />
          {hit > 0.001 && (
            <g transform={`translate(370,560) scale(${lerp(1.8, 1, hit)})`} opacity={hit}>
              <text x={0} y={0} textAnchor="middle" fill={T.red} style={{ fontFamily: F.hit, fontSize: 220, filter: `drop-shadow(0 0 30px ${T.red})` }}>
                −55%
              </text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

// ---------- captions: one chunk at a time, words pop as spoken, key words in a red pill ----------
const Captions: React.FC<{ t: number }> = ({ t }) => {
  const i = CH.findIndex((ch, k) => t >= ch.on - 0.12 && (k + 1 >= CH.length || t < CH[k + 1].on - 0.12));
  if (i < 0) return null;
  const ch = CH[i];
  const out = i + 1 < CH.length ? Math.min(CH[i + 1].on - 0.12, ch.off + 1.6) : ch.off + 2.2;
  const op = 1 - P(t, out - 0.25, 0.25);
  if (op <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 60, width: 960, top: 1450, textAlign: "center", direction: "rtl", opacity: op }}>
      <div style={{ fontFamily: F.ar, fontWeight: 800, fontSize: 66, lineHeight: 1.45, color: T.white }}>
        {ch.words.map((w, j) => {
          const u = P(t, w.on - 0.06, 0.22, E.back);
          const key = w.k === "r";
          return (
            <React.Fragment key={j}>
              <span
                style={{
                  display: "inline-block",
                  opacity: lerp(0.16, 1, clamp(u)),
                  transform: `translateY(${(1 - u) * 18}px) scale(${lerp(0.9, 1, u)})`,
                  background: key ? `rgba(231,0,19,${(0.95 * P(t, w.on, 0.25, E.o)).toFixed(2)})` : undefined,
                  borderRadius: 12,
                  padding: key ? "0 .22em" : undefined,
                  textShadow: "0 4px 18px rgba(0,0,0,.75)",
                  direction: /[0-9]/.test(w.t) && !/[\u0600-\u06FF]/.test(w.t) ? "ltr" : "rtl",
                  unicodeBidi: "isolate",
                }}
              >
                {w.t}
              </span>{" "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ---------- persistent chrome: label, live ticker, progress ----------
const Chrome: React.FC<{ t: number }> = ({ t }) => {
  const op = P(t, 0.2, 0.6) * (1 - P(t, D.total - 1.2, 0.8));
  let yr = Y1;
  if (t < c(9)) yr = t < c(4) ? Y1 : 1975;
  else if (t < c(24) || t >= c(40)) yr = drawToAt(t);
  const v = rateAt(yr);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <div style={{ position: "absolute", right: 60, top: 92, display: "flex", direction: "rtl", fontFamily: F.ar, fontWeight: 800, fontSize: 30 }}>
        <span style={{ background: T.red, color: T.white, padding: "6px 18px" }}>اقتصاد</span>
        <span style={{ background: T.white, color: T.bg, padding: "6px 18px" }}>تونس</span>
      </div>
      <div style={{ position: "absolute", left: 60, top: 96, fontFamily: F.mono, fontSize: 26, color: T.white, letterSpacing: ".08em" }}>
        USD/TND <span style={{ color: T.red }}>{v.toFixed(3)}</span>
        <span style={{ color: T.grey, fontSize: 20 }}> · {Math.floor(yr)}</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 152, height: 3, background: "rgba(255,255,255,.12)" }}>
        <div style={{ width: `${(100 * clamp(t / D.total)).toFixed(2)}%`, height: 3, background: T.red }} />
      </div>
    </div>
  );
};

/** signature red wipe on the 'slab' seams: covers the whole frame at the cut, leading white edge */
const Wipes: React.FC<{ t: number }> = ({ t }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {SB.map((s, k) => {
      if (!k || SEAM[k] !== "slab") return null;
      const u = P(t, s - 0.3, 0.62, E.io);
      if (u <= 0 || u >= 1) return null;
      const x = lerp(1250, -2700, u);
      return (
        <g key={k}>
          <path d={`M${x},0 L${x + 1500},0 L${x + 1100},1920 L${x - 400},1920 Z`} fill={T.red} />
          <path d={`M${x},0 L${x - 400},1920`} stroke="#fff" strokeWidth={10} opacity={0.9} />
          <path d={`M${x + 1500},0 L${x + 1100},1920`} stroke={T.redDeep} strokeWidth={40} />
        </g>
      );
    })}
  </svg>
);

// ---------- sound design (no music: voice + SFX + a very low dark bed) ----------
const SFX: [number, string, number][] = [
  [0.02, "boom_sub_02", 0.55],
  [0.02, "hit_trailer_01", 0.3],
  [0.78, "whoosh_fast_02", 0.25],
  [1.3, "pop_drop_04", 0.35],
  [c(3) - 4.6, "riser_dark_03", 0.32],
  [c(3) + 0.2, "boom_sub_02", 0.55],
  [c(3) + 0.2, "hit_trailer_01", 0.35],
  [c(4) - 0.1, "counter_roll_01", 0.3],
  [c(6) - 0.1, "hit_soft_01", 0.35],
  [c(8) + 0.2, "pop_drop_04", 0.3],
  [c(8) + 0.55, "pop_drop_04", 0.28],
  [c(8) + 0.9, "pop_drop_04", 0.26],
  [c(9) + 0.2, "scan_hud_01", 0.22],
  [c(11), "beep_data_03", 0.22],
  [c(13), "beep_data_03", 0.22],
  [c(14) + 0.4, "riser_tonal_02", 0.3],
  [c(15) + 0.9, "boom_sub_02", 0.5],
  [c(15) + 0.9, "whoosh_long_04", 0.25],
  [c(16), "tick_01", 0.35],
  [c(17) - 0.1, "downlifter_01", 0.32],
  [c(18) + 0.3, "thud_soft_01", 0.35],
  [c(20) + 0.5, "hit_soft_01", 0.35],
  [c(22) - 0.2, "whoosh_soft_01", 0.35],
  [c(22) + 1.0, "thud_soft_01", 0.45],
  [c(25) + 1.3, "boom_cinematic_01", 0.42],
  [c(25) + 1.3, "glitch_digital_01", 0.2],
  [c(27) - 0.1, "whoosh_long_04", 0.3],
  [c(28), "swish_01", 0.3],
  [c(28) + 0.2, "swish_02", 0.3],
  [c(28) + 0.4, "swish_03", 0.3],
  [c(36) + 0.2, "typewriter_key_01", 0.3],
  [c(37), "heartbeat_slow_loop", 0.25],
  [c(42) - 0.5, "swell_reveal_01", 0.35],
  [c(43) - 0.2, "boom_cinematic_01", 0.3],
  // seams: zoom-through (reverse whoosh into the cut + soft hit on arrival), whip, red wipe
  ...SB.flatMap((s, k): [number, string, number][] => {
    if (!k) return [];
    const m = SEAM[k];
    if (m === "zoom") return [[s - 1.75, "whoosh_reverse_05", 0.3], [s, "hit_soft_01", 0.3]];
    if (m === "whip") return [[s - 0.32, "whoosh_fast_02", 0.32]];
    return [[s - 0.34, "swish_04", 0.32], [s - 0.1, "whoosh_soft_01", 0.25]];
  }),
];

export const DinarStory: React.FC = () => {
  const ready = useTnFonts();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (!ready) return null;
  const shake = (at: number, amp = 10) => {
    const a = t - at;
    return a > 0 && a < 0.5 ? (1 - a / 0.5) * amp : 0;
  };
  const sh = shake(0.02, 12) + shake(c(3) + 0.2) + shake(c(25) + 1.3) + shake(c(15) + 0.9, 7);
  const gf = Math.floor(t * 30); // grain changes 30×/s whatever the render fps
  const leak = Math.max(env(t, 0, 0.05, 0.4, 0.6), env(t, c(3), 0.2, c(3) + 1.0, 0.8), env(t, c(15) + 0.8, 0.2, c(15) + 1.8, 0.8), env(t, c(25) + 1.2, 0.2, c(25) + 2.2, 0.8));
  // red flash at zoom-through cuts
  const zf = Math.max(0, ...SB.map((s, k) => (k && SEAM[k] === "zoom" ? env(t, s - 0.1, 0.08, s + 0.02, 0.16) : 0)));
  return (
    <AbsoluteFill style={{ background: T.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 42%, #1c1c22 0%, ${T.bg} 70%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 24 }, (_, i) => (
          <line key={`v${i}`} x1={(i * 60 + t * 6) % 1440 - 180} x2={(i * 60 + t * 6) % 1440 - 180} y1={0} y2={1920} stroke="#fff" strokeOpacity={0.025} />
        ))}
        {Array.from({ length: 34 }, (_, i) => (
          <line key={`h${i}`} x1={0} x2={1080} y1={i * 60} y2={i * 60} stroke="#fff" strokeOpacity={0.025} />
        ))}
        {/* drifting dust motes for depth */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = (hash(i, 7) * 1080 + t * (6 + hash(i, 8) * 14)) % 1080;
          const y = (hash(i, 9) * 1920 - t * (10 + hash(i, 10) * 20) + 1920 * 4) % 1920;
          return <circle key={i} cx={x} cy={y} r={1 + hash(i, 11) * 2.2} fill={i % 5 ? "#fff" : T.red} opacity={0.08 + hash(i, 12) * 0.18} />;
        })}
      </svg>
      <AbsoluteFill style={{ transform: `translate(${(hash(gf, 1) - 0.5) * sh}px, ${(hash(gf, 2) - 0.5) * sh}px)` }}>
        <Scene t={t} />
        <Overlays t={t} />
      </AbsoluteFill>
      {zf > 0.01 && <AbsoluteFill style={{ background: T.red, opacity: 0.55 * zf, mixBlendMode: "screen" }} />}
      {leak > 0.01 && <Img src={staticFile("tn-dinar/light_leak_red_04.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover", mixBlendMode: "screen", opacity: 0.35 * leak }} />}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,12,0) 69%, rgba(10,10,12,.88) 76%, rgba(10,10,12,.88) 90%, rgba(10,10,12,0) 100%)" }} />
      <Captions t={t} />
      <Chrome t={t} />
      <Wipes t={t} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.62) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.09, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <Img key={i} src={staticFile("tn-dinar/grain_tile_512.png")} style={{ position: "absolute", width: 512, height: 512, left: (i % 4) * 512 - Math.floor(hash(gf, 3) * 512), top: Math.floor(i / 4) * 512 - Math.floor(hash(gf, 4) * 512) }} />
        ))}
      </AbsoluteFill>
      <Sequence from={Math.round(D.off * fps)} layout="none">
        <Audio src={staticFile("tn-dinar/voice.mp3")} />
      </Sequence>
      <Audio src={staticFile("tn-dinar/sfx/drone_dark_space_loop.mp3")} loop volume={(fr) => 0.07 * P(fr / fps, 0, 2) * (1 - P(fr / fps, D.total - 2.5, 2.5))} />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * fps))} layout="none">
          <Audio src={staticFile(`tn-dinar/sfx/${name}.mp3`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
