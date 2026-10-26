import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { NavyBackground, TextShield } from "./NavyBackground";
import { HudFrame, ProgressTicks } from "./HudFrame";
import { AyahKaraoke } from "./AyahKaraoke";
import { TipCaption } from "./TipCaption";
import { LogoIntro, LogoOutro, worldFade } from "./LogoBrand";
import { StickFigure, POSE, mixPose, squash } from "./StickFigure";
import { DrawPath, Orb, Spotlight, circD, waveD } from "./LineArt";
import { E, P, env, hash, lerp, arNum } from "./anim";
import { C, FONT, FPS, FLOOR, useReligiousFonts } from "./theme";
import type { AyahData } from "./types";
import data from "./data/niam.json";

/**
 * Naseeha reel «شكر النعم» (talk audio from the video Ayman sent, cleaned; quote of An-Nahl 16:18 at the end).
 * Pages = data/niam.json (word times are VIDEO seconds, voice starts at 3.0 s after the logo intro).
 * Scenes: 0 أظهر/ستر (light from the lens, veil over the figure) · 1 لطيف ما قدّر (orb on a gentle path), كثير ما غفر
 * (coral dots turn gold and rise) · 2 حلمه (slow dial), كرمه (orbs fall into open hands) · 3 three blessings (home,
 * health, loved ones) · 4 Quran + iman (open book, glowing orb) · 5 hub of 8 blessings counted, all glow on «نعمة» ·
 * 6 worries straighten into gold, dua · 7 Quran quote: countless points (لا تحصوها). Light SFX on talk only, none on the verse.
 */
type Word = { t: string; on: number; off: number; k: string };
type Page = { kind: string; start: number; end: number; breaks: number[]; words: Word[] };
const D = data as unknown as { off: number; total: number; pages: Page[]; quran: { surah: number; ayah: number; words: string[] } };
const PG = D.pages;
const w = (p: number, i: number) => PG[p].words[i].on;
const NP = PG.length;
const SW = PG.map((p, k) => (k + 1 < NP ? PG[k + 1].start - 0.25 : D.total));
const lastWord = PG[NP - 1].words[PG[NP - 1].words.length - 1];
const OUTRO = lastWord.off + 0.25;
const pageAtT = (t: number) => {
  let k = 0;
  for (let i = 1; i < NP; i++) if (t >= SW[i - 1]) k = i;
  return k;
};
/** visibility of scene k: in a little before its first word, out a little before the next page */
const sceneOp = (t: number, k: number, pre = 0.45) =>
  env(t, PG[k].start - pre, 0.6, k + 1 < NP ? PG[k + 1].start - 0.5 : OUTRO - 0.2, 0.6);

// ---------- small line icons (centred on 0,0, about ±45 px) ----------
const ICON: Record<string, string> = {
  creed: "M12,-36 A38,38 0 1 0 12,36 A30,30 0 1 1 12,-36",
  tawhid: `${circD(0, 0, 34)} M0,-14 L0,14`,
  iman: "M0,30 C-50,-4 -36,-42 0,-16 C36,-42 50,-4 0,30",
  family:
    `${circD(-30, -14, 10)} ${circD(0, -20, 12)} ${circD(30, -14, 10)} M-46,26 Q-30,-2 -14,26 M-18,26 Q0,-8 18,26 M14,26 Q30,-2 46,26`,
  health: "M-50,0 L-22,0 L-13,-24 L-2,24 L9,-12 L16,0 L50,0",
  home: "M-40,32 L-40,-4 L0,-38 L40,-4 L40,32 Z M-12,32 L-12,8 L12,8 L12,32",
  peace: "M-44,-6 Q-22,-16 0,-6 T44,-6 M-44,12 L44,12",
  time: `${circD(0, 0, 36)} M0,0 L0,-24 M0,0 L17,9`,
  book: "M0,-22 Q-26,-34 -58,-26 L-58,30 Q-26,22 0,34 Q26,22 58,30 L58,-26 Q26,-34 0,-22 Z M0,-22 L0,34",
};
const Icon: React.FC<{ name: string; x: number; y: number; s?: number; u: number; op?: number; color?: string; width?: number }> = ({
  name,
  x,
  y,
  s = 1,
  u,
  op = 1,
  color = C.gold,
  width = 2.2,
}) =>
  op <= 0.001 ? null : (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={op}>
      <DrawPath d={ICON[name]} progress={u} color={color} width={width / s} glow />
    </g>
  );

