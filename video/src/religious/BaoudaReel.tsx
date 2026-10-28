import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { NavyBackground, TextShield } from "./NavyBackground";
import { HudFrame, ProgressTicks } from "./HudFrame";
import { AyahKaraoke } from "./AyahKaraoke";
import { TipCaption } from "./TipCaption";
import { LogoIntro, LogoOutro, worldFade } from "./LogoBrand";
import { StickFigure, POSE } from "./StickFigure";
import { DrawPath, Orb, circD, ellD, waveD } from "./LineArt";
import { E, P, env, hash, lerp, arNum, clamp } from "./anim";
import { C, FONT, FPS, useReligiousFonts } from "./theme";
import type { AyahData } from "./types";
import data from "./data/baouda.json";

/**
 * «البعوضة» — science narration around Al-Baqarah 2:26 (voice only from the clip Ayman sent: music + effects removed,
 * light EQ/compression only, one 5 s silent pause shortened; quiet drone bed; NO sound effects).
 * v2 voice = average of the BS-RoFormer and htdemucs_ft vocal stems (Ayman picked it by ear; v1 used htdemucs alone).
 * Line-art mosquito that takes itself apart, then one close-up per part, each keyed to the narrator's words:
 * dot -> mosquito -> exploded parts -> compound eye -> CO2 / heat -> six stylets -> flight muscles -> legs on water ->
 * wing, veins, scales, halteres -> 600 beats/s -> parasite -> bite through the skin -> drinks 3× -> 300 eggs -> itch.
 */
type Word = { t: string; on: number; off: number; k: string };
type Page = { kind: string; group: number; start: number; end: number; breaks: number[]; words: Word[] };
const D = data as unknown as { off: number; total: number; pages: Page[] };
const PG = D.pages;
const NP = PG.length;
const SW = PG.map((p, k) => (k + 1 < NP ? PG[k + 1].start - 0.25 : D.total));
const OUTRO = PG[NP - 1].words[PG[NP - 1].words.length - 1].off + 0.25;
const NG = PG[NP - 1].group + 1;
const GS = Array.from({ length: NG }, (_, g) => PG.find((p) => p.group === g)!.start);
/** onset of the j-th key word ("g"/"c") of group g, in order */
const KW = Array.from({ length: NG }, (_, g) => PG.filter((p) => p.group === g).flatMap((p) => p.words.filter((x) => x.k).map((x) => x.on)));
const k = (g: number, j: number) => KW[g][Math.min(j, KW[g].length - 1)];
const pageAtT = (t: number) => {
  let i = 0;
  for (let n = 1; n < NP; n++) if (t >= SW[n - 1]) i = n;
  return i;
};
/** visibility of scene group g (a, b = extra groups it stays for) */
const G = (t: number, g: number, until = g + 1) => env(t, GS[g] - 0.45, 0.6, until < NG ? GS[until] - 0.45 : OUTRO - 0.2, 0.55);

const Label: React.FC<{ x: number; y: number; text: string; op: number; size?: number; color?: string; anchor?: "start" | "middle" | "end" }> = ({
  x,
  y,
  text,
  op,
  size = 15,
  color = C.teal,
  anchor = "middle",
}) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor={anchor} fill={color} opacity={op} style={{ fontFamily: FONT.mono, fontSize: size, letterSpacing: ".28em" }}>
      {text}
    </text>
  );
/** callout: dot on the part, thin line to a label */
const Callout: React.FC<{ x: number; y: number; lx: number; ly: number; text: string; u: number; color?: string }> = ({ x, y, lx, ly, text, u, color = C.gold }) =>
  u <= 0.001 ? null : (
    <g opacity={u}>
      <circle cx={x} cy={y} r={4} fill={color} />
      <DrawPath d={`M${x},${y} L${lx},${ly}`} progress={u} color={color} width={1} opacity={0.8} />
      <Label x={lx} y={ly + (ly < y ? -10 : 22)} text={text} op={u} color={color} size={14} anchor={lx < x ? "end" : lx > x ? "start" : "middle"} />
    </g>
  );

