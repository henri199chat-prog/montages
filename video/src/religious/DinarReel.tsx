import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { NavyBackground, TextShield } from "./NavyBackground";
import { HudFrame, ProgressTicks } from "./HudFrame";
import { TipCaption } from "./TipCaption";
import { LogoIntro, LogoOutro, worldFade } from "./LogoBrand";
import { StickFigure, POSE, mixPose, squash } from "./StickFigure";
import { DrawPath, Orb, Spotlight, circD, ellD } from "./LineArt";
import { E, P, env, lerp, arNum } from "./anim";
import { C, FONT, FPS, FLOOR, useReligiousFonts } from "./theme";
import data from "./data/dinar.json";

/**
 * Hadith talk reel «تعس عبد الدينار» (original audio of the clip Ayman sent, mastered; speaker not named until confirmed).
 * Hadiths shown: «تعس عبد الدينار» (al-Bukhari 2887) and «اجتنبوا السبع الموبقات … الشرك بالله» (al-Bukhari 2766, Muslim 89).
 * Each shot is made from the previous one (playbook rule, religious/README.md §15):
 * heart -> the world (globe) fills it -> moon/sun orbit it (sleeps and wakes on it) -> the heart splits (shirk) ->
 * the globe becomes a dinar, a figure bowed under it -> signs -> halal (gold) and haram (coral) streams into the hands ->
 * the haram stream is cut -> balance: anger vs pleasure of Allah (light from above) -> money in and out only through the
 * gold channel -> seven destroying sins, the first one lights up with the split heart again.
 * No SFX on the hadith pages; a few soft ones on the talk.
 */
type Word = { t: string; on: number; off: number; k: string };
type Page = { kind: string; source: string | null; start: number; end: number; breaks: number[]; words: Word[] };
const D = data as unknown as { off: number; total: number; pages: Page[] };
const PG = D.pages;
const NP = PG.length;
const w = (p: number, i: number) => PG[p].words[i].on;
const SW = PG.map((p, k) => (k + 1 < NP ? PG[k + 1].start - 0.25 : D.total));
const OUTRO = PG[NP - 1].words[PG[NP - 1].words.length - 1].off + 0.25;
const pageAtT = (t: number) => {
  let k = 0;
  for (let i = 1; i < NP; i++) if (t >= SW[i - 1]) k = i;
  return k;
};
/** visible from page a (a little before its first word) until just before page b starts */
const span = (t: number, a: number, b: number, pre = 0.4) =>
  env(t, PG[a].start - pre, 0.6, b < NP ? PG[b].start - 0.45 : OUTRO - 0.2, 0.55);

const HX = 540, HY = 560, HS = 3.6;
const HEART = `M${HX},${HY + 30 * HS} C${HX - 50 * HS},${HY - 4 * HS} ${HX - 36 * HS},${HY - 42 * HS} ${HX},${HY - 16 * HS} C${HX + 36 * HS},${HY - 42 * HS} ${HX + 50 * HS},${HY - 4 * HS} ${HX},${HY + 30 * HS}`;
const HEART_L = `M${HX},${HY - 16 * HS} C${HX - 36 * HS},${HY - 42 * HS} ${HX - 50 * HS},${HY - 4 * HS} ${HX},${HY + 30 * HS}`;
const HEART_R = `M${HX},${HY - 16 * HS} C${HX + 36 * HS},${HY - 42 * HS} ${HX + 50 * HS},${HY - 4 * HS} ${HX},${HY + 30 * HS}`;
const CRACK = `M${HX},${HY - 16 * HS} L${HX - 14},${HY - 20} L${HX + 12},${HY + 20} L${HX - 10},${HY + 60} L${HX},${HY + 30 * HS}`;

const Label: React.FC<{ x: number; y: number; text: string; op: number; size?: number; color?: string }> = ({ x, y, text, op, size = 15, color = C.teal }) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor="middle" fill={color} opacity={op} style={{ fontFamily: FONT.mono, fontSize: size, letterSpacing: ".3em" }}>
      {text}
    </text>
  );