const Label: React.FC<{ x: number; y: number; text: string; op: number; size?: number; color?: string }> = ({ x, y, text, op, size = 15, color = C.teal }) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor="middle" fill={color} opacity={op} style={{ fontFamily: FONT.mono, fontSize: size, letterSpacing: ".3em" }}>
      {text}
    </text>
  );

/** half-ellipse dome standing on the floor (the veil «ستر») */
const domeD = (rx: number, ry: number) => `M${540 - rx},${FLOOR} A${rx},${ry} 0 0 1 ${540 + rx},${FLOOR}`;
/** elliptic arc through angles a0..a1 (deg) */
const ellArcD = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number) => {
  let d = "";
  for (let a = a0; a <= a1 + 0.01; a += 3) {
    const r = (a * Math.PI) / 180;
    d += `${d ? " L" : "M"}${(cx + rx * Math.cos(r)).toFixed(1)},${(cy + ry * Math.sin(r)).toFixed(1)}`;
  }
  return d;
};

// cubic bezier point
const bez = (p: number[][], u: number) => {
  const m = 1 - u;
  return [0, 1].map((k) => m * m * m * p[0][k] + 3 * m * m * u * p[1][k] + 3 * m * u * u * p[2][k] + u * u * u * p[3][k]);
};

// ---------- the scene (everything is a pure function of t) ----------
const Scene: React.FC<{ t: number }> = ({ t }) => {
  // figure: pages 0-2 and 6
  const poses: [number, keyof typeof POSE][] = [
    [0, "stand"],
    [w(0, 6), "chest"], // جميل ما أظهر
    [w(0, 10), "bowed"], // قبيح ما ستر
    [w(1, 1), "open"], // لطيف ما قدّر
    [w(1, 5), "chest"], // كثير ما غفر
    [w(2, 1), "stand"], // حلمه
    [w(2, 3), "offer"], // كرمه
    [PG[6].start - 0.1, "slump"], // فاصبر على حالك
    [w(6, 3), "chest"], // وارض بمآلك
    [w(6, 5), "dua"], // واشكره
  ];
  let pose = POSE.stand;
  for (let i = 0; i < poses.length; i++) {
    const [t0, name] = poses[i];
    if (t >= t0) pose = i === 0 ? POSE[name] : mixPose(POSE[poses[i - 1][1]], POSE[name], P(t, t0, 0.9, E.io));
  }
  pose = { ...pose, sq: squash(t, poses.slice(1).map((p) => p[0])) };
  const figA = P(t, 3.2, 0.9, E.s) * (1 - P(t, PG[3].start - 0.55, 0.6, E.s));
  const figB = P(t, PG[6].start - 0.1, 0.7, E.s) * (1 - P(t, PG[7].start - 0.6, 0.6, E.s));
  const figOp = Math.max(figA, figB);
  const figS = 1.62;
  const floorU = Math.max(P(t, 3.2, 1.0, E.o) * (1 - P(t, PG[3].start - 0.5, 0.6, E.s)), P(t, PG[6].start - 0.1, 0.8, E.o) * (1 - P(t, PG[7].start - 0.5, 0.6, E.s)));

  // page 0: lens + light (أظهر) and veil (ستر)
  const s0 = env(t, PG[0].start - 0.2, 0.6, PG[1].start + 0.35, 0.7);
  const lens = P(t, 3.3, 1.2, E.io);
  const shine = env(t, w(0, 6), 0.7, PG[1].start - 0.4, 0.6);
  const veil = P(t, w(0, 12) - 0.15, 1.0, E.io);
  // page 1: gentle path (لطيف ما قدّر) + forgiven dots rising (كثير ما غفر)
  const s1 = sceneOp(t, 1);
  const pathPts = [
    [540, 230],
    [760, 330],
    [320, 470],
    [540, 600],
  ];
  const pathD = `M540,230 C760,330 320,470 540,600`;
  const orbU = P(t, w(1, 1), 1.4, E.io);
  const orbP = bez(pathPts, orbU);
  const forgive = P(t, w(1, 7) - 0.1, 1.2, E.o);
  const sinsIn = P(t, w(1, 5) - 0.6, 0.5, E.s);
  // page 2: dial (حلمه) + gifts falling (كرمه)
  const s2 = sceneOp(t, 2);
  const dialU = P(t, w(2, 1) - 0.2, 0.8, E.io);
  const handA = -90 + 40 * P(t, w(2, 1), 2.5, E.s);
  // page 3: three blessings
  const s34 = env(t, PG[3].start - 0.3, 0.6, PG[5].start - 0.5, 0.6);
  const toOrbit = P(t, PG[4].start - 0.3, 0.9, E.io);
  const three = [
    { name: "home", on: w(3, 2), x: 250, label: "01 · HOMELAND", a: -150 },
    { name: "health", on: w(3, 5), x: 540, label: "02 · HEALTH", a: -90 },
    { name: "family", on: w(3, 8), x: 830, label: "03 · FAMILY", a: -30 },
  ];
  // page 4: book + iman
  const bookU = P(t, w(4, 3) - 0.15, 1.1, E.io);
  const imanU = P(t, w(4, 4) - 0.1, 0.9, E.o);
  // page 5: hub of 8 blessings
  const s5 = env(t, PG[5].start - 0.35, 0.6, PG[6].start - 0.45, 0.45);
  const HX = 540, HY = 640, HR = 300;
  const hubIcons = ["creed", "tawhid", "iman", "family", "health", "home", "peace", "time"];
  const hubLabels = ["CREED", "TAWHID", "IMAN", "FAMILY", "HEALTH", "HOMELAND", "PEACE", "TIME"];
  let count = 0;
  for (let i = 0; i < 8; i++) if (t >= w(5, i)) count = i + 1;
  const allGlow = env(t, w(5, 8), 0.4, PG[6].start - 0.6, 0.6);
  // page 6: worries -> gold, thanks rising
  const calm = P(t, w(6, 3), 1.4, E.io);
  const worryOp = env(t, PG[6].start + 0.1, 0.7, PG[7].start - 0.6, 0.6);
  // page 7: Quran — countless points
  const s7 = env(t, PG[7].start - 0.3, 0.6, OUTRO - 0.1, 0.8);
  const spinStart = w(7, 2);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {/* floor */}
      {floorU > 0.001 && (
        <line x1={540 - 430 * floorU} x2={540 + 430 * floorU} y1={FLOOR} y2={FLOOR} stroke={C.mgold} strokeWidth={1.2} opacity={0.55 * floorU} />
      )}

      {/* ---- page 0 ---- */}
      {s0 > 0.001 && (
        <g opacity={s0}>
          <DrawPath d={circD(540, 440, 118)} progress={lens} width={1.6} opacity={0.85} />
          <DrawPath d={circD(540, 440, 146)} progress={lens} color={C.mgold} width={1} dash="2 9" opacity={0.55 * lens} />
          <circle cx={540} cy={440} r={110} fill={C.gold} opacity={0.1 * shine} style={{ filter: "blur(24px)" }} />
          <Orb x={540} y={440} r={10} opacity={lens * (0.5 + 0.5 * shine)} />
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const u = P(t, w(0, 6) + i * 0.025, 0.8, E.o) * shine;
            const r0 = 128, r1 = 128 + 70 * u;
            return (
              <line
                key={i}
                x1={540 + r0 * Math.cos(a)}
                y1={440 + r0 * Math.sin(a)}
                x2={540 + r1 * Math.cos(a)}
                y2={440 + r1 * Math.sin(a)}
                stroke={C.gold}
                strokeWidth={1.4}
                opacity={0.7 * u}
              />
            );
          })}
          {/* veil: a sheltering dome drawn over the figure, hiding the coral marks */}
          {Array.from({ length: 7 }, (_, i) => (
            <circle
              key={i}
              cx={500 + 90 * hash(i, 3)}
              cy={860 + 200 * hash(i, 4)}
              r={5}
              fill={C.coral}
              opacity={env(t, w(0, 10) - 0.2, 0.4, w(0, 12) + 0.2, 0.8) * 0.75}
            />
          ))}
          <DrawPath d={domeD(270, 560)} progress={veil} width={2} glow />
          <DrawPath d={domeD(300, 590)} progress={veil} color={C.mgold} width={1} dash="2 9" opacity={0.6 * veil} />
          <path d={`${domeD(270, 560)} Z`} fill={C.gold} opacity={0.06 * veil} />
        </g>
      )}

      {/* ---- page 1 ---- */}
      {s1 > 0.001 && (
        <g opacity={s1}>
          <DrawPath d={pathD} progress={P(t, PG[1].start - 0.3, 0.9, E.io)} color={C.mgold} width={1.3} dash="3 8" opacity={0.8} />
          <DrawPath d={pathD} progress={orbU} width={1.8} glow />
          <Orb x={orbP[0]} y={orbP[1]} r={9} opacity={P(t, w(1, 1) - 0.2, 0.3) * (1 - 0.6 * forgive)} />
          {Array.from({ length: 16 }, (_, i) => {
            const x0 = 540 + (hash(i, 5) - 0.5) * 380, y0 = 760 + hash(i, 6) * 330;
            const u = P(t, w(1, 7) - 0.1 + i * 0.03, 1.4, E.o);
            const col = u > 0.25 ? C.gold : C.coral;
            return (
              <circle key={i} cx={x0 + 20 * Math.sin(i + u * 3)} cy={y0 - 420 * u} r={lerp(5, 3, u)} fill={col} opacity={sinsIn * (1 - u) * 0.85} />
            );
          })}
        </g>
      )}

      {/* ---- page 2 ---- */}
      {s2 > 0.001 && (
        <g opacity={s2}>
          <DrawPath d={circD(540, 380, 110)} progress={dialU} width={1.6} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line key={i} x1={540 + 96 * Math.cos(a)} y1={380 + 96 * Math.sin(a)} x2={540 + 104 * Math.cos(a)} y2={380 + 104 * Math.sin(a)} stroke={C.mgold} strokeWidth={1.4} opacity={dialU * 0.8} />
            );
          })}
          <line
            x1={540}
            y1={380}
            x2={540 + 80 * Math.cos((handA * Math.PI) / 180)}
            y2={380 + 80 * Math.sin((handA * Math.PI) / 180)}
            stroke={C.gold}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={dialU}
          />
          <circle cx={540} cy={380} r={4} fill={C.gold} opacity={dialU} />
          {Array.from({ length: 6 }, (_, i) => {
            const u = P(t, w(2, 3) - 0.15 + i * 0.16, 1.1, E.io);
            const x = 540 + (i % 2 ? 1 : -1) * (14 + 10 * hash(i, 8));
            return u > 0 && u < 1 ? <Orb key={i} x={x} y={lerp(520, 850, u)} r={6} opacity={Math.sin(Math.PI * u)} /> : null;
          })}
        </g>
      )}

      {/* ---- pages 3–4: blessings, then Quran + iman ---- */}
      {s34 > 0.001 && (
        <g opacity={s34}>
          {three.map((b, i) => {
            const u = P(t, b.on - 0.15, 0.9, E.io);
            const ring = P(t, PG[3].start - 0.2 + i * 0.15, 1.0, E.io);
            const ox = 540 + 330 * Math.cos((b.a * Math.PI) / 180), oy = 720 + 330 * Math.sin((b.a * Math.PI) / 180) * 0.75;
            const x = lerp(b.x, ox, toOrbit), y = lerp(620, oy, toOrbit), s = lerp(1.25, 0.8, toOrbit);
            return (
              <g key={i}>
                <DrawPath d={circD(x, y, 92 * s)} progress={ring} color={u > 0.5 ? C.mgold : C.teal} width={1.1} opacity={lerp(0.45, 0.7, u)} />
                <Icon name={b.name} x={x} y={y} s={s} u={u} />
                <Label x={x} y={y + 132 * s} text={b.label} op={u * (1 - toOrbit)} />
              </g>
            );
          })}
          <DrawPath d={ellArcD(540, 720, 330, 247, -165, -15)} progress={toOrbit} color={C.mgold} width={1} dash="2 9" opacity={0.5 * toOrbit} />
          <circle cx={540} cy={760} r={150} fill={C.gold} opacity={0.08 * bookU} style={{ filter: "blur(30px)" }} />
          <Icon name="book" x={540} y={780} s={2.1} u={bookU} width={2.4} />
          {imanU > 0.001 && (
            <>
              {Array.from({ length: 9 }, (_, i) => {
                const a = -90 + (i - 4) * 14;
                const r0 = 30, r1 = 30 + 55 * imanU;
                const rr = (a * Math.PI) / 180;
                return (
                  <line key={i} x1={540 + r0 * Math.cos(rr)} y1={640 + r0 * Math.sin(rr)} x2={540 + r1 * Math.cos(rr)} y2={640 + r1 * Math.sin(rr)} stroke={C.gold} strokeWidth={1.2} opacity={0.6 * imanU} />
                );
              })}
              <Orb x={540} y={640} r={12 * imanU} opacity={imanU} />
            </>
          )}
          <Label x={540} y={1000} text="QURAN · IMAN" op={bookU * 0.9} />
        </g>
      )}

      {/* ---- page 5: the hub ---- */}
      {s5 > 0.001 && (
        <g opacity={s5}>
          <DrawPath d={circD(HX, HY, 78)} progress={P(t, PG[5].start - 0.3, 0.8, E.io)} width={1.8} glow />
          <DrawPath d={circD(HX, HY, HR)} progress={P(t, PG[5].start - 0.2, 1.4, E.io)} color={C.mgold} width={1} dash="2 10" opacity={0.5} />
          <circle cx={HX} cy={HY} r={76} fill={C.gold} opacity={0.22 * allGlow} style={{ filter: "blur(10px)" }} />
          {hubIcons.map((name, i) => {
            const a = ((-90 + i * 45) * Math.PI) / 180;
            const x = HX + HR * Math.cos(a), y = HY + HR * Math.sin(a);
            const u = P(t, w(5, i) - 0.12, 0.6, E.o);
            const act = env(t, w(5, i), 0.15, w(5, i) + 0.5, 0.6);
            const glow = Math.max(act, allGlow);
            return (
              <g key={i}>
                <DrawPath d={`M${HX + 80 * Math.cos(a)},${HY + 80 * Math.sin(a)} L${x - 52 * Math.cos(a)},${y - 52 * Math.sin(a)}`} progress={u} color={C.mgold} width={1.1} opacity={0.7} />
                <circle cx={x} cy={y} r={50} fill={C.gold} opacity={0.12 * glow} style={{ filter: "blur(10px)" }} />
                <DrawPath d={circD(x, y, 50)} progress={u} color={glow > 0.3 ? C.gold : C.mgold} width={1.3} />
                <Icon name={name} x={x} y={y} s={0.72} u={u} />
                <Label x={x} y={y + (Math.sin(a) > 0.5 ? 82 : -66)} text={hubLabels[i]} op={u * 0.85} size={13} />
              </g>
            );
          })}
          <text
            x={HX}
            y={HY + 22}
            textAnchor="middle"
            fill={allGlow > 0.5 ? "#FFF3CF" : C.gold}
            style={{ fontFamily: FONT.ar, fontWeight: 700, fontSize: 62, filter: `drop-shadow(0 0 ${8 + 14 * allGlow}px rgba(227,204,143,.6))` }}
          >
            {arNum(count)}
          </text>
          <Label x={HX} y={HY + 58} text="NI'MAH" op={P(t, PG[5].start, 0.6) * 0.9} size={12} />
          {/* on «نعمة»: a ring pulse */}
          {allGlow > 0.001 && (
            <circle cx={HX} cy={HY} r={78 + 260 * P(t, w(5, 8), 1.4, E.o)} fill="none" stroke={C.gold} strokeWidth={1.5} opacity={0.6 * (1 - P(t, w(5, 8), 1.4, E.o))} />
          )}
        </g>
      )}

      {/* ---- page 6: worries straighten into gold ---- */}
      {worryOp > 0.001 &&
        [0, 1, 2].map((i) => (
          <DrawPath
            key={i}
            d={waveD(380, 700, 560 + i * 42, lerp(20, 0, calm), 64, t * 2 + i)}
            progress={1}
            color={calm > 0.5 ? C.gold : C.coral}
            width={2}
            opacity={worryOp * lerp(0.85, 0.55, calm)}
          />
        ))}
      {figB > 0.001 &&
        Array.from({ length: 10 }, (_, i) => {
          const u = P(t, w(6, 5) + i * 0.22, 2.2, E.o);
          return u > 0 && u < 1 ? (
            <Orb key={i} x={540 + (hash(i, 21) - 0.5) * 120 + 18 * Math.sin(t * 2 + i)} y={lerp(690, 300, u)} r={lerp(6, 3, u)} opacity={Math.sin(Math.PI * u) * figB} />
          ) : null;
        })}

      {/* figure */}
      <Spotlight x={540} floor={FLOOR} opacity={0.55 * Math.max(env(t, w(0, 6), 1.0, PG[1].start, 1.0), env(t, w(6, 3), 1.2, PG[7].start - 0.5, 0.6))} />
      <StickFigure pose={pose} x={540} t={t} scale={figS} opacity={figOp} />

      {/* ---- page 7: countless points (لا تحصوها) ---- */}
      {s7 > 0.001 && (
        <g opacity={s7} transform={`rotate(${(t - PG[7].start) * 5} 540 640)`}>
          {Array.from({ length: 760 }, (_, i) => {
            const ta = spinStart + 1.9 * Math.pow(i / 760, 0.7);
            if (t < ta) return null;
            const r = 12.5 * Math.sqrt(i + 1);
            const a = i * 2.39996;
            const u = P(t, ta, 0.4, E.o);
            const edge = 1 - P(r, 250, 120, E.s) * 0.85;
            return (
              <circle
                key={i}
                cx={540 + r * Math.cos(a)}
                cy={640 + r * Math.sin(a) * 1}
                r={(1.3 + 1.6 * hash(i, 31)) * u}
                fill={hash(i, 32) > 0.25 ? C.gold : C.white}
                opacity={u * edge * (0.55 + 0.45 * Math.sin(t * 2 + i))}
              />
            );
          })}
          <Orb x={540} y={640} r={10} opacity={P(t, PG[7].start, 0.6)} />
        </g>
      )}
    </svg>
  );
};