// ---------- the line-art mosquito (side view, head on the left; local coords around 0,0) ----------
type Part = "head" | "thorax" | "abdomen" | "legs" | "wings" | "proboscis";
const PARTS: Record<Part, { d: string[]; ex: [number, number] }> = {
  head: { d: [circD(-230, -40, 34), circD(-238, -48, 20), "M-250,-66 C-280,-120 -300,-150 -330,-170", "M-240,-70 C-250,-130 -260,-160 -270,-190", "M-262,-12 L-310,10"], ex: [-90, -40] },
  thorax: { d: [ellD(-120, -40, 80, 62)], ex: [0, -10] },
  abdomen: {
    d: [
      "M-50,-40 C40,-90 220,-60 330,10 C230,40 40,30 -50,-10 Z",
      "M10,-62 L20,10",
      "M70,-66 L78,18",
      "M130,-62 L136,22",
      "M190,-50 L195,22",
      "M250,-30 L252,20",
    ],
    ex: [90, 20],
  },
  legs: {
    d: [
      "M-150,10 L-230,90 L-330,250",
      "M-130,15 L-160,120 L-200,260",
      "M-110,18 L-40,110 L-60,270",
      "M-100,15 L40,90 L120,260",
      "M-95,14 L140,60 L300,250",
      "M-90,12 L200,40 L380,230",
    ],
    ex: [0, 70],
  },
  wings: { d: ["M-110,-95 C-20,-190 200,-230 330,-200 C210,-160 30,-110 -110,-95", "M-100,-90 C20,-150 200,-170 300,-150", "M-112,-92 C-60,-150 60,-200 160,-210"], ex: [30, -80] },
  proboscis: { d: ["M-256,-20 L-470,140", "M-262,-12 L-330,20"], ex: [-110, 40] },
};
const ORDER: Part[] = ["head", "thorax", "abdomen", "legs", "wings", "proboscis"];
const Mosquito: React.FC<{
  x: number;
  y: number;
  s: number;
  draw: number;
  explode?: number;
  hl?: Partial<Record<Part, number>>;
  op?: number;
  dim?: number; // 0..1 how much non-highlighted parts fade when something is highlighted
}> = ({ x, y, s, draw, explode = 0, hl = {}, op = 1, dim = 0.6 }) => {
  if (op <= 0.001) return null;
  const any = Math.max(0, ...Object.values(hl).map((v) => v ?? 0));
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
      {ORDER.map((name, i) => {
        const p = PARTS[name];
        const h = hl[name] ?? 0;
        const col = h > 0.5 ? C.gold : C.mgold;
        const o = lerp(1, 1 - dim, any) + (1 - lerp(1, 1 - dim, any)) * h;
        const u = clamp(draw * 1.4 - i * 0.08);
        return (
          <g key={name} transform={`translate(${p.ex[0] * explode},${p.ex[1] * explode})`} opacity={o}>
            {name === "wings" && <path d={p.d[0]} fill={C.gold} opacity={0.05 + 0.08 * h} />}
            {p.d.map((d, j) => (
              <DrawPath key={j} d={d} progress={u} color={col} width={(j === 0 ? 2.2 : 1.4) / s} glow={h > 0.5} />
            ))}
          </g>
        );
      })}
    </g>
  );
};

