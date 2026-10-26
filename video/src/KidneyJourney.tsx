import { loadFont } from "@remotion/fonts";
import { CameraMotionBlur } from "@remotion/motion-blur";
import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import VO from "./kidney-vo.json";

loadFont({ family: "Cairo", url: staticFile("fonts/Cairo-Variable.woff2"), weight: "200 1000" });

// launch-motion-style: black + one neon accent (water aqua), glow, line ribbons, one continuous camera take.
const C = { bg: "#010409", ink: "#f2f7ff", dim: "#51627a", acc: "#3fd0ff", accHot: "#b9f0ff", accSoft: "#1a6a93", warn: "#ffb547", bad: "#ff5a5f", blood: "#ff4d5e", vein: "#5b8cff", kid: "#ff8f8f", kidDeep: "#a3324a" };
const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sCurve = Easing.bezier(0.65, 0, 0.35, 1);
const f = (s: number) => Math.round(s * FPS);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const cl01 = (x: number) => Math.max(0, Math.min(1, x));

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
const win = (t: number, a: number, b: number, fade = 0.35) => interpolate(t, [a - fade, a, b, b + fade], [0, 1, 1, 0], clamp);
const rise = (t: number, a: number, d = 0.75) => sCurve(cl01((t - a) / d));

/* ---------- world layout ---------- */
const KL = { x: -250, y: 3900 };
const KR = { x: 250, y: 3900 };
const BODY = { x: 0, y: 3500 };

type Cam = { t: number; x: number; y: number; s: number; r?: number };
const CAM: Cam[] = [
  { t: 0, x: 0, y: 40, s: 1.05 },
  { t: ls(1) - 0.3, x: 0, y: 0, s: 1.2 },
  { t: ls(1) + 0.5, x: 0, y: -60, s: 3.2, r: -4 },
  { t: ls(1) + 1.6, x: 0, y: 1900, s: 0.75, r: 3 },
  { t: at(1, "الكليتين"), x: 0, y: 3650, s: 0.42 },
  { t: le(2) + 0.1, x: 0, y: 3820, s: 0.95 },
  { t: at(3, "تصفية"), x: KL.x, y: KL.y, s: 3.1, r: -3 },
  { t: le(3), x: KL.x + 10, y: KL.y + 20, s: 3.3, r: -2 },
  { t: ls(4) + 0.7, x: 0, y: 3880, s: 1.05 },
  { t: le(5), x: 0, y: 3900, s: 1.15 },
  { t: ls(6) + 0.7, x: KL.x, y: KL.y, s: 2.4, r: 2 },
  { t: at(7, "حصوات") - 0.2, x: KL.x - 30, y: KL.y + 95, s: 5.5, r: -3 },
  { t: le(7), x: KL.x - 30, y: KL.y + 95, s: 5.8, r: -4 },
  { t: ls(8) + 0.7, x: KL.x, y: KL.y, s: 1.6 },
  { t: le(8), x: KL.x, y: KL.y, s: 1.7 },
  { t: at(9, "الوقاية") + 0.1, x: 0, y: 3450, s: 0.36 },
  { t: le(10), x: 0, y: 3500, s: 0.4 },
  { t: ls(11) + 0.8, x: 0, y: 3600, s: 0.3 },
  { t: ls(13) + 0.4, x: 0, y: 1500, s: 0.45, r: 2 },
  { t: at(13, "اليوم"), x: 0, y: 30, s: 1.1 },
  { t: VO.duration + 2.4, x: 0, y: 0, s: 1.25 },
];
const camAt = (t: number) => {
  let i = 0;
  while (i < CAM.length - 2 && t > CAM[i + 1].t) i++;
  const a = CAM[i], b = CAM[i + 1];
  const p = sCurve(cl01((t - a.t) / Math.max(0.01, b.t - a.t)));
  // the operator: a slight handheld drift on top of every move
  const dx = Math.sin(t * 0.7) * 6, dy = Math.cos(t * 0.53) * 5;
  return { x: lerp(a.x, b.x, p) + dx / Math.max(0.5, lerp(a.s, b.s, p)), y: lerp(a.y, b.y, p) + dy, s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), p)), r: lerp(a.r ?? 0, b.r ?? 0, p) };
};

