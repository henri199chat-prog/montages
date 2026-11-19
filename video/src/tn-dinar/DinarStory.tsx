import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { E, P, env, hash, lerp, clamp } from "../religious/anim";
import { T, F, useTnFonts, USD_TND, rateAt } from "./theme";
import data from "./data/dinar.json";

/**
 * «قصة الدينار التونسي» — economic documentary reel (1080×1920, ~122 s). Voice: ElevenLabs «Jaleel / Celil – Arabic
 * Narrator» (eleven_v4), numbers read in dinars and millimes. Captions mapped from the spoken words to digits.
 * Data: World Bank official rate (PA.NUS.FCRF) 1975–2025 + Nov 2026 ≈ 3.04 (mid-market).
 * Scenes keyed to caption chunks c(i): hook (balance) → 1975 (rewind, coins) → the chart (1993 parity, 2011, today)
 * → warning (rate ≠ size of economy) → 1958 (1000 francs = 1 dinar) → the trend (2011–2022, −55%) → why? →
 * inflation → trade deficit → slowdown + flexible rate (IMF) → the citizen → the question → the flag.
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

// scene boundaries (start times)
const SB = [0, c(4), c(9), c(17), c(20), c(23), c(27), c(29), c(32), c(34), c(37), c(40), c(42)];
const sceneOp = (t: number, k: number) => env(t, (k ? SB[k] : 0) - 0.3, 0.45, k + 1 < SB.length ? SB[k + 1] - 0.3 : D.total - 0.6, 0.4);
const sceneU = (t: number, k: number) => clamp((t - SB[k]) / ((k + 1 < SB.length ? SB[k + 1] : D.total) - SB[k]));

// ---------- small drawing helpers ----------
const Txt: React.FC<{ x: number; y: number; s: number; children: React.ReactNode; color?: string; font?: string; w?: number; op?: number; anchor?: "middle" | "start" | "end"; ls?: string }> = ({
  x, y, s, children, color = T.white, font = F.ar, w = 800, op = 1, anchor = "middle", ls,
}) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor={anchor} fill={color} opacity={op} style={{ fontFamily: font, fontSize: s, fontWeight: w, letterSpacing: ls }} direction="rtl">
      {children}
    </text>
  );
const Mono: React.FC<{ x: number; y: number; text: string; op?: number; color?: string; s?: number; anchor?: "middle" | "start" | "end" }> = ({ x, y, text, op = 1, color = T.grey, s = 18, anchor = "middle" }) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor={anchor} fill={color} opacity={op} style={{ fontFamily: F.mono, fontSize: s, letterSpacing: ".18em" }}>
      {text}
    </text>
  );
const Line: React.FC<{ d: string; u: number; color?: string; w?: number; op?: number; dash?: string; glow?: boolean }> = ({ d, u, color = T.white, w = 3, op = 1, dash, glow }) =>
  u <= 0 || op <= 0.001 ? null : (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={op}
      pathLength={dash ? undefined : 1}
      strokeDasharray={dash ?? "1 1"}
      strokeDashoffset={dash ? 0 : 1 - u}
      style={glow ? { filter: `drop-shadow(0 0 10px ${color})` } : undefined}
    />
  );
/** a coin: dinar (red, «د.ت»), dollar (steel, $), euro (blue, €) */
const Coin: React.FC<{ x: number; y: number; r: number; kind: "tnd" | "usd" | "eur"; op?: number; label?: string }> = ({ x, y, r, kind, op = 1, label }) => {
  if (op <= 0.001 || r <= 0.5) return null;
  const col = kind === "tnd" ? T.red : kind === "usd" ? T.steel : T.euro;
  const sym = kind === "tnd" ? "د.ت" : kind === "usd" ? "$" : "€";
  return (
    <g opacity={op}>
      <circle cx={x} cy={y + r * 0.08} r={r} fill="#000" opacity={0.45} />
      <circle cx={x} cy={y} r={r} fill={kind === "tnd" ? T.redDeep : "#1d2229"} stroke={col} strokeWidth={Math.max(2, r * 0.07)} />
      <circle cx={x} cy={y} r={r * 0.8} fill="none" stroke={col} strokeWidth={Math.max(1, r * 0.025)} strokeDasharray={`${r * 0.05} ${r * 0.06}`} opacity={0.8} />
      <text x={x} y={y + (kind === "tnd" ? r * 0.28 : r * 0.36)} textAnchor="middle" fill={kind === "tnd" ? T.white : col} style={{ fontFamily: kind === "tnd" ? F.ar : F.hit, fontWeight: 900, fontSize: kind === "tnd" ? r * 0.78 : r * 1.05 }}>
        {sym}
      </text>
      {label && <Mono x={x} y={y + r + 34} text={label} color={col} s={Math.max(14, r * 0.22)} />}
    </g>
  );
};