const hexGrid = (cx: number, cy: number, R: number, r: number) => {
  const pts: [number, number][] = [];
  for (let q = -12; q <= 12; q++)
    for (let w = -12; w <= 12; w++) {
      const px = cx + r * 1.75 * (q + w / 2), py = cy + r * 1.52 * w;
      if ((px - cx) ** 2 + (py - cy) ** 2 < (R - r) ** 2) pts.push([px, py]);
    }
  return pts;
};
const EYE = hexGrid(540, 600, 230, 17);
const hexD = (x: number, y: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${i ? "L" : "M"}${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ") + " Z";

const Scene: React.FC<{ t: number }> = ({ t }) => {
  // ---- 0 Quran: one small point, rings «فما فوقها» ----
  const g0 = G(t, 0);
  const ringU = P(t, PG[0].words[9].on - 0.2, 2.0, E.o);
  // ---- 1–2 the mosquito, exploded, parts named ----
  const g12 = env(t, GS[1] - 0.6, 0.6, GS[3] - 0.45, 0.55);
  const draw = P(t, k(1, 0) - 0.4, 2.2, E.io);
  const explode = P(t, k(1, 1) - 0.1, 1.4, E.io) * (1 - P(t, GS[3] - 0.9, 0.6, E.io));
  const hl12: Partial<Record<Part, number>> = {};
  ORDER.forEach((name, i) => (hl12[name] = env(t, k(2, i) - 0.05, 0.25, i < 5 ? k(2, i + 1) - 0.05 : GS[3] - 0.5, 0.35)));
  // ---- 3 eye ----
  const g3 = G(t, 3);
  const lens = (i: number) => P(t, k(3, 0) - 0.3 + (i / EYE.length) * 1.4, 0.4, E.o);
  const mover = P(t, k(3, 1) - 0.2, 1.8, E.io);
  const mx = lerp(300, 780, mover), my = 600 + 60 * Math.sin(mover * 6);
  // ---- 4 CO2 + heat ----
  const g4 = G(t, 4);
  const co2 = P(t, k(4, 0) - 0.4, 2.6, E.s);
  const palps = env(t, k(4, 3) - 0.1, 0.4, GS[5], 0.6);
  const heat = P(t, k(4, 4) - 0.2, 0.8, E.o);
  // ---- 5 six stylets ----
  const g5 = G(t, 5);
  const sheath = P(t, GS[5] - 0.2, 0.9, E.io);
  const bend = P(t, PG.find((p) => p.group === 5 && p.words[0].t.startsWith("يَنْثَنِي"))!.words[0].on, 1.0, E.io);
  const fan = P(t, k(5, 1) - 0.1, 0.8, E.o);
  const sty = [
    { lab: "SAW", on: k(5, 3), col: C.gold, serr: true, dy: -45 },
    { lab: "SAW", on: k(5, 3) + 0.2, col: C.gold, serr: true, dy: 45 },
    { lab: "BLADE", on: k(5, 4), col: C.white, serr: false, dy: -22 },
    { lab: "BLADE", on: k(5, 4) + 0.2, col: C.white, serr: false, dy: 22 },
    { lab: "BLOOD", on: k(5, 5), col: C.coral, serr: false, dy: -68 },
    { lab: "SALIVA", on: k(5, 6), col: C.teal, serr: false, dy: 68 },
  ];
  // ---- 6 thorax ----
  const g6 = G(t, 6);
  const thU = P(t, GS[6] - 0.2, 0.9, E.io);
  const muscles = P(t, k(6, 0) - 0.1, 1.6, E.io);
  const spir = P(t, k(6, 3) - 0.1, 0.8, E.o);
  // ---- 7 leg on water ----
  const g7 = G(t, 7);
  const legU = P(t, GS[7] - 0.2, 1.0, E.io);
  const claw = P(t, k(7, 0) - 0.1, 0.6, E.o);
  const water = P(t, k(7, 1) - 0.3, 0.8, E.o);
  // ---- 8–9 wing ----
  const g89 = env(t, GS[8] - 0.45, 0.6, GS[10] - 0.45, 0.55);
  const wingU = P(t, GS[8] - 0.2, 1.2, E.io);
  const hair = env(t, k(8, 1) - 0.1, 0.4, k(8, 2), 0.5);
  const veins = P(t, k(8, 2) - 0.1, 0.9, E.io);
  const scales = P(t, k(8, 3) - 0.1, 1.0, E.o);
  const halt = P(t, k(8, 4) - 0.1, 0.7, E.o);
  const level = P(t, k(8, 5) - 0.1, 1.0, E.o);
  const beatU = P(t, GS[9] - 0.1, 0.4);
  const flap = beatU * Math.sin(t * 2 * Math.PI * 7.5) * lerp(4, 16, P(t, k(9, 0), 1.0));
  const count = Math.round(600 * P(t, k(9, 0) - 0.3, 1.1, E.o));
  const buzz = P(t, k(9, 2) - 0.1, 0.4);
  // ---- 10 parasite ----
  const g10 = G(t, 10);
  const mite = P(t, k(10, 0) - 0.1, 0.6, E.o);
  const suck = P(t, k(10, 1) - 0.1, 0.4);
  // ---- 11 bite / 14 itch: the skin ----
  const skinOp = Math.max(G(t, 11), G(t, 14));
  const stab = P(t, k(11, 0) - 0.1, 1.4, E.io) * (1 - P(t, GS[12] - 0.45, 0.5));
  const saw = P(t, k(11, 1) - 0.1, 2.0);
  const nerve = P(t, k(11, 2) - 0.1, 0.6, E.o);
  const saliva = P(t, k(14, 0) - 0.1, 0.8, E.o);
  const hist = P(t, k(14, 1) - 0.1, 1.2, E.o);
  const itch = P(t, k(14, 2) - 0.1, 0.8, E.o);
  // ---- 12–13 abdomen: ×3, eggs, water out, female only ----
  const g1213 = env(t, GS[12] - 0.45, 0.6, GS[14] - 0.45, 0.55);
  const swell = P(t, k(12, 0) - 0.1, 1.4, E.io);
  const eggs = P(t, k(13, 1) - 0.6, 1.6, E.o);
  const drops = P(t, k(13, 3) - 0.2, 1.6);
  const female = P(t, k(13, 4) - 0.1, 0.6, E.o);
  // ---- 15 subhan Allah ----
  const g15 = G(t, 15);
  const glow = P(t, k(15, 0) - 0.1, 1.2, E.o);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {/* 0: one point (the smallest), rings for «فما فوقها» */}
      {g0 > 0.001 && (
        <g opacity={g0}>
          <Orb x={540} y={600} r={lerp(4, 7, P(t, PG[0].words[8].on - 0.3, 0.8))} opacity={P(t, PG[0].start - 0.3, 1.2)} />
          <circle cx={540} cy={600} r={30 + 4 * Math.sin(t * 1.4)} fill="none" stroke={C.mgold} strokeWidth={1} strokeDasharray="2 8" opacity={0.6 * P(t, PG[0].start, 1.5)} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={540} cy={600} r={30 + i * 70 * ringU} fill="none" stroke={C.mgold} strokeWidth={1} opacity={0.6 * ringU * (1 - i * 0.18)} />
          ))}
        </g>
      )}

      {/* 1–2: the mosquito, taken apart, parts named */}
      {g12 > 0.001 && (
        <g opacity={g12}>
          <Mosquito x={560} y={620} s={1.25} draw={draw} explode={explode} hl={hl12} dim={0.55} />
          {(
            [
              ["head", 560 - 230 * 1.25 - 90 * 1.25 * explode, 620 - 40 * 1.25 - 40 * 1.25 * explode, 150, 330, "HEAD"],
              ["thorax", 560 - 120 * 1.25, 620 - 40 * 1.25 - 12 * explode, 440, 330, "THORAX"],
              ["abdomen", 560 + 140 * 1.25 + 90 * 1.25 * explode, 620 - 30 * 1.25 + 20 * explode, 900, 470, "ABDOMEN"],
              ["legs", 560 - 40 * 1.25, 620 + 120 * 1.25 + 70 * 1.25 * explode, 820, 1080, "LEGS × 6"],
              ["wings", 560 + 120 * 1.25 + 30 * explode, 620 - 190 * 1.25 - 80 * 1.25 * explode, 860, 230, "WINGS × 2"],
              ["proboscis", 560 - 420 * 1.25 - 110 * 1.25 * explode, 620 + 100 * 1.25 + 40 * explode, 160, 1050, "PROBOSCIS"],
            ] as [Part, number, number, number, number, string][]
          ).map(([name, x, y, lx, ly, text]) => (
            <Callout key={name} x={x} y={y} lx={lx} ly={ly} text={text} u={P(t, k(2, ORDER.indexOf(name)) - 0.1, 0.5, E.o) * (1 - P(t, GS[3] - 0.6, 0.4))} />
          ))}
        </g>
      )}

      {/* 3: the compound eye — hundreds of tiny lenses */}
      {g3 > 0.001 && (
        <g opacity={g3}>
          <DrawPath d={circD(540, 600, 236)} progress={P(t, GS[3] - 0.3, 1.0, E.io)} width={2} glow />
          {EYE.map(([x, y], i) => {
            const u = lens(i);
            const near = Math.max(0, 1 - Math.hypot(x - mx, y - my) / 90) * env(t, k(3, 1) - 0.2, 0.3, k(3, 1) + 1.8, 0.4);
            return <path key={i} d={hexD(x, y, 15)} fill={C.gold} fillOpacity={0.05 + 0.35 * near} stroke={near > 0.3 ? C.gold : C.mgold} strokeWidth={1} opacity={u * (0.55 + 0.45 * near)} />;
          })}
          <Label x={540} y={880} text="LENSES · OMMATIDIA" op={P(t, k(3, 0), 0.6)} color={C.gold} />
          {mover > 0 && mover < 1 && <circle cx={mx} cy={my} r={7} fill={C.white} opacity={0.9} />}
        </g>
      )}

      {/* 4: your breath (CO2) reaches its palps; then the heat of your body */}
      {g4 > 0.001 && (
        <g opacity={g4}>
          <StickFigure pose={POSE.stand} x={230} t={t} scale={1.05} floor={1060} />
          <Mosquito x={820} y={520} s={0.5} draw={1} hl={{ head: palps }} dim={0.3} />
          {Array.from({ length: 26 }, (_, i) => {
            const u = clamp((co2 * 1.6 - (i / 26) * 0.9) * 1.2);
            if (u <= 0 || u >= 1) return null;
            const x = lerp(270, 700, u), y = 700 - 140 * u + 30 * Math.sin(i * 1.7 + t * 1.5);
            return <circle key={i} cx={x} cy={y + (hash(i, 2) - 0.5) * 50} r={4 + 3 * hash(i, 3)} fill="none" stroke={C.teal} strokeWidth={1.4} opacity={Math.sin(Math.PI * u) * 0.9} />;
          })}
          <Label x={360} y={600} text="CO₂" op={co2 * (1 - heat)} color={C.teal} size={18} />
          {[0, 1, 2].map((i) => (
            <DrawPath key={i} d={waveD(150, 310, 610 - i * 26, 8, 40, t * 3 + i)} progress={1} color={C.coral} width={1.8} opacity={heat * 0.8} />
          ))}
          <Label x={230} y={530} text="HEAT" op={heat} color={C.coralText} />
          <Callout x={820 - 270 * 0.5} y={520 - 140 * 0.5} lx={700} ly={330} text="PALPS · ANTENNAE" u={palps} />
        </g>
      )}

      {/* 5: the proboscis is six needles */}
      {g5 > 0.001 && (
        <g opacity={g5}>
          {/* sheath (labium) bends down out of the way */}
          <DrawPath d={`M900,600 Q${lerp(540, 620, bend)},${lerp(600, 840, bend)} ${lerp(180, 520, bend)},${lerp(600, 980, bend)}`} progress={sheath} color={C.mgold} width={6} opacity={0.75} />
          <Label x={lerp(540, 640, bend)} y={lerp(640, 900, bend)} text="SHEATH" op={bend * (1 - fan * 0.4)} color={C.mgold} />
          {sty.map((s, i) => {
            const u = P(t, k(5, 1) - 0.1 + i * 0.06, 0.8, E.o);
            const id = P(t, s.on - 0.1, 0.5, E.o);
            const y = 600 + s.dy * fan;
            const teeth = s.serr ? Array.from({ length: 22 }, (_, j) => `L${880 - j * 32},${y + (j % 2 ? -7 : 0)}`).join(" ") : `L180,${y}`;
            return (
              <g key={i} opacity={u}>
                <path d={`M900,${y} ${teeth}`} fill="none" stroke={id > 0.5 ? s.col : C.mgold} strokeWidth={id > 0.5 ? 2.2 : 1.4} style={id > 0.5 ? { filter: `drop-shadow(0 0 5px ${s.col})` } : undefined} />
                <Label x={940} y={y + 5} text={s.lab} op={id} color={s.col === C.white ? C.grey : s.col} anchor="start" size={13} />
                {(s.lab === "BLOOD" || s.lab === "SALIVA") &&
                  id > 0.5 &&
                  Array.from({ length: 6 }, (_, j) => {
                    const ph = ((t * 0.6 + j / 6) % 1);
                    const x = s.lab === "BLOOD" ? lerp(180, 900, ph) : lerp(900, 180, ph);
                    return <circle key={j} cx={x} cy={y} r={4} fill={s.col} opacity={0.9} />;
                  })}
              </g>
            );
          })}
          <Label x={540} y={430} text={`${arNum(6)} · STYLETS`} op={fan} color={C.gold} size={18} />
        </g>
      )}

      {/* 6: the flight engine — muscles fill the thorax; spiracles */}
      {g6 > 0.001 && (
        <g opacity={g6}>
          <DrawPath d={ellD(540, 600, 230, 180)} progress={thU} width={2.2} glow />
          {Array.from({ length: 9 }, (_, i) => {
            const x = 380 + i * 40;
            const h = Math.sqrt(Math.max(0, 1 - ((x - 540) / 230) ** 2)) * 170;
            const u = P(t, k(6, 0) - 0.1 + i * 0.08, 0.8, E.io);
            return <line key={i} x1={x} x2={x} y1={600 - h * u} y2={600 + h * u} stroke={C.coral} strokeWidth={14} strokeLinecap="round" opacity={0.18 + 0.25 * muscles * (0.7 + 0.3 * Math.sin(t * 10 + i))} />;
          })}
          {Array.from({ length: 4 }, (_, i) => {
            const y = 470 + i * 85;
            const w = Math.sqrt(Math.max(0, 1 - ((y - 600) / 180) ** 2)) * 210;
            const u = P(t, k(6, 2) - 0.1 + i * 0.1, 0.8, E.io);
            return <line key={i} x1={540 - w * u} x2={540 + w * u} y1={y} y2={y} stroke={C.coral} strokeWidth={10} strokeLinecap="round" opacity={0.15 + 0.2 * muscles} />;
          })}
          {[[330, 560], [340, 660], [745, 560], [740, 660]].map(([x, y], i) => (
            <g key={i} opacity={spir}>
              <circle cx={x} cy={y} r={9 + 3 * Math.sin(t * 2.4 + i)} fill="none" stroke={C.teal} strokeWidth={2} />
              <circle cx={x} cy={y} r={3} fill={C.teal} />
            </g>
          ))}
          <Label x={540} y={840} text="FLIGHT MUSCLES" op={muscles} color={C.coralText} />
          <Label x={540} y={360} text="SPIRACLES" op={spir} color={C.teal} />
        </g>
      )}

      {/* 7: a long leg, fine claws, standing on water without getting wet */}
      {g7 > 0.001 && (
        <g opacity={g7}>
          <DrawPath d="M200,300 L470,520 L640,700 L860,960" progress={legU} width={3} glow />
          {[[470, 520], [640, 700]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={7} fill="none" stroke={C.gold} strokeWidth={1.6} opacity={legU} />
          ))}
          <DrawPath d="M860,960 C880,975 890,990 878,1004 M860,960 C840,978 840,995 852,1006" progress={claw} color={C.gold} width={2.2} glow />
          <Callout x={866} y={985} lx={700} ly={1080} text="CLAWS" u={claw} />
          {water > 0.001 && (
            <g opacity={water}>
              <path d={`M120,1010 L780,1010 Q866,${1010 + 22 * water} 950,1010 L1000,1010`} fill="none" stroke={C.teal} strokeWidth={2} />
              {[0, 1, 2, 3].map((i) => (
                <circle key={i} cx={760 + i * 70 + 10 * Math.sin(t + i)} cy={1000 - 6 * i} r={6 + 2 * i} fill="none" stroke={C.teal} strokeWidth={1.4} opacity={0.7} />
              ))}
              <Label x={300} y={1050} text="WATER-REPELLENT" op={water} color={C.teal} />
            </g>
          )}
        </g>
      )}

      {/* 8–9: the wing — membrane thinner than a hair, veins, scales, halteres; up to 600 beats a second */}
      {g89 > 0.001 && (
        <g opacity={g89} transform={`rotate(${flap} 230 620)`}>
          <path d="M230,620 C380,430 760,380 920,450 C760,560 420,640 230,620 Z" fill={C.gold} opacity={0.06} />
          <DrawPath d="M230,620 C380,430 760,380 920,450 C760,560 420,640 230,620 Z" progress={wingU} width={2} glow />
          {["M240,615 C420,520 700,460 900,455", "M250,612 C420,560 640,520 820,500", "M260,610 C400,590 560,580 700,560", "M300,560 L320,600", "M520,480 L540,560", "M700,445 L700,520"].map((d, i) => (
            <DrawPath key={i} d={d} progress={veins} color={veins > 0.5 ? C.gold : C.mgold} width={1.3} opacity={0.4 + 0.6 * veins} />
          ))}
          {Array.from({ length: 34 }, (_, i) => {
            const u = i / 34;
            const x = lerp(250, 900, u), y = lerp(612, 455, u) - 4 + 8 * hash(i, 4);
            return <ellipse key={i} cx={x} cy={y} rx={5} ry={2.4} fill={C.gold} opacity={scales * (0.5 + 0.5 * hash(i, 5))} />;
          })}
          <DrawPath d="M150,700 L1000,690" progress={hair} color={C.grey} width={9} opacity={0.5} />
          <Label x={575} y={735} text="HAIR" op={hair} color={C.grey} />
          <Label x={575} y={380} text="MEMBRANE" op={P(t, k(8, 0), 0.5) * (1 - hair * 0.5)} color={C.gold} />
          <Label x={700} y={660} text="VEINS · SCALES" op={veins * scales} color={C.mgold} />
        </g>
      )}
      {g89 > 0.001 && (
        <g opacity={g89}>
          {/* halteres behind the wing */}
          {[0, 1].map((i) => (
            <g key={i} opacity={halt}>
              <line x1={250 + i * 30} y1={700} x2={250 + i * 30 + 10} y2={770} stroke={C.gold} strokeWidth={2} />
              <circle cx={250 + i * 30 + 10} cy={778} r={9} fill="none" stroke={C.gold} strokeWidth={2} />
            </g>
          ))}
          <Label x={300} y={830} text="HALTERES" op={halt} color={C.gold} />
          {/* balance level */}
          <g opacity={level} transform={`rotate(${12 * (1 - level) * Math.sin(t * 3)} 540 330)`}>
            <line x1={420} x2={660} y1={330} y2={330} stroke={C.teal} strokeWidth={1.4} />
            <circle cx={540} cy={330} r={6} fill={C.teal} />
          </g>
          {/* 600 beats a second, the buzz */}
          {beatU > 0.001 && (
            <>
              <text x={540} y={300} textAnchor="middle" fill={C.gold} opacity={beatU} style={{ fontFamily: FONT.ar, fontWeight: 700, fontSize: 86, filter: "drop-shadow(0 0 10px rgba(227,204,143,.5))" }}>
                {arNum(count)}
              </text>
              <Label x={540} y={340} text="BEATS / SECOND" op={beatU} color={C.gold} />
              {[0, 1, 2, 3].map((i) => {
                const u = ((t * 1.2 + i / 4) % 1);
                return <path key={i} d={`M${940 - 40},${520 - 70 - u * 60} A${70 + u * 60},${70 + u * 60} 0 0 1 ${940 - 40},${520 + 70 + u * 60}`} transform={`translate(${u * 20},0)`} fill="none" stroke={C.gold} strokeWidth={1.4} opacity={buzz * (1 - u) * 0.8} />;
              })}
            </>
          )}
        </g>
      )}

      {/* 10: a parasite smaller than her, clinging and sucking */}
      {g10 > 0.001 && (
        <g opacity={g10}>
          <Mosquito x={540} y={640} s={1.05} draw={P(t, GS[10] - 0.3, 1.2)} hl={{ abdomen: mite }} dim={0.5} />
          {mite > 0.001 && (
            <g transform={`translate(${540 + 150 * 1.05},${640 + 20 * 1.05}) scale(${mite})`}>
              <circle r={13} fill={C.coral} opacity={0.9} />
              {[-1, 1].map((sx) => [0, 1, 2].map((j) => <line key={`${sx}${j}`} x1={0} y1={0} x2={sx * 22} y2={-10 + j * 10} stroke={C.coral} strokeWidth={2} />))}
            </g>
          )}
          {suck > 0.001 &&
            Array.from({ length: 5 }, (_, j) => {
              const u = (t * 0.8 + j / 5) % 1;
              return <circle key={j} cx={lerp(540 + 60, 540 + 150 * 1.05, u)} cy={640 + 10 + 10 * Math.sin(u * 6)} r={3} fill={C.coral} opacity={suck * Math.sin(Math.PI * u)} />;
            })}
          <Callout x={540 + 150 * 1.05} y={640 + 8} lx={820} ly={900} text="PARASITE" u={mite} color={C.coralText} />
        </g>
      )}

      {/* 11 / 14: the skin — bite (saws through, nerves barely feel), then saliva, histamine, itch */}
      {skinOp > 0.001 && (
        <g opacity={skinOp}>
          {[0, 1, 2].map((i) => (
            <DrawPath key={i} d={`M80,${760 + i * 90} C360,${745 + i * 90} 720,${775 + i * 90} 1000,${760 + i * 90}`} progress={P(t, GS[11] - 0.3 + i * 0.15, 1.0, E.io)} color={i ? C.mgold : C.coralText} width={i ? 1.2 : 2} opacity={0.75} />
          ))}
          <path d="M80,1010 C360,990 720,1030 1000,1010 L1000,1050 C720,1070 360,1030 80,1050 Z" fill={C.coral} opacity={0.14 * P(t, GS[11], 1)} />
          <Label x={150} y={735} text="SKIN" op={P(t, GS[11], 0.6)} color={C.coralText} />
          <Label x={150} y={1090} text="CAPILLARY" op={P(t, GS[11] + 0.3, 0.6)} color={C.coralText} />
          {/* stylets going in */}
          {stab > 0.001 &&
            [-12, -4, 4, 12].map((dx, i) => (
              <line key={i} x1={540 + dx * 0.6} y1={300} x2={540 + dx * (1 + stab)} y2={lerp(560, 1020, stab)} stroke={i < 2 ? C.gold : C.white} strokeWidth={2} opacity={0.9 * (1 - P(t, GS[12] - 0.6, 0.4))} />
            ))}
          {saw > 0.001 && saw < 1 && stab > 0.3 && (
            <g opacity={Math.sin(Math.PI * saw)}>
              {[0, 1, 2, 3, 4].map((i) => (
                <path key={i} d={`M${520 - i * 3},${780 + i * 40} l-10,6 l10,6`} fill="none" stroke={C.gold} strokeWidth={1.6} />
              ))}
            </g>
          )}
          {/* a nerve: the signal barely starts */}
          <DrawPath d="M700,840 C760,800 820,860 900,820 C950,795 990,830 1020,810" progress={nerve} color={C.teal} width={1.6} opacity={0.8 * (1 - P(t, GS[12] - 0.5, 0.4))} />
          {nerve > 0.5 && <circle cx={lerp(700, 780, ((t * 0.7) % 1))} cy={835 - 20 * ((t * 0.7) % 1)} r={4} fill={C.teal} opacity={0.5 * (1 - ((t * 0.7) % 1)) * (1 - P(t, GS[12] - 0.5, 0.4))} />}
          <Label x={880} y={780} text="NERVE" op={nerve * (1 - P(t, GS[12] - 0.5, 0.4))} color={C.teal} />
          {/* 14: saliva stays, histamine, itch */}
          {saliva > 0.001 &&
            Array.from({ length: 12 }, (_, i) => (
              <circle key={i} cx={540 + (hash(i, 7) - 0.5) * 140} cy={860 + (hash(i, 8) - 0.5) * 120} r={4} fill={C.teal} opacity={saliva * 0.85} />
            ))}
          {hist > 0.001 &&
            [0, 1, 2, 3, 4].map((i) => {
              const u = ((t * 0.5 + i / 5) % 1) * hist;
              return <circle key={i} cx={540 + (hash(i, 9) - 0.5) * 220} cy={880 + (hash(i, 10) - 0.5) * 140} r={10 + 50 * u} fill="none" stroke={C.coral} strokeWidth={1.4} opacity={(1 - u) * 0.8} />;
            })}
          <Label x={540} y={1150} text="HISTAMINE" op={hist} color={C.coralText} />
          {itch > 0.001 && [0, 1, 2].map((i) => <DrawPath key={i} d={waveD(380, 700, 700 - i * 30, 12, 34, t * 6 + i)} progress={1} color={C.coral} width={2} opacity={itch * 0.85} />)}
        </g>
      )}

      {/* 12–13: the abdomen drinks 3×, blood becomes up to 300 eggs, extra water out, only the female bites */}
      {g1213 > 0.001 && (
        <g opacity={g1213}>
          <path d={`M300,620 C420,${620 - 90 * lerp(1, 1.7, swell)} 760,${620 - 70 * lerp(1, 1.7, swell)} 880,620 C760,${620 + 70 * lerp(1, 1.7, swell)} 420,${620 + 90 * lerp(1, 1.7, swell)} 300,620 Z`} fill={C.coral} opacity={0.08 + 0.14 * swell * (1 - eggs)} stroke={C.gold} strokeWidth={2} />
          {[0, 1, 2].map((i) => (
            <text key={i} x={360 + i * 60} y={400} fill={C.coralText} opacity={P(t, k(12, 0) + i * 0.25, 0.4)} style={{ fontFamily: FONT.mono, fontSize: 30 }}>
              ●
            </text>
          ))}
          <Label x={720} y={400} text={`× ${arNum(3)}  WEIGHT`} op={P(t, k(12, 1), 0.5)} color={C.coralText} size={20} />
          {Array.from({ length: 60 }, (_, i) => {
            const cols = 12, row = Math.floor(i / cols), col = i % cols;
            const u = P(t, k(13, 1) - 0.6 + i * 0.02, 0.4, E.o);
            return <ellipse key={i} cx={410 + col * 33 + (row % 2) * 16} cy={545 + row * 34} rx={11} ry={6} fill="none" stroke={C.gold} strokeWidth={1.4} opacity={u * (0.6 + 0.4 * eggs)} />;
          })}
          <text x={540} y={880} textAnchor="middle" fill={C.gold} opacity={eggs} style={{ fontFamily: FONT.ar, fontWeight: 700, fontSize: 64 }}>
            {arNum(Math.round(300 * eggs))}
          </text>
          <Label x={540} y={915} text="EGGS" op={eggs} color={C.gold} />
          {drops > 0.001 &&
            [0, 1, 2, 3].map((i) => {
              const u = clamp(drops * 1.5 - i * 0.18);
              return u > 0 && u < 1 ? <circle key={i} cx={900 + 40 * u} cy={620 + 260 * u * u} r={7} fill="none" stroke={C.teal} strokeWidth={1.6} opacity={Math.sin(Math.PI * u)} /> : null;
            })}
          <Label x={960} y={980} text="WATER" op={drops * (1 - female)} color={C.teal} anchor="end" />
          {female > 0.001 && (
            <g opacity={female}>
              <rect x={360} y={240} width={360} height={60} rx={12} fill="none" stroke={C.gold} strokeWidth={1.4} />
              <Label x={540} y={278} text="FEMALE ONLY" op={1} color={C.gold} size={18} />
            </g>
          )}
        </g>
      )}

      {/* 15: subhan Allah */}
      {g15 > 0.001 && (
        <g opacity={g15}>
          <circle cx={540} cy={600} r={160} fill={C.gold} opacity={0.08 * glow} style={{ filter: "blur(30px)" }} />
          <Mosquito x={560} y={620} s={0.8} draw={1} hl={{ head: glow, thorax: glow, abdomen: glow, legs: glow, wings: glow, proboscis: glow }} dim={0} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={540} cy={600} r={260 + i * 40 * glow} fill="none" stroke={C.gold} strokeWidth={1} opacity={0.4 * glow * (1 - i * 0.25)} />
          ))}
        </g>
      )}
    </svg>
  );
};