/** the world: circle with meridians and parallels */
const Globe: React.FC<{ x: number; y: number; r: number; u: number; color: string; op?: number; rot: number }> = ({ x, y, r, u, color, op = 1, rot }) =>
  r < 1 || op <= 0.001 ? null : (
    <g opacity={op}>
      <DrawPath d={circD(x, y, r)} progress={u} color={color} width={1.8} glow />
      {[0.35, 0.75].map((k, i) => (
        <DrawPath key={`m${i}`} d={ellD(x, y, r * k * Math.abs(Math.cos(rot + i)), r)} progress={u} color={color} width={1} opacity={0.7} />
      ))}
      {[-0.5, 0, 0.5].map((k, i) => (
        <DrawPath key={`p${i}`} d={ellD(x, y + r * k, r * Math.sqrt(1 - k * k), r * 0.12)} progress={u} color={color} width={1} opacity={0.6} />
      ))}
    </g>
  );

/** a dinar: double ring with a dotted inner ring */
const Coin: React.FC<{ x: number; y: number; r: number; u: number; color?: string; op?: number }> = ({ x, y, r, u, color = C.gold, op = 1 }) =>
  op <= 0.001 ? null : (
    <g opacity={op}>
      <circle cx={x} cy={y} r={r} fill={color} opacity={0.08 * u} />
      <DrawPath d={circD(x, y, r)} progress={u} color={color} width={2.2} glow />
      <DrawPath d={circD(x, y, r * 0.8)} progress={u} color={color} width={1} dash="2 7" opacity={0.8 * u} />
    </g>
  );

// a point on a cubic bezier
const bez = (p: number[][], u: number) => {
  const m = 1 - u;
  return [0, 1].map((k) => m * m * m * p[0][k] + 3 * m * m * u * p[1][k] + 3 * m * u * u * p[2][k] + u * u * u * p[3][k]);
};
const bezD = (p: number[][]) => `M${p[0][0]},${p[0][1]} C${p[1][0]},${p[1][1]} ${p[2][0]},${p[2][1]} ${p[3][0]},${p[3][1]}`;
const HANDS = [540, 860];
const HALAL = [[900, 230], [880, 520], [640, 640], HANDS];
const HARAM = [[180, 230], [200, 520], [440, 640], HANDS];