// ---------- the chart (dinars per 1 US dollar) ----------
const CX0 = 120, CX1 = 960, CY0 = 1150, CY1 = 470, VMAX = 3.5, Y0 = 1975, Y1 = 2026.88;
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
const Chart: React.FC<{ t: number; op: number; drawTo: number; band: number; dimOld: number; futures: number }> = ({ t, op, drawTo, band, dimOld, futures }) => {
  if (op <= 0.001) return null;
  const pts = pathTo(drawTo);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = pts.length > 1 ? `${d} L${pts[pts.length - 1][0]},${CY0} L${pts[0][0]},${CY0} Z` : "";
  const head = pts[pts.length - 1] ?? [cx(Y0), cy(USD_TND[0][1])];
  const mark = (yr: number, v: number, label: string, col: string, show: number, up = true) =>
    show <= 0.001 ? null : (
      <g opacity={show}>
        <circle cx={cx(yr)} cy={cy(v)} r={9 + 14 * (1 - show)} fill="none" stroke={col} strokeWidth={2} opacity={1 - 0.5 * show} />
        <circle cx={cx(yr)} cy={cy(v)} r={8} fill={col} />
        <text x={cx(yr)} y={cy(v) + (up ? -26 : 52)} textAnchor="middle" fill={col} style={{ fontFamily: F.num, fontSize: 54 }}>
          {label}
        </text>
      </g>
    );
  return (
    <g opacity={op}>
      {/* grid + axis */}
      {[0.5, 1, 1.5, 2, 2.5, 3, 3.5].map((v) => (
        <g key={v}>
          <line x1={CX0} x2={CX1} y1={cy(v)} y2={cy(v)} stroke={T.white} strokeOpacity={v === 1 ? 0 : 0.07} strokeWidth={1} />
          <Mono x={CX0 - 14} y={cy(v) + 6} text={v.toFixed(1)} anchor="end" s={15} color={T.dim} />
        </g>
      ))}
      <line x1={CX0} x2={CX1} y1={CY0} y2={CY0} stroke={T.grey} strokeWidth={1.5} opacity={0.6} />
      {[1975, 1993, 2011, 2022].map((y) => (
        <Mono key={y} x={cx(y)} y={CY0 + 36} text={`${y}`} s={17} color={T.grey} />
      ))}
      <Mono x={cx(2026.88)} y={CY0 + 36} text="2026" s={17} color={T.red} />
      {/* parity line */}
      <line x1={CX0} x2={CX1} y1={cy(1)} y2={cy(1)} stroke={T.white} strokeOpacity={0.35} strokeDasharray="6 8" strokeWidth={1.5} />
      <Txt x={CX0 + 10} y={cy(1) - 12} s={24} w={700} anchor="start" color={T.grey}>
        التعادل
      </Txt>
      {/* 2011–2022 band */}
      {band > 0.001 && (
        <g opacity={band}>
          <rect x={cx(2011)} y={CY1 - 20} width={(cx(2022) - cx(2011)) * band} height={CY0 - CY1 + 20} fill={T.red} opacity={0.12} />
          <line x1={cx(2011)} x2={cx(2011)} y1={CY1 - 20} y2={CY0} stroke={T.red} strokeWidth={2} strokeDasharray="4 6" />
          <line x1={cx(2022)} x2={cx(2022)} y1={CY1 - 20} y2={CY0} stroke={T.red} strokeWidth={2} strokeDasharray="4 6" opacity={band} />
        </g>
      )}
      {/* area + line */}
      {area && <path d={area} fill="url(#areaG)" opacity={0.9} />}
      {d && <path d={d} fill="none" stroke={T.red} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${T.red})` }} opacity={lerp(1, 0.55, dimOld)} />}
      {pts.length > 0 && (
        <g>
          <circle cx={head[0]} cy={head[1]} r={14 + 4 * Math.sin(t * 6)} fill={T.red} opacity={0.35} />
          <circle cx={head[0]} cy={head[1]} r={7} fill={T.white} />
        </g>
      )}
      {mark(1975, 0.402, "0.40", T.white, P(drawTo, 1975.2, 1.5) * (drawTo >= 1975.2 ? 1 : 0), false)}
      {mark(1993, 1.004, "1.00", T.white, drawTo >= 1993 ? P(drawTo, 1993, 2) : 0)}
      {mark(2011, 1.408, "1.41", T.white, drawTo >= 2011 ? P(drawTo, 2011, 2) : 0)}
      {mark(2026.88, 3.04, "3.04", T.red, drawTo >= 2026.8 ? 1 : 0)}
      {/* the two possible futures (question scene) */}
      {futures > 0.001 && (
        <g opacity={futures}>
          <path d={`M${cx(2026.88)},${cy(3.04)} Q${cx(2026.88) + 40},${cy(2.9)} ${cx(2026.88) + 70},${cy(2.5)}`} fill="none" stroke={T.white} strokeWidth={4} strokeDasharray="10 10" />
          <path d={`M${cx(2026.88)},${cy(3.04)} Q${cx(2026.88) + 40},${cy(3.2)} ${cx(2026.88) + 70},${cy(3.45)}`} fill="none" stroke={T.red} strokeWidth={4} strokeDasharray="10 10" />
          <text x={cx(2026.88) + 64} y={cy(3.0)} textAnchor="middle" fill={T.white} style={{ fontFamily: F.hit, fontSize: 70 }}>
            ?
          </text>
        </g>
      )}
      <Txt x={CX1} y={CY1 - 70} s={34} w={800} anchor="end" color={T.white}>
        كم دينارًا يساوي الدولار؟
      </Txt>
      <Txt x={CX1} y={CY1 - 32} s={20} w={600} anchor="end" color={T.grey}>
        المصدر: البنك الدولي (المعدل السنوي) · 2026: سعر السوق
      </Txt>
    </g>
  );
};

// ---------- scenes ----------
const Scene: React.FC<{ t: number }> = ({ t }) => {
  // S0 hook — balance: the dinar weighs more than the dollar, ×2.48
  const s0 = sceneOp(t, 0);
  const tilt = lerp(0, 14, P(t, cw(2, 1) - 0.1, 1.0, E.back)); // «أقوى»
  const slam = P(t, c(3) + 0.2, 0.35, E.back);
  // S1 1975 — rewind, then coins
  const s1 = sceneOp(t, 1);
  const rewind = P(t, c(4) - 0.2, 1.6, E.o);
  const yearShown = Math.round(lerp(2026, 1975, rewind));
  const eq1 = P(t, c(6) - 0.1, 0.6, E.o);
  const flip = P(t, c(8) - 0.1, 0.8, E.io);
  // chart (S2, S5, S11)
  const s2 = sceneOp(t, 2), s5 = sceneOp(t, 5), s11 = sceneOp(t, 11);
  const chartOp = Math.max(s2, s5, s11);
  let drawTo = 1975;
  drawTo = lerp(drawTo, 1993, P(t, c(9), c(10) - c(9) + 0.6, E.io));
  drawTo = lerp(drawTo, 2011, P(t, c(12), c(13) - c(12), E.io));
  drawTo = lerp(drawTo, 2026.88, P(t, c(14) + 0.4, c(15) - c(14) + 0.6, E.i));
  const band = P(t, c(24) - 0.2, 1.4, E.io) * (1 - P(t, SB[6] - 0.4, 0.4));
  const futures = P(t, c(40) + 0.3, 1.2, E.o);
  // S3 warning
  const s3 = sceneOp(t, 3);
  const warn = P(t, c(17) - 0.1, 0.6, E.back);
  const neq = P(t, c(18) + 0.3, 0.8, E.o);
  // S4 1958 — 1000 francs collapse into one dinar
  const s4 = sceneOp(t, 4);
  const notesIn = P(t, c(20) + 0.6, 1.4, E.o);
  const collapse = P(t, c(22) - 0.2, 1.4, E.io);
  // S5 trend — value of 1 dinar in dollars drains 0.71 → 0.32 (−55%)
  const drain = P(t, c(25) - 0.2, 2.0, E.io);
  // S6 why
  const s6 = sceneOp(t, 6);
  const q = P(t, c(27) - 0.15, 0.6, E.back);
  const tiles = P(t, c(28) - 0.1, 0.9, E.o);
  // S7 inflation
  const s7 = sceneOp(t, 7);
  const prices = P(t, cw(29, 1) - 0.1, 2.6, E.io);
  const shrink = P(t, c(31) - 0.1, 1.2, E.io);
  // S8 trade deficit
  const s8 = sceneOp(t, 8);
  const imp = P(t, cw(32, 1) - 0.2, 1.0, E.o);
  const exp = P(t, cw(32, 3) - 0.2, 1.0, E.o);
  const reserve = P(t, c(33) - 0.1, 2.0, E.io);
  // S9 slowdown + flexible rate + IMF
  const s9 = sceneOp(t, 9);
  const growth = P(t, cw(34, 3) - 0.6, 1.6, E.io);
  const flex = P(t, c(35) - 0.1, 1.4, E.io);
  const imf = P(t, c(36) + 0.2, 0.8, E.back);
  // S10 the citizen
  const s10 = sceneOp(t, 10);
  const fall = P(t, c(37) + 0.2, 2.4);
  const basket = P(t, c(38) + 0.4, 1.6, E.io);
  const child = P(t, c(39) - 0.1, 1.0, E.o);
  // S12 flag
  const s12 = sceneOp(t, 12);
  const flagU = P(t, c(43) - 0.3, 1.4, E.io);

  // global slow push-in per scene
  const k = SB.findIndex((s, i) => t >= s && (i + 1 >= SB.length || t < SB[i + 1]));
  const push = 1 + 0.045 * E.s(sceneU(t, Math.max(0, k)));

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T.red} stopOpacity={0.35} />
          <stop offset="1" stopColor={T.red} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="spot">
          <stop offset="0" stopColor={T.red} stopOpacity={0.28} />
          <stop offset="1" stopColor={T.red} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g transform={`translate(540,800) scale(${push}) translate(-540,-800)`}>
        {/* ===== S0 hook: the balance ===== */}
        {s0 > 0.001 && (
          <g opacity={s0}>
            <ellipse cx={540} cy={760} rx={460} ry={360} fill="url(#spot)" opacity={0.8} />
            <line x1={540} x2={540} y1={640} y2={1090} stroke={T.grey} strokeWidth={8} strokeLinecap="round" />
            <path d="M440,1100 L640,1100 L590,1060 L490,1060 Z" fill={T.grey} />
            <g transform={`rotate(${-tilt} 540 640)`}>
              <line x1={250} x2={830} y1={640} y2={640} stroke={T.white} strokeWidth={8} strokeLinecap="round" />
              <circle cx={540} cy={640} r={14} fill={T.white} />
              {/* left: dinar (heavier) — right: dollar */}
              <g transform={`rotate(${tilt} 250 640)`}>
                <line x1={250} x2={190} y1={640} y2={800} stroke={T.grey} strokeWidth={3} />
                <line x1={250} x2={310} y1={640} y2={800} stroke={T.grey} strokeWidth={3} />
                <path d="M160,800 Q250,850 340,800 Z" fill={T.grey} />
                <Coin x={250} y={735} r={68} kind="tnd" op={P(t, 0.9, 0.6)} />
              </g>
              <g transform={`rotate(${tilt} 830 640)`}>
                <line x1={830} x2={770} y1={640} y2={800} stroke={T.grey} strokeWidth={3} />
                <line x1={830} x2={890} y1={640} y2={800} stroke={T.grey} strokeWidth={3} />
                <path d="M740,800 Q830,850 920,800 Z" fill={T.grey} />
                <Coin x={830} y={745} r={56} kind="usd" op={P(t, 1.4, 0.6)} />
              </g>
            </g>
            {slam > 0.001 && (
              <g transform={`translate(540,420) scale(${lerp(1.6, 1, slam)})`} opacity={slam}>
                <text x={0} y={0} textAnchor="middle" fill={T.red} style={{ fontFamily: F.hit, fontSize: 190, filter: `drop-shadow(0 0 30px ${T.red})` }}>
                  ×2.48
                </text>
              </g>
            )}
            <Mono x={540} y={480} text="1 TND  vs  1 USD · 1975" op={P(t, 1.2, 0.6) * (1 - slam)} color={T.grey} s={20} />
          </g>
        )}

        {/* ===== S1 1975: rewind, then the coins ===== */}
        {s1 > 0.001 && (
          <g opacity={s1}>
            <text x={540} y={560} textAnchor="middle" fill={T.white} style={{ fontFamily: F.num, fontSize: 300, letterSpacing: "0.02em" }} opacity={1 - 0.6 * eq1}>
              {yearShown}
            </text>
            {rewind < 1 && <Mono x={540} y={620} text="◀◀ REWIND" color={T.red} s={22} op={1 - rewind} />}
            {/* $1 = 0.40 TND */}
            {eq1 > 0.001 && (
              <g opacity={eq1 * (1 - flip)}>
                <Coin x={300} y={860} r={110} kind="usd" label="1 USD" />
                <text x={540} y={895} textAnchor="middle" fill={T.grey} style={{ fontFamily: F.hit, fontSize: 110 }}>=</text>
                <Coin x={780} y={860} r={110 * Math.sqrt(0.402)} kind="tnd" label="0.40 TND" />
              </g>
            )}
            {/* 1 TND ≈ 2.48 USD: one dinar next to a stack of 2½ dollars */}
            {flip > 0.001 && (
              <g opacity={flip}>
                <Coin x={790} y={860} r={120} kind="tnd" label="1 TND" />
                <text x={600} y={895} textAnchor="middle" fill={T.grey} style={{ fontFamily: F.hit, fontSize: 100 }}>≈</text>
                <defs>
                  <clipPath id="halfCoin">
                    <rect x={0} y={0} width={1080} height={900 - 140 + 4} />
                  </clipPath>
                </defs>
                {/* two whole dollars and (almost) a half: 2.48 */}
                {[0, 1, 2].map((i) => (
                  <g key={i} opacity={P(t, c(8) + 0.2 + i * 0.35, 0.4, E.o)} clipPath={i === 2 ? "url(#halfCoin)" : undefined}>
                    <Coin x={380} y={900 - i * 70} r={80} kind="usd" />
                  </g>
                ))}
                <text x={360} y={1090} textAnchor="middle" fill={T.steel} style={{ fontFamily: F.num, fontSize: 90 }}>2.48 $</text>
              </g>
            )}
          </g>
        )}

        {/* ===== the chart (S2, S5, S11) ===== */}
        <Chart t={t} op={chartOp * (1 - 0.75 * Math.max(s3, 0))} drawTo={drawTo} band={band} dimOld={band} futures={futures} />
        {s2 > 0.001 && (
          <g opacity={s2}>
            {/* euro today */}
            {P(t, c(16), 0.5) > 0.001 && (
              <g opacity={P(t, c(16), 0.5, E.o)}>
                <line x1={cx(2026.88) - 120} x2={cx(2026.88)} y1={cy(3.35)} y2={cy(3.35)} stroke={T.euro} strokeWidth={3} strokeDasharray="8 6" />
                <circle cx={cx(2026.88)} cy={cy(3.35)} r={8} fill={T.euro} />
                <text x={cx(2026.88) - 140} y={cy(3.35) + 18} textAnchor="end" fill={T.euro} style={{ fontFamily: F.num, fontSize: 52 }}>
                  € 3.35
                </text>
              </g>
            )}
          </g>
        )}
        {/* S5: the value of 1 dinar in dollars drains */}
        {s5 > 0.001 && band > 0.01 && (
          <g opacity={s5 * P(t, c(25) - 0.4, 0.5)}>
            <rect x={160} y={1260} width={760} height={58} rx={10} fill="none" stroke={T.grey} strokeWidth={2} />
            <rect x={166} y={1266} width={748 * lerp(1, 0.322 / 0.71, drain)} height={46} rx={7} fill={T.red} />
            <Txt x={920} y={1248} s={26} w={700} anchor="end" color={T.grey}>
              قيمة الدينار بالدولار
            </Txt>
            <text x={160} y={1248} fill={T.white} style={{ fontFamily: F.num, fontSize: 44 }}>
              {`${lerp(0.71, 0.32, drain).toFixed(2)} $`}
            </text>
            <text x={540} y={420} textAnchor="middle" fill={T.red} opacity={P(t, c(25) + 1.4, 0.4, E.back)} style={{ fontFamily: F.hit, fontSize: 150, filter: `drop-shadow(0 0 24px ${T.red})` }}>
              −55%
            </text>
          </g>
        )}

        {/* ===== S3 warning: exchange rate ≠ size of the economy ===== */}
        {s3 > 0.001 && (
          <g opacity={s3}>
            <g transform={`translate(540,560) scale(${lerp(0.6, 1, warn)})`} opacity={warn}>
              <path d="M0,-110 L120,100 L-120,100 Z" fill="none" stroke={T.amber} strokeWidth={10} strokeLinejoin="round" />
              <text x={0} y={70} textAnchor="middle" fill={T.amber} style={{ fontFamily: F.hit, fontSize: 130 }}>!</text>
            </g>
            <g opacity={neq}>
              <Txt x={790} y={930} s={56} w={900}>قوة العملة</Txt>
              {/* ≠ drawn by hand (the display font has no ≠) */}
              <line x1={500} x2={580} y1={895} y2={895} stroke={T.amber} strokeWidth={14} strokeLinecap="round" />
              <line x1={500} x2={580} y1={935} y2={935} stroke={T.amber} strokeWidth={14} strokeLinecap="round" />
              <line x1={515} y1={970} x2={565} y2={860} stroke={T.amber} strokeWidth={12} strokeLinecap="round" />
              <Txt x={290} y={930} s={56} w={900}>قوة الاقتصاد</Txt>
              <Mono x={540} y={1040} text="EXCHANGE RATE  ≠  ECONOMIC SIZE" color={T.grey} s={18} />
            </g>
          </g>
        )}

        {/* ===== S4 1958: 1000 francs = 1 dinar ===== */}
        {s4 > 0.001 && (
          <g opacity={s4}>
            <text x={540} y={500} textAnchor="middle" fill={T.white} style={{ fontFamily: F.num, fontSize: 220 }} opacity={P(t, c(20) + 0.6, 0.5)}>
              1958
            </text>
            {Array.from({ length: 100 }, (_, i) => {
              const col = i % 10, row = Math.floor(i / 10);
              const x0 = 300 + col * 48, y0 = 600 + row * 34;
              const u = P(collapse, (i / 100) * 0.5, 0.5, E.io);
              const x = lerp(x0, 540, u), y = lerp(y0, 860, u);
              return <rect key={i} x={x - 20} y={y - 13} width={40} height={26} rx={3} fill="none" stroke={T.steel} strokeWidth={1.5} opacity={P(notesIn, (i / 100) * 0.7, 0.3) * (1 - u)} />;
            })}
            <Mono x={540} y={980} text="1000 FRANCS" color={T.steel} s={22} op={notesIn * (1 - collapse)} />
            <Coin x={540} y={860} r={lerp(20, 130, collapse)} kind="tnd" op={collapse} label={collapse > 0.8 ? "1 DINAR" : undefined} />
          </g>
        )}

        {/* ===== S6 why? three reasons ===== */}
        {s6 > 0.001 && (
          <g opacity={s6}>
            <text x={540} y={760} textAnchor="middle" fill={T.red} transform={`translate(540,700) scale(${lerp(0.4, 1, q)}) translate(-540,-700)`} style={{ fontFamily: F.hit, fontSize: 420, filter: `drop-shadow(0 0 30px ${T.red})` }} opacity={q * (1 - 0.6 * tiles)}>
              ؟
            </text>
            {[0, 1, 2].map((i) => (
              <g key={i} opacity={P(tiles, i * 0.2, 0.5, E.o)} transform={`translate(${(1 - P(tiles, i * 0.2, 0.5, E.o)) * 60},0)`}>
                <rect x={170} y={880 + i * 130} width={740} height={104} rx={14} fill={T.panel} stroke={i === 0 ? T.red : T.dim} strokeWidth={2} />
                <text x={240} y={952 + i * 130} textAnchor="middle" fill={T.red} style={{ fontFamily: F.num, fontSize: 72 }}>{`0${i + 1}`}</text>
                <Txt x={870} y={948 + i * 130} s={40} w={800} anchor="end">{["التضخّم", "العجز التجاري", "تباطؤ الاقتصاد"][i]}</Txt>
              </g>
            ))}
          </g>
        )}

        {/* ===== S7 inflation: prices rise faster at home; the coin shrinks ===== */}
        {s7 > 0.001 && (
          <g opacity={s7}>
            <Mono x={540} y={330} text="01 · INFLATION" color={T.red} s={24} />
            {[
              { lab: "تونس", h: 520, col: T.red, x: 380 },
              { lab: "أمريكا وأوروبا", h: 240, col: T.grey, x: 700 },
            ].map((b, i) => (
              <g key={i}>
                <rect x={b.x - 80} y={1080 - b.h * prices} width={160} height={b.h * prices} fill={b.col} opacity={0.85} rx={6} />
                <path d={`M${b.x},${1080 - b.h * prices - 70} l-26,34 l52,0 Z`} fill={b.col} opacity={prices} />
                <Txt x={b.x} y={1140} s={38} w={800} color={b.col === T.red ? T.white : T.grey}>{b.lab}</Txt>
              </g>
            ))}
            <Txt x={540} y={430} s={30} w={600} color={T.grey} op={prices}>الأسعار (رسم توضيحي)</Txt>
            <g opacity={shrink}>
              <Coin x={860} y={560} r={lerp(80, 44, shrink)} kind="tnd" />
              {shrink > 0.5 && <path d="M840,520 L862,560 L846,590" fill="none" stroke={T.bg} strokeWidth={5} />}
            </g>
          </g>
        )}

        {/* ===== S8 trade deficit: imports in > exports out; hard currency drains ===== */}
        {s8 > 0.001 && (
          <g opacity={s8}>
            <Mono x={540} y={330} text="02 · TRADE DEFICIT" color={T.red} s={24} />
            {/* the country as a box */}
            <rect x={380} y={600} width={320} height={260} rx={18} fill={T.panel} stroke={T.white} strokeWidth={3} />
            <Txt x={540} y={745} s={52} w={900}>تونس</Txt>
            {/* imports: big arrow in */}
            <g opacity={imp}>
              <path d={`M80,${700} L${lerp(80, 360, imp)},700`} stroke={T.red} strokeWidth={70} strokeLinecap="butt" />
              <path d={`M${lerp(80, 360, imp)},640 l40,60 l-40,60 Z`} fill={T.red} />
              <Txt x={180} y={610} s={36} w={800} color={T.red}>واردات</Txt>
            </g>
            {/* exports: thin arrow out */}
            <g opacity={exp}>
              <path d={`M720,800 L${lerp(720, 960, exp)},800`} stroke={T.grey} strokeWidth={26} />
              <path d={`M${lerp(720, 960, exp)},776 l26,24 l-26,24 Z`} fill={T.grey} />
              <Txt x={880} y={880} s={36} w={800} color={T.grey}>صادرات</Txt>
            </g>
            {/* hard-currency reserve tank */}
            <g opacity={P(t, c(33) - 0.3, 0.5)}>
              <rect x={420} y={960} width={240} height={260} rx={12} fill="none" stroke={T.steel} strokeWidth={3} />
              <rect x={426} y={966 + 248 * reserve * 0.7} width={228} height={248 * (1 - reserve * 0.7)} rx={8} fill={T.steel} opacity={0.25} />
              {[0, 1, 2, 3].map((i) => {
                const u = ((t * 0.9 + i / 4) % 1) * reserve;
                return <Coin key={i} x={540 + (i % 2 ? 40 : -40)} y={1240 + u * 160} r={22} kind={i % 2 ? "eur" : "usd"} op={Math.sin(Math.PI * u)} />;
              })}
              <Txt x={540} y={940} s={30} w={700} color={T.steel}>العملة الصعبة</Txt>
            </g>
          </g>
        )}

        {/* ===== S9 slowdown, flexible rate, IMF ===== */}
        {s9 > 0.001 && (
          <g opacity={s9}>
            <Mono x={540} y={330} text="03 · SLOWDOWN" color={T.red} s={24} />
            <Txt x={540} y={420} s={30} w={600} color={T.grey}>النمو الاقتصادي (رسم توضيحي)</Txt>
            <line x1={140} x2={940} y1={760} y2={760} stroke={T.dim} strokeWidth={2} />
            <Line d="M140,740 C260,700 340,640 450,600" u={P(t, c(34) - 0.2, 0.8)} color={T.white} w={5} />
            <Line d="M450,600 C560,640 680,700 940,720" u={growth} color={T.red} w={5} glow />
            <line x1={450} x2={450} y1={560} y2={780} stroke={T.red} strokeDasharray="4 6" strokeWidth={2} opacity={growth} />
            <Mono x={450} y={810} text="2011" color={T.red} s={20} op={growth} />
            {/* the fixed rate becomes flexible */}
            <g opacity={flex}>
              <Txt x={540} y={930} s={36} w={800} color={T.white}>سعر الصرف</Txt>
              <path
                d={Array.from({ length: 50 }, (_, i) => {
                  const x = 160 + i * 16;
                  const y = 1030 + flex * (Math.sin(i * 0.7 + t * 2) * 26 + i * 1.6);
                  return `${i ? "L" : "M"}${x},${y.toFixed(1)}`;
                }).join(" ")}
                fill="none"
                stroke={T.amber}
                strokeWidth={5}
              />
              <Mono x={540} y={1170} text={flex > 0.5 ? "FIXED → FLEXIBLE" : "FIXED"} color={T.amber} s={20} />
            </g>
            <g opacity={imf} transform={`translate(${540},${1250}) scale(${lerp(0.8, 1, imf)})`}>
              <rect x={-260} y={-40} width={520} height={90} rx={12} fill={T.panel} stroke={T.steel} strokeWidth={2} />
              <Txt x={0} y={18} s={34} w={800} color={T.steel}>صندوق النقد الدولي · IMF</Txt>
            </g>
          </g>
        )}

        {/* ===== S10 the citizen: the millimes he loses, the basket, his child ===== */}
        {s10 > 0.001 && (
          <g opacity={s10}>
            <ellipse cx={540} cy={1060} rx={420} ry={60} fill={T.red} opacity={0.08} />
            {/* parent */}
            <g fill={T.white} opacity={0.92}>
              <circle cx={470} cy={640} r={58} />
              <path d="M390,1060 L390,780 Q470,710 550,780 L550,1060 Z" />
            </g>
            {/* child (holding hand) */}
            <g fill={T.white} opacity={child * 0.92}>
              <circle cx={660} cy={820} r={40} />
              <path d="M612,1060 L612,900 Q660,860 708,900 L708,1060 Z" />
              <path d="M550,900 Q585,920 615,920" stroke={T.white} strokeWidth={14} fill="none" strokeLinecap="round" />
            </g>
            {/* coins falling from his hand */}
            {Array.from({ length: 8 }, (_, i) => {
              const u = clamp(fall * 1.6 - i * 0.09);
              return u > 0 && u < 1 ? <Coin key={i} x={360 + hash(i, 1) * 40 - u * 30} y={900 + u * 260} r={18} kind="tnd" op={1 - u} /> : null;
            })}
            {/* the basket shrinks */}
            <g transform={`translate(270,980) scale(${lerp(1, 0.55, basket)})`} opacity={P(t, c(38), 0.5)}>
              <path d="M-80,-40 L80,-40 L60,40 L-60,40 Z" fill="none" stroke={T.amber} strokeWidth={6} strokeLinejoin="round" />
              <path d="M-50,-40 Q0,-110 50,-40" fill="none" stroke={T.amber} strokeWidth={6} />
            </g>
            <Txt x={270} y={1150} s={30} w={700} color={T.amber} op={P(t, c(38) + 0.3, 0.5)}>القدرة الشرائية</Txt>
            <Txt x={680} y={1150} s={30} w={700} color={T.white} op={child}>المستقبل</Txt>
          </g>
        )}

        {/* ===== S12 the flag: a coin becomes the nation ===== */}
        {s12 > 0.001 && (
          <g opacity={s12}>
            <Coin x={540} y={760} r={lerp(150, 0, flagU)} kind="tnd" op={1 - flagU} />
            {flagU > 0.001 && (
              <g opacity={flagU} transform={`translate(540,760) scale(${lerp(0.4, 1, flagU)})`}>
                <rect x={-300} y={-200} width={600} height={400} fill={T.red} rx={6} style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,.6))" }} />
                <circle cx={0} cy={0} r={100} fill={T.white} />
                <circle cx={0} cy={0} r={75} fill={T.red} />
                <circle cx={19} cy={0} r={60} fill={T.white} />
                <path d={Array.from({ length: 10 }, (_, i) => {
                  const a = -Math.PI / 2 + (i * Math.PI) / 5 - Math.PI / 2;
                  const r = i % 2 ? 18 : 45;
                  return `${i ? "L" : "M"}${(20 + r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
                }).join(" ") + " Z"} fill={T.red} />
              </g>
            )}
            {/* end card after the last word */}
            <g opacity={P(t, END + 0.4, 0.8, E.o)}>
              <Txt x={540} y={1100} s={72} w={900}>قصة الدينار التونسي</Txt>
              <Mono x={540} y={1160} text="1958 — 2026 · USD/TND 0.40 → 3.04" color={T.grey} s={22} />
            </g>
          </g>
        )}
      </g>
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
    <div style={{ position: "absolute", left: 60, width: 960, top: 1440, textAlign: "center", direction: "rtl", opacity: op }}>
      <div style={{ fontFamily: F.ar, fontWeight: 800, fontSize: 64, lineHeight: 1.45, color: T.white }}>
        {ch.words.map((w, j) => {
          const u = P(t, w.on - 0.06, 0.2, E.o);
          const key = w.k === "r";
          return (
            <React.Fragment key={j}>
              <span
                style={{
                  display: "inline-block",
                  opacity: lerp(0.18, 1, u),
                  transform: `translateY(${(1 - u) * 14}px) scale(${lerp(0.92, 1, u)})`,
                  background: key ? `rgba(231,0,19,${(0.95 * P(t, w.on, 0.25, E.o)).toFixed(2)})` : undefined,
                  borderRadius: 12,
                  padding: key ? "0 .22em" : undefined,
                  textShadow: "0 4px 18px rgba(0,0,0,.7)",
                  direction: /[0-9]/.test(w.t) ? "ltr" : "rtl",
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
  // the ticker follows the story's year
  let yr = 2026.88;
  if (t < c(9)) yr = t < c(4) ? 2026.88 : 1975;
  else if (t < c(24) || t >= c(40)) yr = lerp(lerp(lerp(1975, 1993, P(t, c(9), c(10) - c(9) + 0.6, E.io)), 2011, P(t, c(12), c(13) - c(12), E.io)), 2026.88, P(t, c(14) + 0.4, c(15) - c(14) + 0.6, E.i));
  const v = rateAt(yr);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op }}>
      <div style={{ position: "absolute", right: 60, top: 92, display: "flex", gap: 0, direction: "rtl", fontFamily: F.ar, fontWeight: 800, fontSize: 28 }}>
        <span style={{ background: T.red, color: T.white, padding: "6px 18px" }}>اقتصاد</span>
        <span style={{ background: T.white, color: T.bg, padding: "6px 18px" }}>تونس</span>
      </div>
      <div style={{ position: "absolute", left: 60, top: 96, fontFamily: F.mono, fontSize: 24, color: T.white, letterSpacing: ".08em" }}>
        USD/TND <span style={{ color: T.red }}>{v.toFixed(3)}</span>
        <span style={{ color: T.grey, fontSize: 18 }}> · {Math.floor(yr)}</span>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 150, height: 2, background: "rgba(255,255,255,.12)" }}>
        <div style={{ width: `${(100 * clamp(t / D.total)).toFixed(2)}%`, height: 2, background: T.red }} />
      </div>
    </div>
  );
};

