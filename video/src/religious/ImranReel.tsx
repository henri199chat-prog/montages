import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { RecitationReel } from "./RecitationReel";
import { StickFigure, POSE, mixPose, squash, type Pose } from "./StickFigure";
import { DrawPath, Orb, Spotlight, pointArchD, waveD, circD } from "./LineArt";
import { E, P, env, hash, lerp } from "./anim";
import { C, FONT, FPS, FLOOR } from "./theme";
import type { AyahData } from "./types";
import data from "./data/imran-133-134.json";

/**
 * Aal-Imran 3:133–134, a child's recitation from the clip Ayman sent. The audio is the ORIGINAL, sample for sample
 * (only 3 s of silence in front for the logo intro): no cleaning, no reverb, no drone, no SFX.
 * Text = verified Uthmani, shown as recited (the reciter repeats «وَجَنَّةٍ» and «وَٱلْكَٰظِمِينَ ٱلْغَيْظَ»).
 * Drawing follows the meaning (tafsir) word by word, one continuous world, each shot made from the previous one:
 * hook «a race whose prize is as wide as the heavens and the earth» -> a runner hastens up a path to a gate of light,
 * his coral marks fall away (مغفرة), light from above (من ربكم) -> the gate becomes the garden, a width line spans the
 * seven heavens and the earth (عرضها السماوات والأرض), sealed (أعدت), the muttaqin stand at it -> he gives in ease (sun)
 * and in hardship (rain) -> anger rises from his chest and is held in (كظم) -> he pardons the one who wronged him and
 * people -> light from above, he bows in sujud (والله يحب المحسنين).
 */
const D = data as unknown as AyahData;
const PG = D.pages;
const w = (p: number, i: number) => PG[p].words[i].on;
const OUTRO = PG[PG.length - 1].words[PG[PG.length - 1].words.length - 1].off + 0.25;

// running cycle (side, leaning right)
const RUN_A: Pose = { sp: 12, hd: -4, uaL: 45, faL: 115, uaR: -40, faR: -10, thL: 38, shL: 8, thR: -28, shR: -85, m: 0.4, f: 0.7, sl: 1 };
const RUN_B: Pose = { sp: 12, hd: -4, uaL: -40, faL: -10, uaR: 45, faR: 115, thL: -28, shL: -85, thR: 38, shR: 8, m: 0.4, f: 0.7, sl: 1 };