/* ---------- geometry ---------- */
type P = [number, number];
const bez = (p0: P, p1: P, p2: P, p3: P, u: number): P => {
  const v = 1 - u;
  return [v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]];
};
// water ribbon: glass -> fork -> two kidneys (centre lines as bezier chains)
const MAIN: [P, P, P, P][] = [[[0, 240], [0, 800], [-180, 1200], [-60, 1700]], [[-60, 1700], [60, 2200], [0, 2500], [0, 2950]]];
const BR_L: [P, P, P, P][] = [[[0, 2950], [0, 3350], [-150, 3550], [KL.x + 40, KL.y - 140]]];
const BR_R: [P, P, P, P][] = [[[0, 2950], [0, 3350], [150, 3550], [KR.x - 40, KR.y - 140]]];
const sample = (chain: [P, P, P, P][], n: number) => {
  const pts: P[] = [];
  chain.forEach((c, ci) => { for (let i = ci ? 1 : 0; i <= n; i++) pts.push(bez(c[0], c[1], c[2], c[3], i / n)); });
  return pts;
};
const MAIN_PTS = sample(MAIN, 60);
const BRL_PTS = sample(BR_L, 50);
const BRR_PTS = sample(BR_R, 50);

// A bundle of thin parallel lines that waves along a centre line, drawn on up to `prog`.
const Ribbon: React.FC<{ pts: P[]; prog: number; t: number; lines: number; width: number; sw: number; hue?: string; seed: number }> = ({ pts, prog, t, lines, width, sw, hue = C.acc, seed }) => {
  if (prog <= 0) return null;
  const n = Math.max(2, Math.floor(pts.length * cl01(prog)));
  const paths: React.ReactNode[] = [];
  for (let k = 0; k < lines; k++) {
    const o = (k / (lines - 1) - 0.5) * 2; // -1..1
    let d = "";
    for (let i = 0; i < n; i++) {
      const [x, y] = pts[i];
      const [x2, y2] = pts[Math.min(pts.length - 1, i + 1)];
      const [x0, y0] = pts[Math.max(0, i - 1)];
      let nx = -(y2 - y0), ny = x2 - x0;
      const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
      const u = i / pts.length;
      const twist = Math.sin(u * 14 - t * 2.2 + seed) * 0.55 + Math.sin(u * 5 + t * 1.3 + k * 0.15) * 0.35;
      const off = o * width * (0.35 + 0.65 * Math.abs(twist)) + twist * width * 0.25;
      d += `${i ? "L" : "M"}${(x + nx * off).toFixed(1)} ${(y + ny * off).toFixed(1)}`;
    }
    const bright = 1 - Math.abs(o) * 0.75;
    paths.push(<path key={k} d={d} fill="none" stroke={Math.abs(o) < 0.12 ? C.accHot : hue} strokeWidth={sw * (0.6 + bright * 0.7)} opacity={0.25 + 0.7 * bright} strokeLinecap="round" />);
  }
  const head = pts[n - 1];
  return (
    <g filter="url(#g6)">
      {paths}
      {prog < 1 ? <circle cx={head[0]} cy={head[1]} r={width * 0.35} fill={C.accHot} opacity={0.9} /> : null}
    </g>
  );
};

const KIDNEY_PATH = "M88 6 C128 6 150 46 148 92 C146 140 120 174 82 172 C52 170 32 152 36 130 C39 114 56 108 58 92 C60 76 44 70 38 56 C30 32 52 6 88 6 Z";
const BODY_PATH = "M0 -1250 C130 -1250 210 -1150 210 -1010 C210 -880 140 -800 90 -770 L90 -700 C260 -680 420 -620 470 -480 C520 -330 520 80 470 420 C440 640 330 780 260 900 L230 1500 L-230 1500 L-260 900 C-330 780 -440 640 -470 420 C-520 80 -520 -330 -470 -480 C-420 -620 -260 -680 -90 -700 L-90 -770 C-140 -800 -210 -880 -210 -1010 C-210 -1150 -130 -1250 0 -1250 Z";