/** red diagonal wipe at every scene change */
const Wipes: React.FC<{ t: number }> = ({ t }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {SB.slice(1).map((s, i) => {
      const u = P(t, s - 0.32, 0.5, E.io);
      if (u <= 0 || u >= 1) return null;
      const x = lerp(1500, -900, u);
      return <path key={i} d={`M${x},0 L${x + 420},0 L${x + 120},1920 L${x - 300},1920 Z`} fill={T.red} opacity={0.92} />;
    })}
  </svg>
);

// ---------- sound design (no music: voice + SFX + a very low dark bed) ----------
const SFX: [number, string, number][] = [
  [0.0, "glitch_digital_01", 0.25],
  [c(3) - 4.6, "riser_dark_03", 0.35],
  [c(3) + 0.2, "boom_sub_02", 0.55],
  [c(3) + 0.2, "hit_trailer_01", 0.35],
  [c(4) - 0.3, "whoosh_reverse_05", 0.35],
  [c(4) - 0.1, "counter_roll_01", 0.3],
  [c(6) - 0.1, "hit_soft_01", 0.35],
  [c(8), "pop_drop_04", 0.3],
  [c(8) + 0.35, "pop_drop_04", 0.28],
  [c(8) + 0.7, "pop_drop_04", 0.26],
  [c(9) - 0.2, "scan_hud_01", 0.25],
  [c(11), "beep_data_03", 0.22],
  [c(13), "beep_data_03", 0.22],
  [c(14) + 0.4, "riser_tonal_02", 0.3],
  [c(15) + 0.6, "boom_sub_02", 0.45],
  [c(16), "tick_01", 0.35],
  [c(17) - 0.1, "downlifter_01", 0.35],
  [c(20) + 0.5, "hit_soft_01", 0.35],
  [c(22) - 0.2, "whoosh_soft_01", 0.35],
  [c(22) + 1.0, "thud_soft_01", 0.45],
  [c(25) + 1.3, "boom_cinematic_01", 0.4],
  [c(25) + 1.3, "glitch_digital_01", 0.2],
  [c(27) - 0.3, "whoosh_long_04", 0.35],
  [c(28), "swish_01", 0.3],
  [c(28) + 0.2, "swish_02", 0.3],
  [c(28) + 0.4, "swish_03", 0.3],
  [c(36) + 0.2, "typewriter_key_01", 0.3],
  [c(37), "heartbeat_slow_loop", 0.25],
  [c(42) - 0.5, "swell_reveal_01", 0.35],
  [c(43) - 0.2, "boom_cinematic_01", 0.3],
  // a whoosh under every red wipe
  ...SB.slice(1).map((s, i) => [s - 0.38, i % 2 ? "whoosh_fast_02" : "swish_04", 0.3] as [number, string, number]),
];