const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixHex = (a: string, b: string, u: number) => {
  const A = hexToRgb(a), B = hexToRgb(b);
  return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], u))).join(",")})`;
};

const Label: React.FC<{ x: number; y: number; text: string; op: number; color?: string; size?: number }> = ({ x, y, text, op, color = C.teal, size = 15 }) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor="middle" fill={color} opacity={op} style={{ fontFamily: FONT.mono, fontSize: size, letterSpacing: ".3em" }}>
      {text}
    </text>
  );

/** a little garden inside an arch: trees and a river */
const Garden: React.FC<{ x: number; base: number; wd: number; h: number; u: number; t: number }> = ({ x, base, wd, h, u, t }) => {
  if (u <= 0.001) return null;
  const trees = [-0.32, -0.12, 0.12, 0.32];
  return (
    <g opacity={u}>
      {trees.map((k, i) => {
        const tx = x + k * wd, ty = base - h * (0.18 + 0.04 * (i % 2));
        const s = h / 600;
        return (
          <g key={i}>
            <DrawPath d={`M${tx},${base} L${tx},${ty}`} progress={P(u, 0.1 * i, 0.5)} color={C.mgold} width={1.6} />
            <circle cx={tx} cy={ty - 34 * s} r={36 * s * P(u, 0.2 + 0.1 * i, 0.5, E.o)} fill={C.gold} opacity={0.12} />
            <DrawPath d={circD(tx, ty - 34 * s, 36 * s)} progress={P(u, 0.2 + 0.1 * i, 0.6)} color={C.gold} width={1.4} />
          </g>
        );
      })}
      {[0, 1].map((i) => (
        <DrawPath key={i} d={waveD(x - wd * 0.42, x + wd * 0.42, base - 26 - i * 14, 5, 60, t * 1.4 + i)} progress={P(u, 0.3, 0.6)} color={C.teal} width={1.6} opacity={0.8} />
      ))}
    </g>
  );
};

const Scene: React.FC<{ t: number }> = ({ t }) => {
  // ---------- page timing ----------
  const p0 = PG[0].start, p1 = PG[1].start, p2 = PG[2].start, p3 = PG[3].start, p4 = PG[4].start;

  // ---------- hero position & pose ----------
  const heroX = lerp(lerp(lerp(lerp(200, 380, P(t, p0, p1 - p0 - 0.5, E.s)), 540, P(t, p1 + 4.2, 1.6, E.io)), 400, P(t, p3 - 0.4, 1.4, E.io)), 540, P(t, p4 - 0.6, 1.4, E.io));
  const running = env(t, p0 - 0.3, 0.5, p1 + 4.0, 0.8);
  const run = mixPose(RUN_A, RUN_B, 0.5 + 0.5 * Math.sin(t * 6.5));
  const keys: [number, Pose][] = [
    [0, POSE.stand],
    [w(1, 5) - 0.3, POSE.chest], // للمتقين
    [p2 - 0.2, POSE.stand],
    [w(2, 1) - 0.2, POSE.offer], // ينفقون
    [w(2, 5) - 0.1, POSE.slump], // والكاظمين — anger rises
    [w(2, 6) + 0.3, POSE.chest], // الغيظ — held in
    [w(3, 2) - 0.2, POSE.open], // والعافين
    [p4 - 0.3, POSE.stand],
    [w(4, 1) - 0.2, POSE.dua], // يحب
    [w(4, 2) - 0.1, POSE.sujud], // المحسنين
  ];
  let base = POSE.stand;
  for (let i = 0; i < keys.length; i++) if (t >= keys[i][0]) base = i === 0 ? keys[0][1] : mixPose(keys[i - 1][1], keys[i][1], P(t, keys[i][0], 0.9, E.io));
  let pose = mixPose(base, run, running);
  pose = { ...pose, sq: squash(t, keys.slice(1).map((k) => k[0])) };
  const heroOp = P(t, p0 - 0.6, 0.8, E.s);

  // ---------- page 0: the race to forgiveness ----------
  const s0 = env(t, p0 - 0.6, 0.8, p1 + 1.0, 1.2);
  const pathU = P(t, p0 - 0.3, 1.6, E.io);
  const forgive = P(t, w(0, 2) - 0.1, 1.6, E.o);
  const rays = env(t, w(0, 4) - 0.2, 1.0, p2 - 0.6, 0.8);
  // ---------- gate -> garden (page 0 end .. page 1) ----------
  const gateGrow = P(t, w(1, 0) - 0.3, 1.6, E.io);
  const gx = 540, gBase = lerp(640, FLOOR, gateGrow), gW = lerp(150, 430, gateGrow), gH = lerp(250, 640, gateGrow);
  const gateOp = env(t, p0 - 0.2, 1.0, p2 - 0.4, 0.8);
  const gardenU = Math.max(P(t, w(0, 5) - 0.2, 1.4) * 0.6, P(t, w(1, 0), 1.6));
  const widthU = P(t, w(1, 1) - 0.2, 1.4, E.io);
  const heavens = (i: number) => P(t, w(1, 2) - 0.2 + i * 0.16, 0.9, E.io);
  const earth = P(t, w(1, 3) - 0.2, 1.0, E.io);
  const sealed = P(t, w(1, 4) - 0.1, 0.8, E.o);
  const muttaqin = P(t, w(1, 5) - 0.2, 1.0, E.o);
  const s1 = env(t, p1 - 0.3, 0.6, p2 - 0.5, 0.8);

  // ---------- page 2: spending in ease and hardship; anger ----------
  const s2 = env(t, p2 - 0.4, 0.8, p3 - 0.3, 0.6);
  const ease = P(t, w(2, 3) - 0.2, 1.0, E.o);
  const hard = P(t, w(2, 4) - 0.2, 1.0, E.o);
  const give = env(t, w(2, 1) - 0.1, 0.4, w(2, 5) - 0.2, 0.6);
  const anger = env(t, w(2, 5) - 0.1, 0.8, w(2, 6) + 0.4, 1.2); // rises, then held in
  const heldIn = P(t, w(2, 6) + 0.2, 1.4, E.io);
  // ---------- page 3: held in (again) -> calm; pardon ----------
  const s3 = env(t, p3 - 0.4, 0.6, p4 - 0.4, 0.8);
  const calm = P(t, w(3, 0), 2.2, E.io);
  const pardon = P(t, w(3, 2) - 0.1, 1.4, E.io);
  const people = P(t, w(3, 4) - 0.2, 1.2, E.o);
  // ---------- page 4: love of Allah for the muhsinin ----------
  const s4 = env(t, p4 - 0.6, 0.8, OUTRO - 0.1, 0.6);
  const light = P(t, w(4, 0) - 0.2, 1.4, E.o);
  const love = P(t, w(4, 1) - 0.1, 1.2, E.o);
  const chestY = FLOOR - 320;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="gateGlow">
          <stop offset="0" stopColor="#FFF3CF" stopOpacity={0.55} />
          <stop offset="0.5" stopColor={C.gold} stopOpacity={0.18} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="raysG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.gold} stopOpacity={0.35} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* floor */}
      <line x1={540 - 470 * pathU} x2={540 + 470 * pathU} y1={FLOOR} y2={FLOOR} stroke={C.mgold} strokeWidth={1.2} opacity={0.55} />

      {/* ===== light from above (من ربكم / والله يحب) — never a figure, only light ===== */}
      {Math.max(rays, light) > 0.001 &&
        Array.from({ length: 9 }, (_, i) => {
          const a = Math.max(rays * 0.8, light);
          const x0 = 540 + (i - 4) * 18, x1 = 540 + (i - 4) * 70;
          return <path key={i} d={`M${x0 - 3},150 L${x0 + 3},150 L${x1 + 14},${lerp(150, 980, a)} L${x1 - 14},${lerp(150, 980, a)} Z`} fill="url(#raysG)" opacity={0.55 * a} />;
        })}

      {/* ===== page 0: path up to the gate, the race ===== */}
      {s0 > 0.001 && (
        <g opacity={s0}>
          <DrawPath d="M120,1150 C300,1100 330,900 420,820 C480,760 520,700 540,640" progress={pathU} color={C.mgold} width={1.4} dash="3 9" opacity={0.8} />
          <DrawPath d="M120,1150 C300,1100 330,900 420,820 C480,760 520,700 540,640" progress={P(t, p0, p1 - p0, E.s)} color={C.gold} width={2} glow />
          {/* speed lines behind the runner */}
          {running > 0.05 &&
            [0, 1, 2].map((i) => {
              const ph = (t * 1.8 + i / 3) % 1;
              return <line key={i} x1={heroX - 70 - ph * 120} x2={heroX - 30 - ph * 120} y1={FLOOR - 120 - i * 60} y2={FLOOR - 120 - i * 60} stroke={C.mgold} strokeWidth={1.4} opacity={running * (1 - ph) * 0.7} />;
            })}
          {/* مغفرة: the coral marks fall away behind him and fade */}
          {Array.from({ length: 9 }, (_, i) => {
            const fall = P(t, w(0, 2) + i * 0.12, 1.6, E.i);
            const x = heroX + (hash(i, 3) - 0.5) * 90 - fall * 90;
            const y = FLOOR - 140 - hash(i, 4) * 260 + fall * 200;
            return <circle key={i} cx={x} cy={y} r={5} fill={C.coral} opacity={heroOp * (1 - forgive) * 0.85 + 0.0} />;
          })}
          <Label x={540} y={590} text="MAGHFIRAH" op={P(t, w(0, 2), 0.6) * (1 - gateGrow)} color={C.gold} />
        </g>
      )}

      {/* ===== the gate -> the garden ===== */}
      {gateOp > 0.001 && (
        <g opacity={gateOp}>
          <ellipse cx={gx} cy={gBase - gH * 0.45} rx={gW * 0.9} ry={gH * 0.7} fill="url(#gateGlow)" opacity={0.4 + 0.6 * Math.max(forgive, gateGrow)} />
          <Garden x={gx} base={gBase} wd={gW} h={gH} u={gardenU} t={t} />
          <DrawPath d={pointArchD(gx, gBase, gW, gH)} progress={P(t, p0 - 0.2, 1.4, E.io)} width={2.4} glow />
          <DrawPath d={pointArchD(gx, gBase, gW + 34, gH + 30)} progress={P(t, p0 + 0.2, 1.4, E.io)} color={C.mgold} width={1} dash="2 9" opacity={0.6} />
          {/* أعدت: a seal of light on the arch */}
          {sealed > 0.001 && (
            <g transform={`translate(${gx},${gBase - gH - 40})`} opacity={sealed}>
              <circle r={10 + 30 * (1 - sealed)} fill="none" stroke={C.gold} strokeWidth={1.4} opacity={1 - sealed * 0.5} />
              <Orb x={0} y={0} r={8} />
            </g>
          )}
        </g>
      )}

      {/* ===== page 1: width = the heavens and the earth ===== */}
      {s1 > 0.001 && (
        <g opacity={s1}>
          {/* the heavens: seven layered arcs */}
          {Array.from({ length: 7 }, (_, i) => {
            const rx = 260 + 38 * i, ry = 700 + 55 * i;
            return (
              <path
                key={i}
                d={`M${540 - rx},${FLOOR} A${rx},${ry} 0 0 1 ${540 + rx},${FLOOR}`}
                fill="none"
                stroke={i % 2 ? C.mgold : C.gold}
                strokeWidth={1.6}
                style={{ filter: `drop-shadow(0 0 4px ${C.gold})` }}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - heavens(i)}
                opacity={0.85 - i * 0.07}
              />
            );
          })}
          <Label x={540} y={FLOOR - 860} text="AS-SAMAWAT" op={heavens(6) * (1 - muttaqin)} color={C.gold} />
          {/* the earth: a wide band at the floor */}
          <DrawPath d={`M${540 - 500},${FLOOR + 4} Q540,${FLOOR + 70} ${540 + 500},${FLOOR + 4}`} progress={earth} color={C.gold} width={2} glow />
          <Label x={860} y={FLOOR + 50} text="AL-ARD" op={earth} color={C.gold} />
          {/* عرضها: a width line across everything */}
          <g opacity={widthU}>
            <DrawPath d={`M${540 - 500 * widthU},180 L${540 + 500 * widthU},180`} progress={1} color={C.gold} width={1.6} />
            {[-1, 1].map((sx) => (
              <path key={sx} d={`M${540 + sx * 500 * widthU},165 L${540 + sx * 500 * widthU},195 M${540 + sx * 500 * widthU - sx * 16},172 L${540 + sx * 500 * widthU},180 L${540 + sx * 500 * widthU - sx * 16},188`} fill="none" stroke={C.gold} strokeWidth={1.6} />
            ))}
            <Label x={540} y={160} text={earth > 0.5 ? "WIDTH = HEAVENS + EARTH" : "WIDTH"} op={1} color={C.gold} />
          </g>
          {/* للمتقين: the muttaqin stand at the gate */}
          {[-1, 1].map((sx, i) => (
            <StickFigure key={i} pose={POSE.chest} x={540 + sx * 250} t={t + i} scale={1.15} opacity={muttaqin * 0.85} />
          ))}
          <Label x={540} y={1090} text="AL-MUTTAQIN" op={muttaqin} color={C.gold} />
        </g>
      )}

      {/* ===== page 2: giving in ease (sun) and hardship (rain) ===== */}
      {s2 > 0.001 && (
        <g opacity={s2}>
          <rect x={60} y={200} width={480 * ease} height={950} fill={C.gold} opacity={0.04 * ease} />
          {ease > 0.001 && (
            <g transform="translate(250,360)" opacity={ease * (1 - anger * 0.6)}>
              <DrawPath d={circD(0, 0, 46)} progress={ease} width={2} glow />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1={60 * Math.cos(a)} y1={60 * Math.sin(a)} x2={(60 + 22 * ease) * Math.cos(a)} y2={(60 + 22 * ease) * Math.sin(a)} stroke={C.gold} strokeWidth={1.6} />;
              })}
              <Label x={0} y={120} text="AS-SARRA'" op={ease} color={C.gold} />
            </g>
          )}
          {hard > 0.001 && (
            <g opacity={hard * (1 - anger * 0.6)}>
              <DrawPath d="M700,380 C690,330 750,300 790,320 C810,280 880,280 900,330 C950,330 960,390 910,400 L720,400 C690,400 690,385 700,380" progress={hard} color={C.grey} width={2} />
              {Array.from({ length: 14 }, (_, i) => {
                const ph = (t * 1.6 + hash(i, 5)) % 1;
                const x = 720 + hash(i, 6) * 190 - ph * 30;
                return <line key={i} x1={x} y1={420 + ph * 520} x2={x - 10} y2={450 + ph * 520} stroke={C.coral} strokeWidth={1.5} opacity={0.7 * (1 - ph)} />;
              })}
              <Label x={810} y={470} text="AD-DARRA'" op={hard} color={C.coralText} />
            </g>
          )}
          {/* recipients on both sides, his gifts reach them */}
          {[-1, 1].map((sx, i) => (
            <StickFigure key={i} pose={POSE.kneelDua} x={540 + sx * 300} t={t + 2 * i} scale={1.0} opacity={0.55 * P(t, w(2, 1) - 0.2, 0.8)} />
          ))}
          {give > 0.001 &&
            Array.from({ length: 8 }, (_, i) => {
              const side = i % 2 ? 1 : -1;
              const u = (t * 0.55 + i / 8) % 1;
              const x = lerp(540 + side * 40, 540 + side * 290, u), y = chestY + 40 - Math.sin(Math.PI * u) * 120;
              return <Orb key={i} x={x} y={y} r={6} opacity={give * Math.sin(Math.PI * u)} />;
            })}
          {/* الغيظ: anger rises from the chest as coral flames, then it is held in */}
          {anger > 0.001 && (
            <g opacity={anger}>
              {[0, 1, 2].map((i) => {
                const h = lerp(60, 230, P(t, w(2, 5) + i * 0.15, 1.2, E.o)) * (1 - heldIn);
                let d = `M${540 - 28 + i * 28},${chestY}`;
                for (let k = 1; k <= 6; k++) d += ` L${540 - 28 + i * 28 + (k % 2 ? 14 : -14) * Math.sin(t * 7 + k + i)},${chestY - (h * k) / 6}`;
                return <path key={i} d={d} fill="none" stroke={C.coral} strokeWidth={2.4} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 6px ${C.coral})` }} />;
              })}
              <Label x={540} y={chestY - 280} text="AL-GHAYZ" op={1 - heldIn} color={C.coralText} />
            </g>
          )}
          {heldIn > 0.001 && (
            <g opacity={heldIn * (1 - P(t, p3 - 0.4, 0.6))}>
              <circle cx={540} cy={chestY + 10} r={lerp(70, 22, heldIn)} fill={C.coral} opacity={0.25} />
              <DrawPath d={circD(540, chestY + 10, 30)} progress={heldIn} width={2} glow />
            </g>
          )}
        </g>
      )}

      {/* ===== page 3: held in -> calm, then pardon ===== */}
      {s3 > 0.001 && (
        <g opacity={s3}>
          {/* the anger, held in his chest, straightens into calm gold lines */}
          {[0, 1, 2].map((i) => (
            <DrawPath key={i} d={waveD(heroX - 90, heroX + 90, chestY - 230 + i * 26, lerp(16, 0, calm), 40, t * 3 + i)} progress={1} color={mixHex(C.coral, C.gold, calm)} width={2} opacity={0.85 * (1 - P(t, w(3, 2), 0.8))} />
          ))}
          <Label x={heroX} y={chestY - 280} text="KAZM · HELD IN" op={P(t, p3, 0.6) * (1 - P(t, w(3, 2), 0.8))} color={C.gold} />
          {/* the one who wronged him: coral, bowed; the wrong (a coral arrow) dissolves into gold as he pardons */}
          <StickFigure pose={mixPose(POSE.bowed, POSE.stand, pardon)} x={800} t={t + 1} scale={1.35} color={mixHex(C.coral, C.white, pardon)} opacity={P(t, w(3, 2) - 0.6, 0.6)} />
          {Array.from({ length: 10 }, (_, i) => {
            const x = lerp(740, 470, i / 9), y = chestY + 20;
            const go = P(t, w(3, 2) + 0.2 + (9 - i) * 0.06, 0.6, E.o);
            return <circle key={i} cx={x} cy={y - go * (40 + 60 * hash(i, 7))} r={go > 0.2 ? 3.5 : 5} fill={go > 0.2 ? C.gold : C.coral} opacity={P(t, w(3, 2) - 0.5, 0.4) * (1 - go)} />;
          })}
          <Label x={640} y={chestY - 70} text="AL-'AFW · PARDON" op={pardon * (1 - people)} color={C.gold} />
          {/* عن الناس: the people */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <StickFigure pose={POSE.stand} x={150 + i * 95} t={t + 3 + i} scale={0.85} opacity={0.55 * people} color={C.grey} />
              <Orb x={150 + i * 95} y={FLOOR - 330} r={5} opacity={people * P(t, w(3, 4) + 0.3 + i * 0.25, 0.5)} />
            </g>
          ))}
          <Label x={245} y={FLOOR + 40} text="AN-NAS" op={people} color={C.teal} />
        </g>
      )}

      {/* ===== page 4: the light above; he bows ===== */}
      {s4 > 0.001 && (
        <g opacity={s4}>
          <ellipse cx={540} cy={FLOOR - 200} rx={260} ry={300} fill="url(#gateGlow)" opacity={0.6 * love} />
          {love > 0.001 &&
            Array.from({ length: 14 }, (_, i) => {
              const u = (t * 0.28 + hash(i, 8)) % 1;
              return <Orb key={i} x={540 + (hash(i, 9) - 0.5) * 420 + 20 * Math.sin(t + i)} y={FLOOR - 60 - u * 760} r={lerp(5, 2, u)} opacity={love * Math.sin(Math.PI * u) * 0.9} />;
            })}
          <Label x={540} y={FLOOR + 40} text="AL-MUHSININ" op={P(t, w(4, 2), 0.8)} color={C.gold} />
        </g>
      )}

      {/* the hero */}
      <Spotlight x={heroX} floor={FLOOR} opacity={0.45 * Math.max(env(t, w(2, 6), 1, p3 + 2, 1), light)} />
      <StickFigure pose={pose} x={heroX} t={t} opacity={heroOp} />
    </svg>
  );
};