// Anatomical kidney: cortex, medullary pyramids fanning to the hilum, pelvis + ureter, artery and vein, rim light.
const Kidney: React.FC<{ id: string; cx: number; cy: number; flip?: boolean; draw: number; heat: number; dry: number; frame: number }> = ({ id, cx, cy, flip, draw, heat, dry, frame }) => {
  const k = 1.9;
  const fillA = dry > 0 ? `rgb(255, ${Math.round(150 - 55 * dry)}, ${Math.round(140 - 95 * dry)})` : "#ffa3a3";
  const fillB = dry > 0 ? `rgb(${Math.round(163 + 40 * dry)}, ${Math.round(50 + 20 * dry)}, 40)` : C.kidDeep;
  const pyr = Array.from({ length: 7 }, (_, i) => -70 + i * 23);
  return (
    <g transform={`translate(${cx} ${cy}) scale(${flip ? -k : k} ${k}) translate(-92 -89)`}>
      <defs>
        <radialGradient id={`kg${id}`} cx="0.62" cy="0.35" r="0.75">
          <stop offset="0" stopColor={fillA} />
          <stop offset="1" stopColor={fillB} />
        </radialGradient>
        <clipPath id={`kc${id}`}><path d={KIDNEY_PATH} /></clipPath>
      </defs>
      <g opacity={cl01((draw - 0.45) / 0.4)}>
        <path d={KIDNEY_PATH} fill={`url(#kg${id})`} opacity={0.55 + 0.4 * heat} />
        <g clipPath={`url(#kc${id})`}>
          {/* cortex band */}
          <path d={KIDNEY_PATH} transform="translate(92 89) scale(0.78) translate(-92 -89)" fill="none" stroke="#ffd0c9" strokeWidth={2} opacity={0.35} />
          {/* pyramids */}
          {pyr.map((a, i) => {
            const r = (a * Math.PI) / 180;
            const tip: P = [62 + Math.cos(r) * 22, 92 + Math.sin(r) * 22];
            const b1: P = [62 + Math.cos(r - 0.18) * 66, 92 + Math.sin(r - 0.18) * 66];
            const b2: P = [62 + Math.cos(r + 0.18) * 66, 92 + Math.sin(r + 0.18) * 66];
            return <path key={i} d={`M${tip[0]} ${tip[1]} L${b1[0]} ${b1[1]} Q${62 + Math.cos(r) * 74} ${92 + Math.sin(r) * 74} ${b2[0]} ${b2[1]} Z`} fill="#7a1f35" opacity={0.45} />;
          })}
          {/* dry mosaic: the tissue breaks into a dot grid as it dehydrates */}
          {dry > 0.05
            ? Array.from({ length: 13 * 15 }, (_, i) => {
                const gx = 14 + (i % 13) * 11, gy = 10 + Math.floor(i / 13) * 11.5;
                const n = random(`d${id}${i}`);
                const s = cl01(dry * 1.6 - n * 0.8) * 4.6;
                return s > 0.2 ? <rect key={i} x={gx - s / 2} y={gy - s / 2} width={s} height={s} fill="#ffcf8a" opacity={0.55} /> : null;
              })
            : null}
        </g>
        {/* pelvis, ureter, artery, vein at the hilum */}
        <path d="M58 92 C40 96 28 104 22 120 L18 190" fill="none" stroke="#ffe3a8" strokeWidth={5} opacity={0.75} strokeLinecap="round" />
        <path d="M56 84 C36 78 18 76 -6 74" fill="none" stroke={C.blood} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
        <path d="M58 100 C38 104 16 110 -6 112" fill="none" stroke={C.vein} strokeWidth={5} strokeLinecap="round" opacity={0.85} />
      </g>
      {/* rim light + draw-on outline */}
      <path d={KIDNEY_PATH} fill="none" stroke={C.accHot} strokeWidth={1.6} strokeDasharray={560} strokeDashoffset={560 * (1 - draw)} filter="url(#g4)" opacity={0.9} />
      <path d={KIDNEY_PATH} fill="none" stroke="#fff" strokeWidth={0.8} strokeDasharray="40 520" strokeDashoffset={-((frame * 4) % 560)} opacity={0.8 * heat} />
    </g>
  );
};

// Expanding sonar rings around something that lights up.
const Sonar: React.FC<{ x: number; y: number; t: number; from: number; r0: number; color?: string }> = ({ x, y, t, from, r0, color = C.acc }) => {
  if (t < from || t > from + 2.2) return null;
  return (
    <g>
      {[0, 0.35, 0.7].map((d, i) => {
        const p = cl01((t - from - d) / 1.4);
        return p > 0 && p < 1 ? <circle key={i} cx={x} cy={y} r={r0 * (1 + p * 1.8)} fill="none" stroke={color} strokeWidth={6 * (1 - p)} opacity={(1 - p) * 0.8} /> : null;
      })}
    </g>
  );
};