const LEFT = ["QURAN · 2:26", "FIG.01 — ANATOMY", "FIG.01 — ANATOMY", "FIG.02 — EYE", "FIG.03 — SENSES", "FIG.04 — PROBOSCIS", "FIG.05 — THORAX", "FIG.06 — LEGS", "FIG.07 — WING", "FIG.08 — WINGBEAT", "FIG.09 — PARASITE", "FIG.10 — BITE", "FIG.11 — BLOOD", "FIG.12 — EGGS", "FIG.13 — ITCH", "SUBHAN ALLAH"];

export const BaoudaReel: React.FC = () => {
  const ready = useReligiousFonts();
  const t = useCurrentFrame() / FPS;
  if (!ready) return null;
  const pi = pageAtT(t);
  const g = PG[pi].group;
  const wf = worldFade(t, OUTRO);
  const q = PG[0];
  const ayah: AyahData = {
    surah: 2,
    surahName: "سورة البقرة",
    en: "Al-Baqarah",
    ayat: [26],
    off: D.off,
    total: D.total,
    pages: [
      {
        n: 26,
        first: true,
        num: false, // only the first part of the ayah is recited -> no ۝ medallion
        lines: [5, 10],
        start: q.start,
        end: q.end,
        words: q.words.map((x) => ({ ...x, k: x.t === "ٱللَّهَ" || x.t.startsWith("بَعُوضَةً") ? "g" : "" })),
      },
    ],
  };
  const isQ = g === 0;
  return (
    <AbsoluteFill>
      <NavyBackground dustBoost={1 + 0.7 * env(t, GS[15], 0.8, OUTRO, 0.8)}>
        <AbsoluteFill style={{ opacity: wf }}>
          <Scene t={t} />
        </AbsoluteFill>
        <TextShield />
        <HudFrame
          left={LEFT[g] ?? ""}
          category={isQ ? "القرآن الكريم" : "آيات في الخلق"}
          topic={isQ ? "سورة البقرة" : "البعوضة"}
          title="AL-BA'UDAH · 2 : 26"
          counter={`${String(g + 1).padStart(2, "0")} / ${NG}`}
          outAt={OUTRO}
          switches={GS.slice(1).map((s) => s - 0.25)}
        />
        <ProgressTicks count={NG} index={g} opacity={wf * (t > 2 ? 1 : 0)} />
        <div style={{ opacity: wf }}>
          {/* the verse: Amiri Quran karaoke, verified text, surah:ayah above (fades out when the narration starts) */}
          <div style={{ opacity: 1 - P(t, SW[0] - 0.3, 0.3, E.s) }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 1080,
                top: 1290,
                textAlign: "center",
                fontFamily: FONT.ar,
                fontWeight: 500,
                fontSize: 26,
                color: C.mgold,
                direction: "rtl",
                opacity: P(t, q.start - 0.5, 0.5, E.s),
              }}
            >
              قال تعالى · سورة البقرة : الآية {arNum(26)}
            </div>
            <AyahKaraoke data={ayah} top={1320} height={360} baseSize={66} endDim={1} />
          </div>
          {PG.slice(1).map((p, i) => (
            <TipCaption key={i} words={p.words} start={p.start - 0.15} end={SW[i + 1] + 0.1} variant="sans" breaks={p.breaks} size={54} y={1420} />
          ))}
        </div>
        <LogoIntro sub="QURAN · SCIENCE" />
        <LogoOutro
          outroAt={OUTRO}
          total={D.total}
          cta={
            <>
              اكتب في التعليقات: <span style={{ color: C.gold }}>سبحان الله</span>
              <div style={{ marginTop: 34, fontSize: 40, fontWeight: 500, color: C.grey }}>
                انشرها لتنال <span style={{ color: C.gold }}>الأجر</span>
              </div>
            </>
          }
        />
      </NavyBackground>
      <Audio src={staticFile("religious/baouda/mix_ens.wav")} />
    </AbsoluteFill>
  );
};

export const BAOUDA_TOTAL = D.total;