// ---------- sound effects (talk part only; nothing over the verse) ----------
const SFX: [number, string, number][] = [
  [0.25, "sfx/calm/logo_sting_soft_bloom.mp3", 0.28],
  [w(0, 6) - 0.05, "sfx/calm/shimmer_m1.mp3", 0.2],
  [w(0, 12) - 0.25, "sfx/whoosh_soft_01.mp3", 0.12],
  [w(1, 1) - 0.1, "sfx/calm/swish_soft.mp3", 0.22],
  [w(1, 7) - 0.05, "sfx/sparkle_02.mp3", 0.12],
  [w(2, 1) - 0.05, "sfx/tick_soft_01.mp3", 0.18],
  [w(2, 3) + 0.25, "sfx/calm/drip_plink.mp3", 0.2],
  [w(2, 3) + 0.6, "sfx/calm/drip_drop.mp3", 0.16],
  [w(3, 2) - 0.05, "sfx/calm/mallet_celesta.mp3", 0.2],
  [w(3, 5) - 0.05, "sfx/calm/mallet_glock.mp3", 0.18],
  [w(3, 8) - 0.05, "sfx/calm/mallet_marimba.mp3", 0.2],
  [w(4, 3) - 0.1, "sfx/page_turn_02.mp3", 0.14],
  [w(4, 4), "sfx/chime_soft_01.mp3", 0.1],
  ...Array.from({ length: 8 }, (_, i) => [w(5, i) - 0.03, "sfx/calm/notify_mid_wood.mp3", 0.2] as [number, string, number]),
  [w(5, 8) - 0.05, "sfx/calm/pro_shimmer_m4.mp3", 0.22],
  [w(6, 3) - 0.05, "sfx/calm/shimmer_m3.mp3", 0.16],
  [OUTRO + 0.2, "sfx/calm/logo_sting_reverse_bloom.mp3", 0.24],
];
// guard: never a sound effect while the verse is recited
const QURAN_FROM = PG[NP - 1].start - 0.3, QURAN_TO = OUTRO;