// Topographic contour field (the Spotify card background), animated.
const Contours: React.FC<{ x: number; y: number; t: number; o: number; scale: number }> = ({ x, y, t, o, scale }) => {
  if (o <= 0) return null;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${scale})`}>
      {Array.from({ length: 16 }, (_, i) => {
        const R = 140 + i * 46;
        let d = "";
        for (let a = 0; a <= 64; a++) {
          const th = (a / 64) * Math.PI * 2;
          const rr = R + Math.sin(th * 5 + t * 1.2 + i * 0.4) * (10 + i * 1.5) + Math.sin(th * 3 - t * 0.8) * 8;
          d += `${a ? "L" : "M"}${(Math.cos(th) * rr * 1.5).toFixed(1)} ${(Math.sin(th) * rr).toFixed(1)}`;
        }
        return <path key={i} d={d + "Z"} fill="none" stroke={C.acc} strokeWidth={2.2} opacity={0.5 - i * 0.025} />;
      })}
    </g>
  );
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = camAt(t);
  const fill = interpolate(t, [0.3, le(0)], [0.12, 0.78], { ...clamp, easing: Easing.out(Easing.cubic) }) * interpolate(t, [ls(1) - 0.2, ls(1) + 1.2], [1, 0.55], clamp)
    + interpolate(t, [ls(13), at(13, "خطوة")], [0, 0.4], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tMain = rise(t, ls(1) + 0.45, 1.35);
  const tBr = rise(t, ls(1) + 1.6, 1.0);
  const body = rise(t, ls(1) + 1.3, 1.6);
  const kOn = at(1, "الكليتين");
  const kidDraw = rise(t, kOn - 0.25, 0.8);
  const heat = 0.3 + 0.7 * win(t, kOn, le(2) + 0.6) + 0.6 * win(t, ls(5), le(5));
  const dry = interpolate(t, [ls(6), at(6, "تركيز")], [0, 1], clamp) * interpolate(t, [at(9, "الوقاية"), at(9, "الوقاية") + 1], [1, 0], clamp);
  const detail = interpolate(cam.s, [1.8, 2.6], [0, 1], clamp);
  const flowSlow = 1 - 0.75 * dry;
  const stones = rise(t, at(7, "حصوات") - 0.5, 1.0);
  const gauge = win(t, ls(8) + 0.3, le(8) + 0.2);
  const fn = interpolate(t, [at(8, "وظائف") - 0.2, at(8, "وظائف") + 1.2], [0.86, 0.3], { ...clamp, easing: sCurve });
  const shield = rise(t, at(9, "الوقاية") - 0.1, 1.1) * interpolate(t, [ls(11), ls(11) + 0.6], [1, 0.35], clamp);
  const credential = win(t, ls(4) + 0.6, le(5));
  const dimAll = interpolate(t, [ls(11), ls(11) + 0.6, ls(13), ls(13) + 0.6], [1, 0.32, 0.32, 1], clamp);
  const contourO = 0.55 * win(t, ls(4) + 0.4, le(5) + 0.2) + 0.45 * win(t, at(9, "الوقاية"), le(10));
  const sw = 2.2 / Math.max(0.45, cam.s);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="g4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={4} result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="g6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={7} result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <clipPath id="glassClip"><path d="M-150 -230 L150 -230 L120 230 L-120 230 Z" /></clipPath>
        <radialGradient id="halo"><stop offset="0" stopColor={C.acc} stopOpacity={0.45} /><stop offset="0.5" stopColor={C.acc} stopOpacity={0.12} /><stop offset="1" stopColor={C.acc} stopOpacity={0} /></radialGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.accHot} stopOpacity={0.95} /><stop offset="0.25" stopColor={C.acc} stopOpacity={0.85} /><stop offset="1" stopColor="#0b4f7a" stopOpacity={0.95} /></linearGradient>
        <linearGradient id="glassSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity={0} /><stop offset="0.5" stopColor="#fff" stopOpacity={0.35} /><stop offset="1" stopColor="#fff" stopOpacity={0} /></linearGradient>
      </defs>
      <g transform={`translate(540 960) rotate(${cam.r}) scale(${cam.s}) translate(${-cam.x} ${-cam.y})`} opacity={dimAll}>
        <Contours x={0} y={3900} t={t} o={contourO} scale={1.2} />
        {/* glass: halo, water with caustic surface and bubbles, sheen */}
        <circle cx={0} cy={0} r={420} fill="url(#halo)" opacity={0.8} />
        <g clipPath="url(#glassClip)">
          <path d={`M-200 ${230 - 460 * fill} Q -75 ${220 - 460 * fill + 12 * Math.sin(t * 5)} 0 ${230 - 460 * fill} T 200 ${230 - 460 * fill} V 260 H -200 Z`} fill="url(#water)" />
          {Array.from({ length: 14 }, (_, i) => {
            const y = 230 - ((t * 60 * (0.6 + random(`gb${i}`)) + random(`gy${i}`) * 400) % (460 * fill + 1));
            return <circle key={i} cx={-100 + random(`gx${i}`) * 200} cy={y} r={2 + random(`gr${i}`) * 5} fill="none" stroke="#e6fbff" strokeWidth={1.4} opacity={0.6} />;
          })}
        </g>
        <path d="M-150 -230 L150 -230 L120 230 L-120 230 Z" fill="none" stroke={C.ink} strokeWidth={3.5} filter="url(#g4)" />
        <rect x={-150} y={-230} width={300} height={460} fill="url(#glassSheen)" transform={`translate(${((t * 120) % 700) - 350} 0) skewX(-18)`} clipPath="url(#glassClip)" opacity={0.5} />
        <Sonar x={0} y={-60} t={t} from={ls(1) + 0.15} r0={60} />
        {/* body */}
        <g transform={`translate(${BODY.x} ${BODY.y})`}>
          <path d={BODY_PATH} fill="rgba(63,208,255,0.035)" stroke={C.accSoft} strokeWidth={5} strokeDasharray={9000} strokeDashoffset={9000 * (1 - body)} filter="url(#g4)" />
          <path d={BODY_PATH} fill="none" stroke={C.accHot} strokeWidth={3} strokeDasharray="120 8880" strokeDashoffset={-((frame * 30) % 9000)} opacity={0.6 * body} />
        </g>
        {/* the water: line ribbons from the glass down to the kidneys */}
        <Ribbon pts={MAIN_PTS} prog={tMain} t={t} lines={22} width={70} sw={sw} seed={0} />
        <Ribbon pts={BRL_PTS} prog={tBr} t={t} lines={14} width={46} sw={sw} seed={1.3} />
        <Ribbon pts={BRR_PTS} prog={tBr} t={t} lines={14} width={46} sw={sw} seed={2.1} />
        {/* shield of light ribbons around the body («الوقاية») */}
        <g transform={`translate(${BODY.x} ${BODY.y}) scale(1.16)`} opacity={shield}>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={BODY_PATH} fill="none" stroke={i === 2 ? C.accHot : C.acc} strokeWidth={4 - Math.abs(i - 2)} strokeDasharray={9000} strokeDashoffset={9000 * (1 - shield)} transform={`scale(${1 + (i - 2) * 0.012})`} filter="url(#g6)" opacity={1 - Math.abs(i - 2) * 0.25} />
          ))}
        </g>
        {/* kidneys */}
        <circle cx={KL.x} cy={KL.y} r={360} fill="url(#halo)" opacity={heat * kidDraw} />
        <circle cx={KR.x} cy={KR.y} r={360} fill="url(#halo)" opacity={heat * kidDraw} />
        <Sonar x={KL.x} y={KL.y} t={t} from={kOn} r0={190} />
        <Sonar x={KR.x} y={KR.y} t={t} from={kOn} r0={190} />
        <Sonar x={KL.x} y={KL.y} t={t} from={ls(5)} r0={190} />
        <Sonar x={KR.x} y={KR.y} t={t} from={ls(5)} r0={190} />
        <Kidney id="L" cx={KL.x} cy={KL.y} draw={kidDraw} heat={heat} dry={dry} frame={frame} />
        <Kidney id="R" cx={KR.x} cy={KR.y} flip draw={kidDraw} heat={heat} dry={0} frame={frame} />
        {/* inside the left kidney: blood in, clean blood back, waste down the ureter */}
        <g opacity={detail}>
          {Array.from({ length: 40 }, (_, i) => {
            const ph = ((frame * 0.012 * flowSlow + i / 40) % 1);
            const waste = i % 3 === 0;
            const x = KL.x + 140 - ph * 220 + Math.sin(ph * 8 + i) * 10;
            const y = KL.y - 95 + ph * 150;
            const isOut = waste && ph > 0.5;
            const wx = KL.x - 120 + (ph - 0.5) * 20;
            const wy = KL.y + 10 + (ph - 0.5) * 420;
            const col = waste ? (dry > 0.5 ? "#ff9a2e" : C.warn) : C.blood;
            return (
              <g key={i}>
                <circle cx={isOut ? wx : x} cy={isOut ? wy : y} r={waste ? 6 + 3 * dry : 7} fill={col} filter="url(#g4)" />
                <circle cx={(isOut ? wx : x) - 2} cy={(isOut ? wy : y) - 2} r={2} fill="#fff" opacity={0.7} />
              </g>
            );
          })}
          <circle cx={KL.x + 10} cy={KL.y - 20} r={48} fill="none" stroke={C.acc} strokeWidth={3} strokeDasharray="6 7" filter="url(#g4)" transform={`rotate(${frame * 2} ${KL.x + 10} ${KL.y - 20})`} />
          <circle cx={KL.x + 10} cy={KL.y - 20} r={30} fill="none" stroke={C.accHot} strokeWidth={1.5} strokeDasharray="3 5" transform={`rotate(${-frame * 3} ${KL.x + 10} ${KL.y - 20})`} />
        </g>
        {/* stones: faceted crystals with glints */}
        <g opacity={stones}>
          {[[-30, 95, 1], [-5, 112, 0.7], [-52, 118, 0.6], [-18, 76, 0.5]].map(([dx, dy, kk], i) => {
            const g = cl01(stones * 1.6 - i * 0.2) * (kk as number);
            return (
              <g key={i} transform={`translate(${KL.x + (dx as number)} ${KL.y + (dy as number)}) scale(${g * 1.6}) rotate(${i * 40 + t * 6})`}>
                <path d="M0 -12 L10 -4 L8 9 L-6 11 L-12 0 Z" fill="#f6e7b9" stroke={C.warn} strokeWidth={1.2} filter="url(#g4)" />
                <path d="M0 -12 L10 -4 L0 0 Z" fill="#fffbe9" opacity={0.85} />
                <path d="M-12 0 L0 0 L-6 11 Z" fill="#cdb173" opacity={0.8} />
                <path d="M-3 -16 L-2 -10 M-6 -13 L1 -13" stroke="#fff" strokeWidth={1} opacity={0.5 + 0.5 * Math.sin(t * 9 + i)} />
              </g>
            );
          })}
        </g>
        {/* function ring */}
        <g opacity={gauge} transform={`translate(${KL.x} ${KL.y}) rotate(-90)`}>
          <circle r={250} fill="none" stroke="#10283f" strokeWidth={20} />
          {Array.from({ length: 60 }, (_, i) => {
            const on = i / 60 < fn;
            const c = i / 60 > 0.6 ? "#3ddc97" : i / 60 > 0.42 ? C.warn : C.bad;
            const a = (i / 60) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * 236} y1={Math.sin(a) * 236} x2={Math.cos(a) * 264} y2={Math.sin(a) * 264} stroke={on ? c : "#163450"} strokeWidth={6} strokeLinecap="round" filter={on ? "url(#g4)" : undefined} />;
          })}
        </g>
        {/* credential mark */}
        <g opacity={credential} transform={`translate(0 ${3900 - 330}) scale(${0.85 + 0.15 * credential})`}>
          <rect x={-62} y={-62} width={124} height={124} rx={32} fill="none" stroke={C.acc} strokeWidth={5} filter="url(#g6)" />
          <path d="M0 -30 V30 M-30 0 H30" stroke={C.accHot} strokeWidth={13} strokeLinecap="round" filter="url(#g4)" />
        </g>
      </g>
    </svg>
  );
};

/* ---------- screen-space layers ---------- */
const KEY = ["الماء", "الكليتين", "الكلى", "تصفية", "الفضلات", "السوائل", "قسم", "الجفاف", "تركيز", "حصوات", "وظائف", "الوقاية", "بانتظام", "العطش", "البول", "ننتظر", "العلاج", "صحة", "غد", "خطوة"];
const isKey = (w: string) => KEY.some((k) => strip(w).includes(strip(k)));
const CHUNKS: Word[][] = [];
LINES.forEach((ln, li) => {
  let cur: Word[] = [];
  ln.words.forEach((w, i) => {
    cur.push(w);
    if (i === ln.words.length - 1 || cur.length >= 4 || /[،,.؟?:؛]$/.test(w.w)) { CHUNKS.push(cur); cur = []; }
  });
});

// A word that streaks in from the side with a light smear, then sharpens.
const StreakWord: React.FC<{ w: string; p: number; keyWord: boolean; spoken: boolean; dir: number }> = ({ w, p, keyWord, spoken, dir }) => {
  const off = (1 - p) * 90 * dir;
  const smear = (1 - p) * 0.9;
  const color = keyWord ? C.acc : spoken ? C.ink : C.dim;
  return (
    <span style={{ position: "relative", display: "inline-block", transform: `translateX(${off}px)`, opacity: 0.2 + 0.8 * p }}>
      {smear > 0.05
        ? [1, 2, 3].map((k) => (
            <span key={k} style={{ position: "absolute", inset: 0, transform: `translateX(${off * 0.35 * k}px)`, color, opacity: smear * (0.4 / k), filter: `blur(${4 * k}px)` }}>{w}</span>
          ))
        : null}
      <span style={keyWord ? { color: C.acc, WebkitTextStroke: `1.5px ${C.accHot}`, textShadow: `0 0 18px ${C.acc}, 0 0 50px ${C.acc}99`, filter: `blur(${(1 - p) * 4}px)` } : { color, filter: `blur(${(1 - p) * 6}px)`, textShadow: "0 6px 24px rgba(0,0,0,0.7)" }}>
        {w}
      </span>
    </span>
  );
};

const Kinetic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  const heroAt = at(9, "الوقاية");
  if (t >= heroAt - 0.05 && t < le(9) + 0.5) {
    const p = spring({ frame: frame - f(heroAt - 0.05), fps, config: { damping: 14, stiffness: 150 } });
    const o = interpolate(t, [le(9) + 0.2, le(9) + 0.5], [1, 0], clamp);
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div dir="rtl" style={{ fontFamily: "Cairo", fontWeight: 1000, fontSize: 220, color: "transparent", WebkitTextStroke: `4px ${C.accHot}`, opacity: Math.min(1, p * 1.3) * o, transform: `scale(${0.7 + 0.3 * p})`, textShadow: `0 0 40px ${C.acc}, 0 0 100px ${C.acc}` }}>الوقاية</div>
      </AbsoluteFill>
    );
  }
  // the reminder line is shown as a big two-line quote
  if (t >= ls(7 + 4) - 0.1 && t < le(12) + 0.4) {
    const lines = [LINES[11].words, LINES[12].words];
    return (
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
        {lines.map((ws, li) => (
          <div key={li} dir="rtl" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.25em", maxWidth: 960, fontFamily: "Cairo", fontWeight: 900, fontSize: li ? 92 : 78, lineHeight: 1.3 }}>
            {ws.map((w, i) => {
              const p = sCurve(cl01((t - w.start + 0.12) / 0.35));
              return <StreakWord key={i} w={w.w} p={p} keyWord={isKey(w.w)} spoken={t >= w.start} dir={li ? -1 : 1} />;
            })}
          </div>
        ))}
      </AbsoluteFill>
    );
  }
  const c = CHUNKS.find((ch, i) => t >= ch[0].start - 0.08 && t < Math.min(ch[ch.length - 1].end + 0.35, (CHUNKS[i + 1]?.[0].start ?? 1e9) - 0.06));
  if (!c) return null;
  const leave = interpolate(t, [c[c.length - 1].end + 0.2, c[c.length - 1].end + 0.35], [1, 0], clamp);
  return (
    <div dir="rtl" style={{ position: "absolute", top: 1300, left: 50, right: 50, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.26em", fontFamily: "Cairo", fontWeight: 900, fontSize: 92, lineHeight: 1.3, opacity: leave }}>
      {c.map((w, i) => (
        <StreakWord key={i} w={w.w} p={sCurve(cl01((t - w.start + 0.1) / 0.32))} keyWord={isKey(w.w)} spoken={t >= w.start} dir={1} />
      ))}
    </div>
  );
};

const Readouts: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const u = win(t, at(6, "ويجعل"), le(6) + 0.4);
  const conc = interpolate(t, [at(6, "تركيز") - 0.4, at(6, "تركيز") + 0.5], [0.1, 0.92], { ...clamp, easing: sCurve });
  const col = (p: number) => `hsl(${52 - 22 * p}, ${70 + 25 * p}%, ${82 - 42 * p}%)`;
  if (u <= 0) return null;
  return (
    <div style={{ position: "absolute", top: 1545, left: 170, right: 170, opacity: u, transform: `translateY(${(1 - u) * 30}px)` }}>
      <div style={{ position: "relative", height: 22, borderRadius: 11, background: `linear-gradient(90deg, ${col(0)}, ${col(0.5)}, ${col(1)})`, boxShadow: "0 0 30px rgba(255,180,71,0.45)" }}>
        <div style={{ position: "absolute", left: `calc(${conc * 100}% - 14px)`, top: -12, width: 28, height: 46, borderRadius: 14, border: `4px solid ${C.ink}`, boxShadow: "0 0 16px #fff" }} />
      </div>
      <div dir="rtl" style={{ marginTop: 12, textAlign: "center", fontFamily: "Cairo", fontWeight: 800, fontSize: 32, color: C.dim, letterSpacing: 1 }}>تركيز البول</div>
    </div>
  );
};

// Anamorphic flare: a thin horizontal light line on the big moments.
const Flares: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const hits = [ls(1) + 0.2, at(1, "الكليتين"), at(7, "حصوات"), at(9, "الوقاية")];
  return (
    <>
      {hits.map((h, i) => {
        const p = cl01((t - h) / 0.9);
        if (p <= 0 || p >= 1) return null;
        const o = Math.sin(p * Math.PI);
        return (
          <div key={i} style={{ position: "absolute", left: -200, right: -200, top: 958, height: 4, background: `linear-gradient(90deg, transparent, ${C.acc} 30%, #fff 50%, ${C.acc} 70%, transparent)`, opacity: o * 0.85, filter: "blur(1.5px)", transform: `scaleX(${0.4 + p})`, boxShadow: `0 0 40px 8px ${C.acc}66` }} />
        );
      })}
    </>
  );
};

