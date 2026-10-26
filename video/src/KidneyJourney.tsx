import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import VO from "./kidney-vo.json";

loadFont({ family: "Cairo", url: staticFile("fonts/Cairo-Variable.woff2"), weight: "200 1000" });

// launch-motion-style: black + one neon accent (water aqua), glow, one continuous camera take.
const C = { bg: "#02060c", ink: "#f2f7ff", dim: "#5d6f86", acc: "#3fd0ff", accSoft: "#1d6f99", warn: "#ffb547", bad: "#ff5a5f", blood: "#ff4d5e", kid: "#ff8a8f" };
const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sCurve = Easing.bezier(0.65, 0, 0.35, 1); // soft S-curve, lands in ~0.75 of the move
const f = (s: number) => Math.round(s * FPS);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

type Word = { w: string; start: number; end: number };
type Line = { text: string; start: number; end: number; words: Word[] };
const LINES = VO.lines as Line[];
const strip = (s: string) => s.replace(/[ً-ْـ،,.؟?:؛!«»]/g, "");
const at = (li: number, prefix: string) => {
  const w = LINES[li].words.find((x) => strip(x.w).startsWith(strip(prefix)));
  if (!w) throw new Error(`no «${prefix}» in line ${li}`);
  return w.start;
};
const ls = (i: number) => LINES[i].start;
const le = (i: number) => LINES[i].end;
export const JOURNEY_FRAMES = f(VO.duration) + f(2.4);

/* ---------- world (one coordinate space the camera flies through) ---------- */
// Glass at the origin; the body lies far below it; kidneys inside the body.
const KL = { x: -250, y: 3900 }; // left kidney centre (viewer's left)
const KR = { x: 250, y: 3900 };
const BODY = { x: 0, y: 3500 };

type Cam = { t: number; x: number; y: number; s: number };
const CAM: Cam[] = [
  { t: 0, x: 0, y: 40, s: 1.05 },
  { t: ls(1) - 0.3, x: 0, y: 0, s: 1.2 }, // slow push on the glass
  { t: ls(1) + 0.5, x: 0, y: -60, s: 3.2 }, // dive into the water
  { t: ls(1) + 1.6, x: 0, y: 1900, s: 0.75 }, // follow the falling light
  { t: at(1, "الكليتين"), x: 0, y: 3650, s: 0.42 }, // the whole body, kidneys light up
  { t: le(2) + 0.1, x: 0, y: 3820, s: 0.95 }, // «من أهم أعضاء الجسم»: closer on both kidneys
  { t: at(3, "تصفية"), x: KL.x, y: KL.y, s: 3.1 }, // inside the left kidney: filtration
  { t: le(3), x: KL.x + 10, y: KL.y + 20, s: 3.3 },
  { t: ls(4) + 0.7, x: 0, y: 3880, s: 1.05 }, // pull back: both kidneys, «قسم الكلى»
  { t: le(5), x: 0, y: 3900, s: 1.15 },
  { t: ls(6) + 0.7, x: KL.x, y: KL.y, s: 2.4 }, // dehydration: back in, flow thins
  { t: at(7, "حصوات") - 0.2, x: KL.x - 30, y: KL.y + 95, s: 5.5 }, // stones at the lower pole
  { t: le(7), x: KL.x - 30, y: KL.y + 95, s: 5.8 },
  { t: ls(8) + 0.7, x: KL.x, y: KL.y, s: 1.6 }, // function gauge around the kidney
  { t: le(8), x: KL.x, y: KL.y, s: 1.7 },
  { t: at(9, "الوقاية") + 0.1, x: 0, y: 3450, s: 0.36 }, // fast pull out: shield around the body
  { t: le(10), x: 0, y: 3500, s: 0.4 },
  { t: ls(11) + 0.8, x: 0, y: 3600, s: 0.3 }, // quote over the dimmed body
  { t: ls(13) + 0.4, x: 0, y: 1500, s: 0.45 }, // travel back up the light
  { t: at(13, "اليوم"), x: 0, y: 30, s: 1.1 }, // the glass again, filling
  { t: VO.duration + 2.4, x: 0, y: 0, s: 1.25 },
];
const camAt = (t: number) => {
  let i = 0;
  while (i < CAM.length - 2 && t > CAM[i + 1].t) i++;
  const a = CAM[i], b = CAM[i + 1];
  const p = sCurve(Math.max(0, Math.min(1, (t - a.t) / Math.max(0.01, b.t - a.t))));
  // zoom interpolates in log space so dives feel even
  return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), p)) };
};
const win = (t: number, a: number, b: number, fade = 0.35) =>
  interpolate(t, [a - fade, a, b, b + fade], [0, 1, 1, 0], clamp);