const Scene: React.FC<{ t: number }> = ({ t }) => {
  // ---- heart + world (pages 0-2), then the world becomes the dinar (page 3) ----
  const heartOp = span(t, 0, 3, 0.5) * 1;
  const heartU = P(t, PG[0].start - 0.3, 1.4, E.io);
  const globeR = lerp(0, 120, P(t, w(0, 5) - 0.1, 1.6, E.o)) * (1 + 0.04 * Math.sin(t * 1.3));
  const fill = P(t, w(0, 7), 1.0, E.io); // «ملأت قلبك»: the world presses on the heart
  const shirk = P(t, w(2, 4) - 0.1, 0.9, E.io);
  const split = 18 * P(t, w(2, 4) + 0.3, 0.8, E.o);
  const moonU = P(t, w(1, 6) - 0.1, 0.8, E.o), sunU = P(t, w(1, 8) - 0.1, 0.8, E.o);
  const orbitA = (t - w(1, 6)) * 0.9;
  const toCoin = P(t, PG[3].start - 0.35, 1.0, E.io);
  // ---- dinar + bowed figure (page 3), signs (page 4) ----
  const coinOp = span(t, 3, 5, 0.35);
  const coinY = lerp(HY, 380, toCoin), coinR = lerp(120, 105, toCoin);
  const chainU = P(t, w(3, 7) - 0.1, 0.9, E.io);
  const signs = P(t, w(4, 3) - 0.1, 0.7, E.o);
  // ---- streams (pages 5-6) ----
  const streamsOp = span(t, 5, 7);
  const halalU = P(t, w(5, 6) - 0.2, 0.9, E.io), haramU = P(t, w(5, 8) - 0.2, 0.9, E.io);
  const cut = P(t, w(6, 4) - 0.1, 0.7, E.o); // «لا يمكن» -> barrier on the haram stream
  const lockPulse = env(t, w(6, 10), 0.2, w(6, 10) + 0.8, 0.8);
  // ---- balance (page 7) ----
  const scaleOp = span(t, 7, 8, 0.35);
  const scaleU = P(t, PG[7].start - 0.3, 1.0, E.io);
  const tilt = lerp(0, 11, P(t, w(7, 3) - 0.1, 1.2, E.io)); // سخط: the haram pan sinks
  const leftU = P(t, w(7, 1) - 0.1, 0.7, E.o), rightU = P(t, w(7, 5) - 0.1, 0.7, E.o);
  const rays = P(t, w(7, 7) - 0.1, 1.0, E.o);
  // ---- channel in / out (page 9) ----
  const chanOp = span(t, 9, 10);
  const inU = P(t, w(9, 3) - 0.1, 0.9, E.io), outU = P(t, w(9, 7) - 0.1, 0.9, E.io);
  const IN = [[540, 200], [560, 420], [520, 620], [540, 820]];
  const OUT = [[560, 880], [700, 900], [860, 980], [960, 1100]];
  // ---- seven (pages 10-11) ----
  const sevenOp = span(t, 10, NP);
  const firstGlow = P(t, w(11, 4) - 0.1, 0.8, E.o);

  // figure: page 3 bowed, pages 5-6 receiving / upright, page 8-9 sincere
  const poses: [number, keyof typeof POSE][] = [
    [0, "kneelBow"],
    [PG[5].start - 0.4, "offer"],
    [w(6, 1), "stand"],
    [w(6, 4), "chest"],
    [PG[8].start - 0.3, "chest"],
    [w(9, 3), "offer"],
    [w(9, 7), "open"],
  ];
  let pose = POSE.kneelBow;
  for (let i = 0; i < poses.length; i++) {
    const [t0, name] = poses[i];
    if (t >= t0) pose = i === 0 ? POSE[name] : mixPose(POSE[poses[i - 1][1]], POSE[name], P(t, t0, 0.9, E.io));
  }
  pose = { ...pose, sq: squash(t, poses.slice(1).map((p) => p[0])) };
  const figOp = Math.max(span(t, 3, 4, 0.1) * P(t, w(3, 6) - 0.4, 0.7, E.s), span(t, 5, 7), span(t, 8, 10));
  const floorOp = figOp;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {floorOp > 0.001 && <line x1={110} x2={970} y1={FLOOR} y2={FLOOR} stroke={C.mgold} strokeWidth={1.2} opacity={0.5 * floorOp} />}

      {/* heart + world */}
      {heartOp > 0.001 && (
        <g opacity={heartOp * (1 - toCoin)}>
          <circle cx={HX} cy={HY} r={150} fill={shirk > 0.5 ? C.coral : C.gold} opacity={0.06 + 0.06 * fill} style={{ filter: "blur(30px)" }} />
          {shirk < 0.01 ? (
            <DrawPath d={HEART} progress={heartU} color={C.gold} width={2.4} glow />
          ) : (
            <>
              <g transform={`translate(${-split},0)`}>
                <DrawPath d={HEART_L} progress={1} color={shirk > 0.5 ? C.coral : C.gold} width={2.4} glow />
              </g>
              <g transform={`translate(${split},0)`}>
                <DrawPath d={HEART_R} progress={1} color={shirk > 0.5 ? C.coral : C.gold} width={2.4} glow />
              </g>
              <DrawPath d={CRACK} progress={shirk} color={C.coral} width={2.2} />
            </>
          )}
          <Globe x={HX} y={HY - 10} r={globeR * lerp(1, 1.08, fill)} u={P(t, w(0, 5) - 0.1, 1.0, E.io)} color={shirk > 0.5 || fill > 0.5 ? C.coral : C.gold} rot={t * 0.6} />
          {/* sleeps on it (moon) and wakes on it (sun): both orbit the world */}
          {moonU > 0.001 && (
            <g opacity={moonU * span(t, 1, 3, 0.2)}>
              <path
                d="M10,-26 A28,28 0 1 0 10,26 A21,21 0 1 1 10,-26"
                transform={`translate(${HX + 250 * Math.cos(Math.PI + orbitA)},${HY - 10 + 120 * Math.sin(Math.PI + orbitA)})`}
                fill="none"
                stroke={C.mgold}
                strokeWidth={1.8}
              />
            </g>
          )}
          {sunU > 0.001 && (
            <g opacity={sunU * span(t, 1, 3, 0.2)} transform={`translate(${HX + 250 * Math.cos(orbitA)},${HY - 10 + 120 * Math.sin(orbitA)})`}>
              <circle r={14} fill="none" stroke={C.gold} strokeWidth={1.8} />
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return <line key={i} x1={20 * Math.cos(a)} y1={20 * Math.sin(a)} x2={28 * Math.cos(a)} y2={28 * Math.sin(a)} stroke={C.gold} strokeWidth={1.6} />;
              })}
            </g>
          )}
          {moonU > 0.001 && <DrawPath d={ellD(HX, HY - 10, 250, 120)} progress={1} color={C.mgold} width={1} dash="2 9" opacity={0.4 * moonU * span(t, 1, 3, 0.2)} />}
        </g>
      )}

      {/* the world becomes the dinar; a figure bowed under it */}
      {coinOp > 0.001 && (
        <g opacity={coinOp}>
          <Coin x={540} y={coinY} r={coinR * lerp(1, 0.55, signs)} u={1} color={chainU > 0.5 ? C.coral : C.gold} />
          <Label x={540} y={coinY + 6} text="DINAR" op={toCoin * (1 - signs)} size={16} color={C.mgold} />
          {/* tether from the coin to the bowed figure */}
          <DrawPath d={`M540,${coinY + coinR} L540,700`} progress={chainU} color={C.coral} width={1.6} dash={chainU > 0.99 ? "6 6" : undefined} opacity={0.8 * (1 - signs)} />
          {/* «علامات»: the signs list frame */}
          {signs > 0.001 &&
            [0, 1, 2].map((i) => (
              <g key={i} opacity={P(t, w(4, 3) + i * 0.18, 0.5, E.o)}>
                <rect x={330} y={560 + i * 80} width={420} height={54} rx={10} fill="none" stroke={C.mgold} strokeWidth={1.1} opacity={0.7} />
                <circle cx={712} cy={587 + i * 80} r={6} fill={i === 0 ? C.gold : C.mgold} opacity={i === 0 ? 0.95 : 0.5} />
                <line x1={360} x2={lerp(360, 680 - i * 90, P(t, w(4, 3) + 0.2 + i * 0.18, 0.6))} y1={587 + i * 80} y2={587 + i * 80} stroke={C.mgold} strokeWidth={2} opacity={0.5} />
              </g>
            ))}
          <Label x={540} y={530} text="SIGNS" op={signs} />
        </g>
      )}

      {/* halal (gold) and haram (coral) streams into the hands */}
      {streamsOp > 0.001 && (
        <g opacity={streamsOp}>
          <DrawPath d={bezD(HALAL)} progress={halalU} color={C.gold} width={2} glow />
          <DrawPath d={bezD(HARAM)} progress={haramU} color={C.coral} width={2} opacity={lerp(1, 0.35, cut)} />
          <Label x={900} y={205} text="HALAL" op={halalU} color={C.gold} />
          <Label x={180} y={205} text="HARAM" op={haramU} color={C.coralText} />
          {Array.from({ length: 10 }, (_, i) => {
            const isHaram = i % 2 === 1;
            const st = (isHaram ? w(5, 8) : w(5, 6)) + 0.4 + Math.floor(i / 2) * 0.45;
            const cycle = (t - st) / 1.6;
            if (cycle < 0) return null;
            const u = cycle % 1;
            // a haram coin that reaches the barrier after it is drawn stops there and falls away
            const blocked = isHaram && st + Math.floor(cycle) * 1.6 + 0.42 * 1.6 > w(6, 4);
            const uu = blocked ? Math.min(u, 0.42) : u;
            const p = bez(isHaram ? HARAM : HALAL, uu);
            const fade = blocked ? 1 - P(u, 0.42, 0.25) : Math.sin(Math.PI * u);
            return <circle key={i} cx={p[0] + (blocked ? -60 * P(u, 0.42, 0.4) : 0)} cy={p[1]} r={9} fill="none" stroke={isHaram ? C.coral : C.gold} strokeWidth={2} opacity={fade * 0.9} />;
          })}
          {/* «لا يمكن … بالحرام إطلاقا»: the haram stream is cut */}
          {cut > 0.001 && (
            <g transform={`translate(${bez(HARAM, 0.42)[0]},${bez(HARAM, 0.42)[1]})`}>
              <circle r={34 + 10 * lockPulse} fill="none" stroke={C.gold} strokeWidth={1.4} opacity={0.5 * cut + 0.4 * lockPulse} />
              <DrawPath d="M-22,-22 L22,22 M22,-22 L-22,22" progress={cut} color={C.gold} width={3} glow />
            </g>
          )}
        </g>
      )}

      {/* balance: سخط الله / رضا الله */}
      {scaleOp > 0.001 && (
        <g opacity={scaleOp}>
          {rays > 0.001 &&
            Array.from({ length: 7 }, (_, i) => {
              const x = 760 + (i - 3) * 22;
              return <line key={i} x1={x + (i - 3) * 6} y1={150} x2={x} y2={lerp(150, 640, rays)} stroke={C.gold} strokeWidth={1.2} opacity={0.35 * rays} />;
            })}
          <DrawPath d="M540,460 L540,860 M470,860 L610,860" progress={scaleU} color={C.mgold} width={1.8} />
          <circle cx={540} cy={460} r={7} fill={C.gold} opacity={scaleU} />
          <g transform={`rotate(${-tilt} 540 460)`}>
            <DrawPath d="M300,460 L780,460" progress={scaleU} color={C.gold} width={2.2} />
            {/* left pan: haram / anger */}
            <g transform={`rotate(${tilt} 300 460)`}>
              <DrawPath d="M300,460 L240,610 M300,460 L360,610" progress={leftU} color={C.coral} width={1.3} />
              <DrawPath d="M220,610 Q300,670 380,610 Z" progress={leftU} color={C.coral} width={2} />
              <Label x={300} y={710} text="SAKHAT" op={leftU} color={C.coralText} />
            </g>
            {/* right pan: halal / pleasure */}
            <g transform={`rotate(${tilt} 780 460)`}>
              <DrawPath d="M780,460 L720,610 M780,460 L840,610" progress={rightU} color={C.gold} width={1.3} />
              <DrawPath d="M700,610 Q780,670 860,610 Z" progress={rightU} color={C.gold} width={2} glow />
              <Orb x={780} y={600} r={9} opacity={rays} />
              <Label x={780} y={710} text="RIDA" op={rightU} color={C.gold} />
            </g>
          </g>
        </g>
      )}

      {/* money in and out only through its (gold) way */}
      {chanOp > 0.001 && (
        <g opacity={chanOp}>
          <DrawPath d={bezD(IN)} progress={inU} color={C.gold} width={2} glow />
          <DrawPath d={bezD(OUT)} progress={outU} color={C.gold} width={2} glow />
          <Label x={540} y={180} text="IN · HALAL" op={inU} color={C.gold} />
          <Label x={930} y={1090} text="OUT · HALAL" op={outU} color={C.gold} />
          {[0, 1, 2].map((i) => {
            const u = P(t, w(9, 3) + 0.4 + i * 0.55, 1.3, E.io);
            const p = bez(IN, u);
            return u > 0 && u < 1 ? <Orb key={`i${i}`} x={p[0]} y={p[1]} r={7} opacity={Math.sin(Math.PI * u)} /> : null;
          })}
          {[0, 1, 2].map((i) => {
            const u = P(t, w(9, 7) + 0.4 + i * 0.55, 1.3, E.io);
            const p = bez(OUT, u);
            return u > 0 && u < 1 ? <Orb key={`o${i}`} x={p[0]} y={p[1]} r={7} opacity={Math.sin(Math.PI * u)} /> : null;
          })}
        </g>
      )}

      <Spotlight x={540} floor={FLOOR} opacity={0.5 * Math.max(env(t, w(6, 1), 1, PG[7].start - 0.5, 0.6), span(t, 8, 10))} />
      <StickFigure pose={pose} x={540} t={t} opacity={figOp} />

      {/* the seven destroying sins; the first (shirk) lights up with the split heart */}
      {sevenOp > 0.001 && (
        <g opacity={sevenOp}>
          {Array.from({ length: 7 }, (_, i) => {
            const a = ((-20 - i * (140 / 6)) * Math.PI) / 180; // first = rightmost (Arabic reads right to left)
            const x = 540 + 360 * Math.cos(a), y = 820 + 360 * Math.sin(a);
            const u = P(t, w(10, 9) - 0.1 + i * 0.12, 0.5, E.o);
            const first = i === 0;
            const dim = first ? 1 : lerp(1, 0.3, firstGlow);
            return (
              <g key={i} opacity={dim}>
                {first && <circle cx={x} cy={y} r={70} fill={C.coral} opacity={0.18 * firstGlow} style={{ filter: "blur(14px)" }} />}
                <DrawPath d={circD(x, y, first ? lerp(44, 62, firstGlow) : 44)} progress={u} color={C.coral} width={first ? 2.2 : 1.5} glow={first} />
                <text x={x} y={y + 13} textAnchor="middle" fill={C.coralText} opacity={u * (first ? 1 - firstGlow : 1)} style={{ fontFamily: FONT.ar, fontWeight: 700, fontSize: 34 }}>
                  {arNum(i + 1)}
                </text>
                {first && firstGlow > 0.01 && (
                  <g transform={`translate(${x},${y + 4}) scale(0.62) translate(${-HX},${-(HY + 7 * HS)})`}>
                    <DrawPath d={HEART_L} progress={firstGlow} color={C.coral} width={3.4} />
                    <DrawPath d={HEART_R} progress={firstGlow} color={C.coral} width={3.4} />
                    <DrawPath d={CRACK} progress={firstGlow} color={C.coral} width={3} />
                  </g>
                )}
              </g>
            );
          })}
          <Label x={540} y={900} text="AL-MUBIQAT · 7" op={P(t, w(10, 10), 0.6)} color={C.coralText} />
          <Label x={540} y={940} text="01 · ASH-SHIRK" op={firstGlow} color={C.gold} />
        </g>
      )}
    </svg>
  );
};