/** HOOK over the logo intro (0–3 s): the race and its prize, in plain words (not Quran text) */
const Hook: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const op = env(t, 0.45, 0.5, 2.55, 0.45);
  if (op <= 0.001) return null;
  const u = P(t, 0.45, 0.9, E.o);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 960,
        top: 1290,
        textAlign: "center",
        direction: "rtl",
        fontFamily: FONT.ar,
        fontWeight: 700,
        fontSize: 58,
        lineHeight: 1.5,
        color: C.white,
        opacity: op,
        transform: `translateY(${(1 - u) * 18}px)`,
      }}
    >
      سباقٌ… جائزتُه
      <br />
      <span style={{ color: C.gold, textShadow: "0 0 18px rgba(227,204,143,.45)" }}>بِسَعَةِ السماواتِ والأرض</span>
    </div>
  );
};

export const ImranReel: React.FC = () => (
  <AbsoluteFill>
    <RecitationReel
      data={D}
      audio="religious/imran/recitation.wav"
      hudLeft={(_, n) => `QURAN · 03:${n}`}
      topic="سورة آل عمران"
      title="AAL-IMRAN · 3 : 133 — 134"
      counter={(p) => `0${p + 1} / 0${PG.length}`}
      scene={(t) => <Scene t={t} />}
      dustBoost={(t) => 1 + 0.8 * env(t, w(4, 1), 1, OUTRO, 1) + 0.5 * env(t, w(0, 4), 1, PG[1].start + 1, 1)}
      cta={
        <>
          شاركها لعلها تكون <span style={{ color: C.gold }}>صدقة جارية</span>
          <div style={{ marginTop: 34, fontSize: 40, fontWeight: 500, color: C.grey }}>
            انشرها لتنال <span style={{ color: C.gold }}>الأجر</span>
          </div>
        </>
      }
    />
    <Hook />
  </AbsoluteFill>
);

export const IMRAN_TOTAL = D.total;