const rise = (t: number, a: number, d = 0.75) => sCurve(Math.max(0, Math.min(1, (t - a) / d)));

const KIDNEY_PATH = "M88 6 C128 6 150 46 148 92 C146 140 120 174 82 172 C52 170 32 152 36 130 C39 114 56 108 58 92 C60 76 44 70 38 56 C30 32 52 6 88 6 Z";
const BODY_PATH =
  "M0 -1250 C130 -1250 210 -1150 210 -1010 C210 -880 140 -800 90 -770 L90 -700 C260 -680 420 -620 470 -480 C520 -330 520 80 470 420 C440 640 330 780 260 900 L230 1500 L-230 1500 L-260 900 C-330 780 -440 640 -470 420 C-520 80 -520 -330 -470 -480 C-420 -620 -260 -680 -90 -700 L-90 -770 C-140 -800 -210 -880 -210 -1010 C-210 -1150 -130 -1250 0 -1250 Z";
const TRAIL_PATH = `M0 230 C0 700 -160 1100 -60 1600 C40 2100 0 2500 0 2900 C0 3300 -120 3600 ${KL.x} ${KL.y - 120} M0 2900 C0 3300 120 3600 ${KR.x} ${KR.y - 120}`;

const Glow: React.FC<{ id: string; r?: number }> = ({ id, r = 6 }) => (
  <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation={r} result="b" />
    <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
  </filter>
);