// soft SFX on the talk only (none on the hadith pages)
const SFX: [number, string, number][] = [
  [0.25, "sfx/calm/logo_sting_soft_bloom.mp3", 0.24],
  [w(0, 5) - 0.1, "sfx/calm/shimmer_m1.mp3", 0.14],
  [w(1, 6) - 0.1, "sfx/calm/swish_soft.mp3", 0.16],
  [w(2, 4) - 0.05, "sfx/tick_soft_01.mp3", 0.2],
  [w(4, 3) - 0.05, "sfx/calm/mallet_marimba.mp3", 0.16],
  [w(5, 6) - 0.1, "sfx/calm/drip_plink.mp3", 0.16],
  [w(5, 8) - 0.1, "sfx/calm/drip_drop.mp3", 0.14],
  [w(6, 4) - 0.05, "sfx/tick_soft_01.mp3", 0.2],
  [w(7, 7) - 0.1, "sfx/calm/shimmer_m3.mp3", 0.14],
  [w(9, 3) - 0.1, "sfx/calm/swish_soft.mp3", 0.14],
  [OUTRO + 0.2, "sfx/calm/logo_sting_reverse_bloom.mp3", 0.22],
];
const onHadith = (at: number) => PG.some((p) => p.kind === "hadith" && at > p.start - 0.4 && at < p.end + 0.2);