export const NiamReel: React.FC = () => {
  const ready = useReligiousFonts();
  const t = useCurrentFrame() / FPS;
  if (!ready) return null;
  const k = pageAtT(t);
  const quranPage = PG[NP - 1];
  const ayahData: AyahData = {
    surah: D.quran.surah,
    surahName: "سورة النحل",
    en: "An-Nahl",
    ayat: [D.quran.ayah],
    off: D.off,
    total: D.total,
    pages: [
      {
        n: D.quran.ayah,
        first: true,
        num: false, // only part of the ayah is quoted -> no ۝ medallion
        lines: [quranPage.words.length],
        start: quranPage.start,
        end: quranPage.end,
        words: quranPage.words,
      },
    ],
  };
  const isQ = k === NP - 1;
  const wf = worldFade(t, OUTRO);
  const dust = 1 + 1.0 * env(t, w(5, 8), 0.4, PG[6].start, 0.8) + 0.8 * env(t, w(7, 2), 1.0, OUTRO, 1.0);
  return (
    <AbsoluteFill>
      <NavyBackground dustBoost={dust}>
        <AbsoluteFill style={{ opacity: wf }}>
          <Scene t={t} />
        </AbsoluteFill>
        <TextShield />
        <HudFrame
          left={isQ ? `QURAN · ${D.quran.surah}:${D.quran.ayah}` : k === 5 ? "FIG.02 — COUNT" : k >= 3 && k <= 4 ? "FIG.01 — NI'AM" : "NASEEHA · SHUKR"}
          category={isQ ? "القرآن الكريم" : "نصيحة"}
          topic={isQ ? "سورة النحل" : "شكر النعم"}
          title="SHUKR AN-NI'AM"
          counter={`0${k + 1} / 0${NP}`}
          outAt={OUTRO}
          switches={SW.slice(0, -1)}
        />
        <ProgressTicks count={NP} index={k} opacity={wf * (t > 2 ? 1 : 0)} />
        <div style={{ opacity: wf }}>
          {PG.slice(0, -1).map((p, i) => (
            <TipCaption
              key={i}
              words={p.words}
              start={p.start - 0.15}
              end={SW[i] + 0.1}
              variant={p.kind === "list" ? "sans" : "naskh"}
              boxes={p.kind === "list"}
              breaks={p.breaks}
              size={p.kind === "list" ? 54 : 60}
              y={1420}
            />
          ))}
          {isQ && (
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 1080,
                top: 1318,
                textAlign: "center",
                fontFamily: FONT.ar,
                fontWeight: 500,
                fontSize: 26,
                color: C.mgold,
                direction: "rtl",
                opacity: P(t, quranPage.start - 0.5, 0.5, E.s),
              }}
            >
              قال تعالى · سورة النحل : الآية {arNum(D.quran.ayah)}
            </div>
          )}
          <AyahKaraoke data={ayahData} top={1330} height={300} baseSize={68} endDim={1} />
        </div>
        <LogoIntro sub="NASEEHA · REMINDER" />
        <LogoOutro
          outroAt={OUTRO}
          total={D.total}
          cta={
            <>
              <span style={{ color: C.gold }}>الحمد لله</span> على كل نعمة
            </>
          }
        />
      </NavyBackground>
      <Audio src={staticFile("religious/niam/mix.wav")} />
      {SFX.filter(([at]) => at < QURAN_FROM || at >= QURAN_TO).map(([at, src, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} layout="none">
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const NIAM_TOTAL = D.total;