const Kidney: React.FC<{ cx: number; cy: number; flip?: boolean; draw: number; heat: number; dry: number }> = ({ cx, cy, flip, draw, heat, dry }) => {
  const k = 1.9;
  const col = dry > 0 ? `rgb(${255}, ${Math.round(138 - 40 * dry)}, ${Math.round(143 - 90 * dry)})` : C.kid;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${flip ? -k : k} ${k}) translate(-92 -89)`}>
      <path d={KIDNEY_PATH} fill={col} opacity={0.18 + 0.5 * heat} />
      <path d={KIDNEY_PATH} fill="none" stroke={col} strokeWidth={2.2} strokeDasharray={560} strokeDashoffset={560 * (1 - draw)} filter="url(#g4)" />
    </g>
  );
};

const World: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const cam = camAt(t);
  // element timings
  const fill = interpolate(t, [0.3, le(0)], [0.12, 0.78], { ...clamp, easing: Easing.out(Easing.cubic) })
    * interpolate(t, [ls(1) - 0.2, ls(1) + 1.2], [1, 0.55], clamp)
    + interpolate(t, [ls(13), at(13, "خطوة")], [0, 0.4], { ...clamp, easing: Easing.out(Easing.cubic) });
  const trail = rise(t, ls(1) + 0.45, 1.8);
  const body = rise(t, ls(1) + 1.3, 1.6);
  const kidDraw = rise(t, at(1, "الكليتين") - 0.25, 0.8);
  const heat = 0.3 + 0.7 * win(t, at(1, "الكليتين"), le(2) + 0.6) + 0.6 * win(t, ls(5), le(5));
  const dry = interpolate(t, [ls(6), at(6, "تركيز")], [0, 1], clamp) * interpolate(t, [at(9, "الوقاية"), at(9, "الوقاية") + 1], [1, 0], clamp);
  const detail = interpolate(cam.s, [1.8, 2.6], [0, 1], clamp);
  const flowSlow = 1 - 0.75 * dry;
  const stones = rise(t, at(7, "حصوات") - 0.5, 1.0);
  const gauge = win(t, ls(8) + 0.3, le(8) + 0.2);
  const fn = interpolate(t, [at(8, "وظائف") - 0.2, at(8, "وظائف") + 1.2], [0.86, 0.3], { ...clamp, easing: sCurve });
  const shield = rise(t, at(9, "الوقاية") - 0.1, 1.1) * interpolate(t, [ls(11), ls(11) + 0.6], [1, 0.35], clamp);
  const pulse = (k: number) => ((frame * 6 * flowSlow + k * 90) % 400) / 400;
  const credential = win(t, ls(4) + 0.6, le(5));
  const dimAll = interpolate(t, [ls(11), ls(11) + 0.6, ls(13), ls(13) + 0.6], [1, 0.35, 0.35, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <Glow id="g4" r={4} />
        <Glow id="g10" r={10} />
        <clipPath id="glassClip"><path d="M-150 -230 L150 -230 L120 230 L-120 230 Z" /></clipPath>
        <radialGradient id="kidLight"><stop offset="0" stopColor={C.acc} stopOpacity={0.35} /><stop offset="1" stopColor={C.acc} stopOpacity={0} /></radialGradient>
      </defs>
      <g transform={`translate(540 960) scale(${cam.s}) translate(${-cam.x} ${-cam.y})`} opacity={dimAll}>
        {/* glass */}
        <g>
          <g clipPath="url(#glassClip)">
            <path d={`M-200 ${230 - 460 * fill} Q -75 ${222 - 460 * fill + 10 * Math.sin(t * 5)} 0 ${230 - 460 * fill} T 200 ${230 - 460 * fill} V 260 H -200 Z`} fill={C.acc} opacity={0.75} />
          </g>
          <path d="M-150 -230 L150 -230 L120 230 L-120 230 Z" fill="none" stroke={C.ink} strokeWidth={4} filter="url(#g4)" opacity={0.95} />
        </g>
        {/* the light: water falling from the glass, drawing the way to both kidneys */}
        <path d={TRAIL_PATH} fill="none" stroke={C.acc} strokeWidth={10 / Math.max(0.6, cam.s)} strokeLinecap="round" strokeDasharray={9000} strokeDashoffset={9000 * (1 - trail)} filter="url(#g10)" opacity={0.9} />
        {trail >= 1
          ? [0, 1, 2, 3].map((k) => (
              <path key={k} d={TRAIL_PATH} fill="none" stroke="#fff" strokeWidth={14 / Math.max(0.6, cam.s)} strokeLinecap="round" strokeDasharray={`60 8940`} strokeDashoffset={-9000 * pulse(k)} opacity={0.8} />
            ))
          : null}
        {/* body outline */}
        <g transform={`translate(${BODY.x} ${BODY.y})`}>
          <path d={BODY_PATH} fill="rgba(63,208,255,0.03)" stroke={C.accSoft} strokeWidth={5} strokeDasharray={9000} strokeDashoffset={9000 * (1 - body)} filter="url(#g4)" />
        </g>
        {/* shield of light around the body («الوقاية») */}
        <g transform={`translate(${BODY.x} ${BODY.y}) scale(1.18)`} opacity={shield}>
          <path d={BODY_PATH} fill="none" stroke={C.acc} strokeWidth={9} strokeDasharray={9000} strokeDashoffset={9000 * (1 - shield)} filter="url(#g10)" />
        </g>
        {/* kidneys + halo */}
        <circle cx={KL.x} cy={KL.y} r={320} fill="url(#kidLight)" opacity={heat * kidDraw} />
        <circle cx={KR.x} cy={KR.y} r={320} fill="url(#kidLight)" opacity={heat * kidDraw} />
        <Kidney cx={KL.x} cy={KL.y} draw={kidDraw} heat={heat} dry={dry} />
        <Kidney cx={KR.x} cy={KR.y} flip draw={kidDraw} heat={heat} dry={dry} />
        {/* inside the left kidney: blood in, clean blood out, waste down to the ureter */}
        <g opacity={detail}>
          {Array.from({ length: 34 }, (_, i) => {
            const ph = ((frame * 0.012 * flowSlow + i / 34) % 1);
            const waste = i % 3 === 0;
            const x = KL.x + 130 - ph * 210 + Math.sin(ph * 8 + i) * 10;
            const y = KL.y - 90 + ph * 150;
            const wx = KL.x - 40 + (ph - 0.5) * 30;
            const wy = KL.y + 40 + (ph - 0.5) * 380;
            const isOut = waste && ph > 0.5;
            const col = waste ? (dry > 0.5 ? "#ff9a2e" : C.warn) : C.blood;
            return <circle key={i} cx={isOut ? wx : x} cy={isOut ? wy : y} r={waste ? 6 + 3 * dry : 7} fill={col} opacity={0.95} filter="url(#g4)" />;
          })}
          <circle cx={KL.x + 10} cy={KL.y - 20} r={46} fill="none" stroke={C.acc} strokeWidth={3} strokeDasharray="6 7" filter="url(#g4)" transform={`rotate(${frame * 2} ${KL.x + 10} ${KL.y - 20})`} />
        </g>
        {/* stones at the lower pole */}
        <g opacity={stones}>
          {[[-30, 95, 1], [-5, 112, 0.7], [-52, 118, 0.6], [-18, 76, 0.5]].map(([dx, dy, k], i) => {
            const g = Math.max(0, Math.min(1, stones * 1.6 - i * 0.2)) * (k as number);
            return (
              <g key={i} transform={`translate(${KL.x + (dx as number)} ${KL.y + (dy as number)}) scale(${g * 1.6}) rotate(${i * 40})`}>
                <path d="M0 -12 L10 -4 L8 9 L-6 11 L-12 0 Z" fill="#f6e7b9" stroke={C.warn} strokeWidth={1.4} filter="url(#g4)" />
              </g>
            );
          })}
        </g>
        {/* function gauge ring around the left kidney */}
        <g opacity={gauge} transform={`translate(${KL.x} ${KL.y}) rotate(-90)`}>
          <circle r={250} fill="none" stroke="#14304d" strokeWidth={18} />
          <circle r={250} fill="none" stroke={fn > 0.6 ? "#3ddc97" : fn > 0.42 ? C.warn : C.bad} strokeWidth={18} strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 250 * fn} 9999`} filter="url(#g4)" />
        </g>
        {/* credential mark between the kidneys */}
        <g opacity={credential} transform={`translate(0 ${3900 - 330}) scale(${0.8 + 0.2 * credential})`}>
          <rect x={-60} y={-60} width={120} height={120} rx={30} fill={C.acc} filter="url(#g4)" />
          <path d="M0 -32 V32 M-32 0 H32" stroke={C.bg} strokeWidth={16} strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