const Atmosphere: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = camAt(t);
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(75% 45% at 50% 50%, rgba(26,106,147,0.25), transparent 70%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
        {Array.from({ length: 60 }, (_, i) => {
          const z = 0.4 + random(`z${i}`) * 1.2; // parallax depth
          const x = ((random(`x${i}`) * 1400 - cam.x * 0.1 * z + frame * 0.25 * z) % 1400 + 1400) % 1400 - 160;
          const y = ((random(`y${i}`) * 2300 - cam.y * 0.1 * z) % 2300 + 2300) % 2300 - 190;
          const r = (0.8 + random(`r${i}`) * 2.4) * z;
          return <circle key={i} cx={x} cy={y} r={r} fill={C.acc} opacity={0.15 + random(`o${i}`) * 0.45} style={{ filter: z > 1.2 ? "blur(2px)" : undefined }} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.75) 100%)" }} />
    </>
  );
};

const End: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const a = VO.duration + 0.5;
  if (t < a) return null;
  const p = rise(t, a, 0.7);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", background: `rgba(1,4,9,${p})` }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: C.accHot, boxShadow: `0 0 30px ${C.acc}, 0 0 80px ${C.acc}`, transform: `scaleX(${1 + 22 * rise(t, a + 0.5, 0.6)}) scaleY(${1 - 0.8 * rise(t, a + 0.5, 0.6)})`, opacity: 1 - rise(t, a + 1.0, 0.4) }} />
      <div style={{ position: "absolute", fontFamily: "Cairo", fontWeight: 900, fontSize: 68, color: C.ink, opacity: rise(t, a + 1.0, 0.5), textShadow: `0 0 30px ${C.acc}88` }}>@aymen.1303</div>
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; src: string; volume: number; len?: number }> = ({ at: s, src, volume, len = 1.5 }) => (
  <Sequence from={Math.max(0, f(s))} durationInFrames={f(len)} layout="none">
    <Audio src={staticFile(`kidney/sfx/${src}.mp3`)} volume={volume} />
  </Sequence>
);

export const KidneyJourney: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Atmosphere />
      {/* real shutter blur on the camera moves */}
      <CameraMotionBlur samples={4} shutterAngle={180}>
        <World />
      </CameraMotionBlur>
      <Flares />
      <Readouts />
      <Kinetic />
      <End />
      <Audio src={staticFile("kidney/vo.wav")} />
      <Audio src={staticFile("kidney/sfx/drone_calm_low_loop.mp3")} loop volume={(fr) => 0.07 * interpolate(fr, [0, 20, durationInFrames - 40, durationInFrames], [0, 1, 1, 0], clamp)} />
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