export const DinarReel: React.FC = () => {
  const ready = useReligiousFonts();
  const t = useCurrentFrame() / FPS;
  if (!ready) return null;
  const k = pageAtT(t);
  const wf = worldFade(t, OUTRO);
  const left = PG[k].kind === "hadith" ? "HADITH · SAHIH" : k >= 5 && k <= 9 ? "FIG.0" + (k <= 6 ? "1 — HALAL / HARAM" : k === 7 ? "2 — MIZAN" : "3 — TARIQ") : "NASEEHA · TAWHID";
  return (
    <AbsoluteFill>
      <NavyBackground dustBoost={1 - 0.4 * env(t, PG[3].start, 0.8, PG[4].start, 0.8) + 0.8 * env(t, w(7, 7), 0.8, PG[8].start, 0.8)}>
        <AbsoluteFill style={{ opacity: wf }}>
          <Scene t={t} />
        </AbsoluteFill>
        <TextShield />
        <HudFrame
          left={left}
          category="حديث نبوي"
          topic="تعس عبد الدينار"
          title="TA'ISA ABD AD-DINAR"
          counter={`${String(k + 1).padStart(2, "0")} / ${NP}`}
          outAt={OUTRO}
          switches={SW.slice(0, -1)}
        />
        <ProgressTicks count={NP} index={k} opacity={wf * (t > 2 ? 1 : 0)} />
        <div style={{ opacity: wf }}>
          {PG.map((p, i) => (
            <TipCaption
              key={i}
              words={p.words.map((x) => ({ ...x, k: x.k === "h" ? "g" : x.k }))}
              start={p.start - 0.15}
              end={SW[i] + 0.1}
              variant="naskh"
              boxes={false}
              breaks={p.breaks}
              size={58}
              y={1420}
              source={p.source ?? undefined}
            />
          ))}
        </div>
        <LogoIntro sub="HADITH · NASEEHA" />
        <LogoOutro
          outroAt={OUTRO}
          total={D.total}
          cta={
            <>
              اللهم اجعل الدنيا <span style={{ color: C.gold }}>في أيدينا</span> لا في قلوبنا
              <div style={{ marginTop: 34, fontSize: 40, fontWeight: 500, color: C.grey }}>
                انشرها لتنال <span style={{ color: C.gold }}>الأجر</span>
              </div>
            </>
          }
        />
      </NavyBackground>
      <Audio src={staticFile("religious/dinar/mix_orig.wav")} />
      {SFX.filter(([at]) => !onHadith(at)).map(([at, src, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(at * FPS))} layout="none">
          <Audio src={staticFile(src)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const DINAR_TOTAL = D.total;