export const DinarStory: React.FC = () => {
  const ready = useTnFonts();
  const f = useCurrentFrame();
  const t = f / 30;
  if (!ready) return null;
  // camera shake on the ×2.48 slam and the −55%
  const shake = (at: number) => {
    const a = t - at;
    return a > 0 && a < 0.5 ? (1 - a / 0.5) * 9 : 0;
  };
  const sh = shake(c(3) + 0.2) + shake(c(25) + 1.3) + shake(c(15) + 0.6) * 0.6;
  const leak = Math.max(env(t, c(3), 0.2, c(3) + 1.0, 0.8), env(t, c(15) + 0.5, 0.2, c(15) + 1.5, 0.8), env(t, c(25) + 1.2, 0.2, c(25) + 2.2, 0.8));
  return (
    <AbsoluteFill style={{ background: T.bg, overflow: "hidden" }}>
      {/* background: soft spotlight + moving grid */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 42%, #1b1b20 0%, ${T.bg} 70%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 24 }, (_, i) => (
          <line key={`v${i}`} x1={(i * 60 + t * 6) % 1440 - 180} x2={(i * 60 + t * 6) % 1440 - 180} y1={0} y2={1920} stroke="#fff" strokeOpacity={0.025} />
        ))}
        {Array.from({ length: 34 }, (_, i) => (
          <line key={`h${i}`} x1={0} x2={1080} y1={i * 60} y2={i * 60} stroke="#fff" strokeOpacity={0.025} />
        ))}
      </svg>
      <AbsoluteFill style={{ transform: `translate(${(hash(f, 1) - 0.5) * sh}px, ${(hash(f, 2) - 0.5) * sh}px)` }}>
        <Scene t={t} />
      </AbsoluteFill>
      {/* red light leak on the big hits */}
      {leak > 0.01 && <Img src={staticFile("tn-dinar/light_leak_red_04.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, objectFit: "cover", mixBlendMode: "screen", opacity: 0.35 * leak }} />}
      {/* caption shield */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,10,12,0) 68%, rgba(10,10,12,.85) 76%, rgba(10,10,12,.85) 90%, rgba(10,10,12,0) 100%)" }} />
      <Captions t={t} />
      <Chrome t={t} />
      <Wipes t={t} />
      {/* vignette + grain */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.09, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <Img key={i} src={staticFile("tn-dinar/grain_tile_512.png")} style={{ position: "absolute", width: 512, height: 512, left: (i % 4) * 512 - Math.floor(hash(f, 3) * 512), top: Math.floor(i / 4) * 512 - Math.floor(hash(f, 4) * 512) }} />
        ))}
      </AbsoluteFill>
      {/* sound */}
      <Sequence from={Math.round(D.off * 30)} layout="none">
        <Audio src={staticFile("tn-dinar/voice.mp3")} />
      </Sequence>
      <Audio src={staticFile("tn-dinar/sfx/drone_dark_space_loop.mp3")} loop volume={(fr) => 0.07 * P(fr / 30, 0, 2) * (1 - P(fr / 30, D.total - 2.5, 2.5))} />
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * 30))} layout="none">
          <Audio src={staticFile(`tn-dinar/sfx/${name}.mp3`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