/* ---------- kinetic words (screen space) ---------- */
const KEY = ["الماء", "الكليتين", "الكلى", "تصفية", "الفضلات", "السوائل", "قسم", "الجفاف", "تركيز", "حصوات", "وظائف", "الوقاية", "بانتظام", "العطش", "البول", "ننتظر", "العلاج", "صحة", "غد", "خطوة"];
const isKey = (w: string) => KEY.some((k) => strip(w).includes(strip(k)));
const CHUNKS: Word[][] = [];
LINES.forEach((ln) => {
  let cur: Word[] = [];
  ln.words.forEach((w, i) => {
    cur.push(w);
    if (i === ln.words.length - 1 || cur.length >= 4 || /[،,.؟?:؛]$/.test(w.w)) { CHUNKS.push(cur); cur = []; }
  });
});
// Big centred moments instead of the running line.
const HERO: { from: number; to: number; text: string; size: number }[] = [
  { from: at(9, "الوقاية") - 0.05, to: le(9) + 0.5, text: "الوقاية", size: 210 },
];

const Kinetic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  const hero = HERO.find((h) => t >= h.from && t < h.to);
  if (hero) {
    const p = spring({ frame: frame - f(hero.from), fps, config: { damping: 14, stiffness: 150 } });
    const o = interpolate(t, [hero.to - 0.3, hero.to], [1, 0], clamp);
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div dir="rtl" style={{ fontFamily: "Cairo", fontWeight: 1000, fontSize: hero.size, color: C.acc, opacity: Math.min(1, p * 1.3) * o, transform: `scale(${0.7 + 0.3 * p})`, filter: `blur(${(1 - p) * 10}px)`, textShadow: `0 0 50px ${C.acc}aa` }}>{hero.text}</div>
      </AbsoluteFill>
    );
  }
  const c = CHUNKS.find((ch, i) => t >= ch[0].start - 0.08 && t < Math.min(ch[ch.length - 1].end + 0.35, (CHUNKS[i + 1]?.[0].start ?? 1e9) - 0.06));
  if (!c) return null;
  const quote = t >= ls(11) && t < ls(13);
  const big = quote ? 104 : 88;
  const y = quote ? 820 : 1330;
  const leave = interpolate(t, [c[c.length - 1].end + 0.2, c[c.length - 1].end + 0.35], [1, 0], clamp);
  return (
    <div dir="rtl" style={{ position: "absolute", top: y, left: 60, right: 60, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.26em", fontFamily: "Cairo", fontWeight: 900, fontSize: big, lineHeight: 1.3, opacity: leave }}>
      {c.map((w, i) => {
        const p = sCurve(Math.max(0, Math.min(1, (t - w.start + 0.1) / 0.32)));
        const key = isKey(w.w);
        const spoken = t >= w.start;
        return (
          <span key={i} style={{ display: "inline-block", color: key ? C.acc : spoken ? C.ink : C.dim, opacity: 0.25 + 0.75 * p, transform: `translateY(${(1 - p) * 40}px) scale(${key ? 1 + 0.06 * p : 1})`, filter: `blur(${(1 - p) * 8}px)`, textShadow: key ? `0 0 28px ${C.acc}99` : "0 6px 24px rgba(0,0,0,0.6)" }}>
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

// Screen-space read-outs that belong to a beat (urine concentration).
const Readouts: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const u = win(t, at(6, "ويجعل"), le(6) + 0.4);
  const conc = interpolate(t, [at(6, "تركيز") - 0.4, at(6, "تركيز") + 0.5], [0.1, 0.92], { ...clamp, easing: sCurve });
  const col = (p: number) => `hsl(${52 - 22 * p}, ${70 + 25 * p}%, ${82 - 42 * p}%)`;
  return (
    <div style={{ position: "absolute", top: 1560, left: 170, right: 170, opacity: u, transform: `translateY(${(1 - u) * 30}px)` }}>
      <div style={{ position: "relative", height: 26, borderRadius: 13, background: `linear-gradient(90deg, ${col(0)}, ${col(0.5)}, ${col(1)})`, boxShadow: "0 0 24px rgba(255,180,71,0.35)" }}>
        <div style={{ position: "absolute", left: `calc(${conc * 100}% - 16px)`, top: -12, width: 32, height: 50, borderRadius: 16, border: `5px solid ${C.ink}` }} />
      </div>
      <div dir="rtl" style={{ marginTop: 14, textAlign: "center", fontFamily: "Cairo", fontWeight: 800, fontSize: 34, color: C.dim }}>تركيز البول</div>
    </div>
  );
};

const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = camAt(t);
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(70% 45% at 50% 48%, rgba(29,111,153,0.22), transparent 70%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        {Array.from({ length: 40 }, (_, i) => {
          // dust drifts against the camera so the move reads even on a black frame
          const x = ((random(`x${i}`) * 1400 - cam.x * 0.08 * (0.5 + random(`z${i}`)) + frame * 0.2) % 1400 + 1400) % 1400 - 160;
          const y = ((random(`y${i}`) * 2200 - cam.y * 0.08 * (0.5 + random(`z${i}`))) % 2200 + 2200) % 2200 - 140;
          return <circle key={i} cx={x} cy={y} r={1 + random(`r${i}`) * 2.2} fill={C.acc} opacity={0.25 + random(`o${i}`) * 0.4} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7) 100%)" }} />
    </>
  );
};

// Ending: everything collapses into a dot that resolves into the handle.
const End: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const a = VO.duration + 0.5;
  const p = rise(t, a, 0.7);
  if (t < a) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: `rgba(2,6,12,${p})` }}>
      <div style={{ width: 20 + 0 * p, height: 20, borderRadius: 10, background: C.acc, boxShadow: `0 0 30px ${C.acc}`, transform: `scaleX(${1 + 18 * rise(t, a + 0.5, 0.6)})`, opacity: 1 - rise(t, a + 1.0, 0.4) }} />
      <div style={{ position: "absolute", fontFamily: "Cairo", fontWeight: 900, fontSize: 64, color: C.ink, opacity: rise(t, a + 1.0, 0.5), letterSpacing: 1 }}>@aymen.1303</div>
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; src: string; volume: number; len?: number }> = ({ at: s, src, volume, len = 1.5 }) => (
  <Sequence from={Math.max(0, f(s))} durationInFrames={f(len)} layout="none">
    <Audio src={staticFile(`kidney/sfx/${src}.mp3`)} volume={volume} />
  </Sequence>
);

export const KidneyJourney: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Atmosphere />
      <World t={frame / FPS} frame={frame} />
      <Readouts />
      <Kinetic />
      <End />
      <Audio src={staticFile("kidney/vo.wav")} />
      <Audio src={staticFile("kidney/sfx/drone_calm_low_loop.mp3")} loop volume={(fr) => 0.07 * interpolate(fr, [0, 20, durationInFrames - 40, durationInFrames], [0, 1, 1, 0], clamp)} />
      {/* sound follows the camera: dive, fall, landings */}
      <Sfx at={ls(1) + 0.2} src="drip_drop" volume={0.45} />
      <Sfx at={ls(1) + 0.45} src="whoosh_deep_03" volume={0.3} len={2} />
      <Sfx at={at(1, "الكليتين") - 0.1} src="shimmer_01" volume={0.25} len={2} />
      <Sfx at={at(3, "تصفية") - 0.6} src="swish_soft" volume={0.3} />
      <Sfx at={ls(4) + 0.2} src="swish_soft" volume={0.25} />
      <Sfx at={at(7, "حصوات")} src="hit_soft_01" volume={0.3} />
      <Sfx at={at(9, "الوقاية") - 0.5} src="whoosh_fast_02" volume={0.3} />
      <Sfx at={at(9, "الوقاية")} src="chime_soft_01" volume={0.3} len={2.5} />
      <Sfx at={ls(13)} src="whoosh_deep_03" volume={0.22} len={2} />
      <Sfx at={VO.duration + 1.0} src="pop_01" volume={0.3} len={0.6} />
    </AbsoluteFill>
  );
};
