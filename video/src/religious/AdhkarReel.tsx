import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { NavyBackground, TextShield } from "./NavyBackground";
import { HudFrame, ProgressTicks } from "./HudFrame";
import { TipCaption } from "./TipCaption";
import { LogoIntro, LogoOutro, worldFade } from "./LogoBrand";
import { InkLayer } from "./InkBoil";
import { StickFigure, POSE, mixPose, squash, type Pose } from "./StickFigure";
import { DrawPath, Orb, circD, waveD } from "./LineArt";
import { E, P, env, hash, lerp, arNum, clamp } from "./anim";
import { C, FONT, FLOOR, useReligiousFonts } from "./theme";
import data from "./data/adhkar.json";

/**
 * «فضل الأذكار» — talk clip (Egyptian podcast speaker, name unknown), voice only (music removed: BS-RoFormer + htdemucs_ft),
 * cut to the two SAHIH hadiths only (Ayman's choice; the clip's three weak/disputed ones were left out):
 *  1. «سبحان الله وبحمده» 100× — al-Bukhari 6405, Muslim 2691 (the speaker's wording: «غفرت له ذنوبه», hence «بنحوه»)
 *  2. «لا إله إلا الله وحده لا شريك له…» 100× — al-Bukhari 3293, Muslim 2691 («من ولد إسماعيل» is his addition, hence «بنحوه»)
 * Style v2: ink boil, reads sheet, tafsir of every phrase drawn; the TASBIH (a ring of 33 beads) is the thread that returns.
 * No SFX on hadith; quiet drone only.
 */
type Word = { t: string; on: number; off: number; k: string };
type Page = { start: number; end: number; source: string | null; breaks: number[]; words: Word[] };
const D = data as unknown as { off: number; total: number; pages: Page[] };
const PG = D.pages;
const NP = PG.length;
const SW = PG.map((p, k) => (k + 1 < NP ? PG[k + 1].start - 0.25 : D.total));
const OUTRO = PG[NP - 1].words[PG[NP - 1].words.length - 1].off + 0.25 + 1.2; // hold the last read
const w = (p: number, i: number) => PG[p].words[Math.min(i, PG[p].words.length - 1)].on;
const find = (p: number, s: string) => {
  const i = PG[p].words.findIndex((x) => x.t.includes(s));
  return w(p, Math.max(0, i));
};
const pageAtT = (t: number) => {
  let k = 0;
  for (let i = 1; i < NP; i++) if (t >= SW[i - 1]) k = i;
  return k;
};
/** visible from page a until just before page b */
const span = (t: number, a: number, b: number, pre = 0.4) => env(t, PG[a].start - pre, 0.6, b < NP ? PG[b].start - 0.45 : OUTRO - 0.2, 0.55);

const Label: React.FC<{ x: number; y: number; text: string; op: number; color?: string; size?: number }> = ({ x, y, text, op, color = C.teal, size = 16 }) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor="middle" fill={color} opacity={op} style={{ fontFamily: FONT.mono, fontSize: size, letterSpacing: ".3em" }}>
      {text}
    </text>
  );

/** the tasbih: 33 beads on a ring + a tassel; `lit` beads (0..33) glow gold */
const Tasbih: React.FC<{ x: number; y: number; r: number; lit: number; op: number; t: number }> = ({ x, y, r, lit, op, t }) =>
  op <= 0.001 ? null : (
    <g opacity={op}>
      <DrawPath d={circD(x, y, r)} progress={1} color={C.mgold} width={1} opacity={0.5} />
      {Array.from({ length: 33 }, (_, i) => {
        const a = -Math.PI / 2 + (i / 33) * Math.PI * 2;
        const on = clamp(lit - i);
        return (
          <g key={i}>
            {on > 0 && <circle cx={x + r * Math.cos(a)} cy={y + r * Math.sin(a)} r={16} fill={C.gold} opacity={0.18 * on} />}
            <circle cx={x + r * Math.cos(a)} cy={y + r * Math.sin(a)} r={9} fill={on > 0.5 ? C.gold : "none"} stroke={on > 0.5 ? C.gold : C.mgold} strokeWidth={1.6} />
          </g>
        );
      })}
      {/* tassel */}
      <DrawPath d={`M${x},${y + r + 10} L${x},${y + r + 70}`} progress={1} color={C.gold} width={2} />
      {[-10, -4, 4, 10].map((dx, i) => (
        <DrawPath key={i} d={`M${x},${y + r + 70} Q${x + dx},${y + r + 100 + 6 * Math.sin(t * 2 + i)} ${x + dx * 1.6},${y + r + 130}`} progress={1} color={C.gold} width={1.4} opacity={0.8} />
      ))}
    </g>
  );

const Scene: React.FC<{ t: number }> = ({ t }) => {
  // page indices (see data): 0 قال النبي · 1 من قال سبحان الله… مئة مرة · 2 غفرت… زبد البحر · 3 غفرت له ذنوبه · 4 الجائزة العظمى
  // 5 قول النبي · 6 لا إله إلا الله وحده · 7 له الملك… قدير · 8 مئة مرة · 9 مئة حسنة / مئة خطيئة · 10 عشر رقاب
  // 11 حرز من الشيطان سائر يومه · 12 ولم يأت أحد بأفضل · 13 إلا رجل عمل بمثل عمله أو زاد
  const light1 = env(t, PG[0].start - 0.3, 0.9, PG[1].start + 0.4, 0.8);
  // tasbih #1: beads light up through «سبحان الله وبحمده … مئة مرة», the counter climbs to 100
  const tas1 = span(t, 1, 2, 0.3);
  const cnt1 = P(t, find(1, "سُبْحَانَ") - 0.1, find(1, "مَرَّةٍ") - find(1, "سُبْحَانَ") + 0.6, E.io);
  // the sea: coral foam (sins) dissolves and rises as light
  const sea = span(t, 2, 4, 0.3);
  const seaIn = P(t, PG[2].start - 0.3, 1.0, E.o);
  const foamIn = P(t, find(2, "زَبَدِ") - 0.3, 0.6, E.o);
  const melt = P(t, PG[3].start - 0.1, 1.6, E.io);
  // the great prize: morning sun and evening moon around a gold medallion
  const prize = span(t, 4, 5, 0.3);
  const prizeU = P(t, w(4, 0) - 0.1, 0.8, E.back);
  const dayArc = P(t, find(4, "الصَّبَاحِ") - 0.2, 1.6, E.io);
  // «لا إله إلا الله وحده لا شريك له»: many faint lines fade, one upright line of light remains
  const one = span(t, 5, 7, 0.3);
  const oneU = P(t, find(6, "إِلَهَ") - 0.2, 1.0, E.io);
  const alone = P(t, find(6, "شَرِيكَ") - 0.2, 1.0, E.io);
  // «له الملك وله الحمد وهو على كل شيء قدير»: dominion rings expand to the whole frame
  const mulk = span(t, 7, 8, 0.3);
  const ringsU = P(t, find(7, "الْمُلْكُ") - 0.2, 2.4, E.o);
  // tasbih returns: «مئة مرة»
  const tas2 = span(t, 8, 9, 0.3);
  const cnt2 = P(t, PG[8].start - 0.2, 1.4, E.io);
  // 100 good deeds written (gold grid) / 100 sins taken away (coral falls)
  const grid = span(t, 9, 10, 0.3);
  const good = P(t, find(9, "حَسَنَةٍ") - 0.5, 1.4, E.io);
  const bad = P(t, find(9, "وَحُطَّتْ") - 0.2, 0.6, E.o);
  const fall = P(t, find(9, "خَطِيئَةٍ") - 0.3, 1.6, E.i);
  // ten chains break
  const chains = span(t, 10, 11, 0.3);
  const brk = (i: number) => P(t, find(10, "رِقَابٍ") - 0.2 + i * 0.08, 0.5, E.back);
  // a dome of protection all day
  const shield = span(t, 11, 12, 0.3);
  const domeU = P(t, find(11, "حِرْزًا") - 0.2, 1.0, E.io);
  const sun = P(t, find(11, "سَائِرَ") - 0.3, 1.8, E.io);
  // none better, except one who did the same or more: two figures rise on steps of light
  const best = span(t, 12, NP, 0.3);
  const stepsU = P(t, PG[12].start - 0.2, 1.4, E.io);
  const second = P(t, find(13, "رَجُلٌ") - 0.1, 0.9, E.o);
  const more = P(t, find(13, "زَادَ") - 0.1, 0.9, E.back);

  // the person (pages 11–13)
  const keys: [number, Pose][] = [
    [0, POSE.stand],
    [find(11, "حِرْزًا") - 0.2, POSE.chest],
    [PG[12].start - 0.1, POSE.stand],
    [find(12, "بِأَفْضَلَ") - 0.1, POSE.raise],
  ];
  let pose = keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t >= keys[i][0]) pose = mixPose(keys[i - 1][1], keys[i][1], P(t, keys[i][0], 0.85, E.back));
  pose = { ...pose, sq: squash(t, keys.slice(1).map((k) => k[0])) };
  const heroX = lerp(540, 430, stepsU), heroFloor = lerp(FLOOR, FLOOR - 120, stepsU);

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="adRays" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.gold} stopOpacity={0.4} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="adGlow">
          <stop offset="0" stopColor="#FFF3CF" stopOpacity={0.5} />
          <stop offset="0.5" stopColor={C.gold} stopOpacity={0.15} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* «قال النبي ﷺ» — only light from above */}
      {light1 > 0.001 &&
        Array.from({ length: 9 }, (_, i) => {
          const x0 = 540 + (i - 4) * 16, x1 = 540 + (i - 4) * 60;
          return <path key={i} d={`M${x0 - 3},150 L${x0 + 3},150 L${x1 + 12},${lerp(150, 1000, light1)} L${x1 - 12},${lerp(150, 1000, light1)} Z`} fill="url(#adRays)" opacity={0.55 * light1} />;
        })}

      {/* tasbih #1 */}
      <Tasbih x={540} y={640} r={250} lit={33 * cnt1} op={tas1} t={t} />
      {tas1 > 0.001 && (
        <g opacity={tas1}>
          <text x={540} y={680} textAnchor="middle" fill={C.gold} style={{ fontFamily: FONT.ar, fontWeight: 700, fontSize: 120, filter: "drop-shadow(0 0 14px rgba(227,204,143,.5))" }}>
            {arNum(Math.round(100 * cnt1))}
          </text>
          <Label x={540} y={740} text="SUBHAN ALLAH WA BIHAMDIH" op={1} color={C.mgold} size={15} />
        </g>
      )}

      {/* the sea: foam = sins, dissolving into light */}
      {sea > 0.001 && (
        <g opacity={sea}>
          {[0, 1, 2, 3].map((i) => (
            <DrawPath key={i} d={waveD(80, 1000, 760 + i * 70, 18 - i * 3, 160 - i * 20, t * (0.8 + i * 0.2) + i)} progress={seaIn} color={i ? C.teal : C.gold} width={2} opacity={0.75 - i * 0.12} />
          ))}
          {Array.from({ length: 60 }, (_, i) => {
            const x = 90 + hash(i, 1) * 900, y0 = 740 + hash(i, 2) * 60 + 8 * Math.sin(t * 1.2 + i);
            const m = P(melt, hash(i, 3) * 0.5, 0.5, E.io);
            return (
              <circle key={i} cx={x + 20 * Math.sin(m * 4 + i)} cy={y0 - m * (300 + 200 * hash(i, 4))} r={lerp(5 + 4 * hash(i, 5), 3, m)} fill={m > 0.3 ? C.gold : C.coral} opacity={foamIn * (1 - m * 0.95) * 0.9} />
            );
          })}
          <Label x={540} y={1110} text="ZABAD AL-BAHR · SEA FOAM" op={foamIn * (1 - melt)} color={C.coralText} />
          <circle cx={540} cy={500} r={180} fill="url(#adGlow)" opacity={melt} />
        </g>
      )}

      {/* the great prize: morning & evening around a gold medallion */}
      {prize > 0.001 && (
        <g opacity={prize}>
          <circle cx={540} cy={640} r={200} fill="url(#adGlow)" opacity={prizeU} />
          <g transform={`translate(540,640) scale(${lerp(0.4, 1, prizeU)})`} opacity={prizeU}>
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i / 16) * Math.PI * 2 + t * 0.15;
              return <line key={i} x1={130 * Math.cos(a)} y1={130 * Math.sin(a)} x2={(150 + (i % 2) * 30) * Math.cos(a)} y2={(150 + (i % 2) * 30) * Math.sin(a)} stroke={C.gold} strokeWidth={2} opacity={0.7} />;
            })}
            <DrawPath d={circD(0, 0, 110)} progress={1} width={3} glow />
            <DrawPath d={circD(0, 0, 86)} progress={1} color={C.mgold} width={1.2} />
            <path d={Array.from({ length: 16 }, (_, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 8; const r = i % 2 ? 26 : 60; return `${i ? "L" : "M"}${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`; }).join(" ") + " Z"} fill="none" stroke={C.gold} strokeWidth={2.4} />
          </g>
          {/* morning sun → evening moon across the arc */}
          <DrawPath d="M160,980 A380,380 0 0 1 920,980" progress={dayArc} color={C.mgold} width={1.2} opacity={0.7} />
          {dayArc > 0.001 && (() => {
            const a = Math.PI + Math.PI * dayArc;
            const x = 540 + 380 * Math.cos(a), y = 980 + 380 * Math.sin(a);
            return dayArc < 0.6 ? <circle cx={x} cy={y} r={22} fill="none" stroke={C.gold} strokeWidth={2.5} /> : <path d={`M${x + 8},${y - 22} A22,22 0 1 0 ${x + 8},${y + 22} A17,17 0 1 1 ${x + 8},${y - 22}`} fill="none" stroke={C.gold} strokeWidth={2.5} />;
          })()}
          <Label x={540} y={1050} text="SABAH · MASA'" op={dayArc} color={C.mgold} />
        </g>
      )}

      {/* «لا إله إلا الله وحده لا شريك له»: one upright line of light remains */}
      {one > 0.001 && (
        <g opacity={one}>
          {Array.from({ length: 12 }, (_, i) => {
            const x = 120 + i * 76 + (i >= 6 ? 40 : 0);
            const fade = 1 - P(alone, hash(i, 6) * 0.5, 0.5);
            return <line key={i} x1={x} x2={x + (hash(i, 7) - 0.5) * 60} y1={420 + hash(i, 8) * 120} y2={1060} stroke={C.mgold} strokeWidth={2} opacity={0.35 * fade * P(t, PG[5].start, 0.8)} />;
          })}
          <circle cx={540} cy={700} r={lerp(60, 220, oneU)} fill="url(#adGlow)" opacity={oneU} />
          <DrawPath d="M540,1080 L540,330" progress={oneU} width={5} glow />
          <Orb x={540} y={330} r={12} opacity={oneU} />
          <Label x={540} y={1130} text="TAWHID · ONE" op={alone} color={C.gold} />
        </g>
      )}

      {/* «له الملك وله الحمد وهو على كل شيء قدير»: rings of dominion to the whole frame */}
      {mulk > 0.001 && (
        <g opacity={mulk}>
          <DrawPath d="M540,1080 L540,330" progress={1} width={5} glow opacity={1 - ringsU * 0.6} />
          {Array.from({ length: 6 }, (_, i) => (
            <circle key={i} cx={540} cy={700} r={lerp(20, 140 + i * 110, P(ringsU, i * 0.1, 0.6, E.o))} fill="none" stroke={i % 2 ? C.mgold : C.gold} strokeWidth={1.6} opacity={0.75 - i * 0.08} />
          ))}
          <Label x={540} y={1130} text="AL-MULK · AL-HAMD · QADIR" op={P(t, find(7, "قَدِيرٌ") - 0.1, 0.6)} color={C.gold} />
        </g>
      )}

      {/* tasbih #2: «مئة مرة» */}
      <Tasbih x={540} y={640} r={250} lit={33 * cnt2} op={tas2} t={t} />
      {tas2 > 0.001 && (
        <text x={540} y={680} textAnchor="middle" fill={C.gold} opacity={tas2} style={{ fontFamily: FONT.ar, fontWeight: 700, fontSize: 120, filter: "drop-shadow(0 0 14px rgba(227,204,143,.5))" }}>
          {arNum(Math.round(100 * cnt2))}
        </text>
      )}

      {/* 100 good deeds written / 100 sins taken away */}
      {grid > 0.001 && (
        <g opacity={grid}>
          {Array.from({ length: 100 }, (_, i) => {
            const col = i % 10, row = Math.floor(i / 10);
            const x = 300 + col * 54, y = 430 + row * 54;
            const g1 = P(good, (i / 100) * 0.8, 0.2, E.o);
            return <circle key={i} cx={x} cy={y} r={lerp(2, 11, g1)} fill={C.gold} opacity={0.15 + 0.85 * g1} style={g1 > 0.9 ? { filter: "drop-shadow(0 0 4px rgba(227,204,143,.8))" } : undefined} />;
          })}
          <text x={540} y={1035} textAnchor="middle" fill={C.gold} opacity={good} style={{ fontFamily: FONT.ar, fontWeight: 700, fontSize: 64 }}>
            {`+${arNum(Math.round(100 * good))}`}
          </text>
          {/* sins: coral points falling away */}
          {Array.from({ length: 100 }, (_, i) => {
            const x = 300 + (i % 10) * 54 + 27, y0 = 430 + Math.floor(i / 10) * 54 + 27;
            const f = P(fall, hash(i, 9) * 0.6, 0.4, E.i);
            return <circle key={`b${i}`} cx={x + (hash(i, 10) - 0.5) * 60 * f} cy={y0 + f * 900} r={6} fill={C.coral} opacity={bad * (1 - f) * 0.9} />;
          })}
          <text x={540} y={1110} textAnchor="middle" fill={C.coralText} opacity={bad} style={{ fontFamily: FONT.ar, fontWeight: 700, fontSize: 52 }}>
            {`−${arNum(Math.round(100 * fall))}`}
          </text>
        </g>
      )}

      {/* ten chains break open (freeing ten slaves) */}
      {chains > 0.001 && (
        <g opacity={chains}>
          {Array.from({ length: 10 }, (_, i) => {
            const col = i % 5, row = Math.floor(i / 5);
            const x = 220 + col * 160, y = 560 + row * 240;
            const b = brk(i);
            return (
              <g key={i}>
                <g transform={`translate(${x - b * 18},${y}) rotate(${-b * 25})`}>
                  <path d="M0,-40 A22,22 0 0 0 0,4" fill="none" stroke={b > 0.5 ? C.gold : C.grey} strokeWidth={6} strokeLinecap="round" />
                </g>
                <g transform={`translate(${x + b * 18},${y}) rotate(${b * 25})`}>
                  <path d="M0,-40 A22,22 0 0 1 0,4" fill="none" stroke={b > 0.5 ? C.gold : C.grey} strokeWidth={6} strokeLinecap="round" />
                </g>
                <line x1={x} x2={x} y1={y + 10} y2={y + 70} stroke={C.grey} strokeWidth={4} strokeDasharray="10 8" opacity={1 - b} />
                {b > 0.6 && <Orb x={x} y={y - 60 - 60 * b} r={6} opacity={b} />}
              </g>
            );
          })}
          <text x={540} y={1110} textAnchor="middle" fill={C.gold} opacity={P(t, find(10, "عَشْرِ") - 0.1, 0.5)} style={{ fontFamily: FONT.ar, fontWeight: 700, fontSize: 56 }}>
            {arNum(10)}
          </text>
        </g>
      )}

      {/* a dome of protection the whole day; dark shapes bounce off */}
      {shield > 0.001 && (
        <g opacity={shield}>
          <path d={`M${540 - 300},${FLOOR} A300,560 0 0 1 ${540 + 300},${FLOOR} Z`} fill={C.gold} opacity={0.06 * domeU} />
          <DrawPath d={`M${540 - 300},${FLOOR} A300,560 0 0 1 ${540 + 300},${FLOOR}`} progress={domeU} width={3} glow />
          {Array.from({ length: 5 }, (_, i) => {
            const ph = (t * 0.5 + i / 5) % 1;
            const side = i % 2 ? 1 : -1;
            const d = ph < 0.5 ? ph * 2 : 2 - ph * 2; // in, hit the dome, back out
            const x = 540 + side * lerp(560, 330, d), y = 640 + i * 90;
            return <circle key={i} cx={x} cy={y} r={20} fill={C.navy} stroke={C.coral} strokeWidth={2} opacity={domeU * 0.85} />;
          })}
          {/* the sun crosses the sky: all day long */}
          {sun > 0.001 && (() => {
            const a = Math.PI + Math.PI * sun;
            return <circle cx={540 + 430 * Math.cos(a)} cy={FLOOR - 40 + 700 * Math.sin(a)} r={22} fill="none" stroke={C.gold} strokeWidth={2.5} opacity={sun < 0.95 ? 1 : 1 - (sun - 0.95) * 20} />;
          })()}
          <Label x={540} y={FLOOR + 50} text="HIRZ · ALL DAY" op={domeU} color={C.gold} />
        </g>
      )}

      {/* none better — except one who did the same or more */}
      {best > 0.001 && (
        <g opacity={best}>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={300 + i * 90} x2={390 + i * 90} y1={FLOOR - i * 40} y2={FLOOR - i * 40} stroke={C.gold} strokeWidth={3} opacity={P(stepsU, i * 0.15, 0.4)} />
          ))}
          <circle cx={430} cy={FLOOR - 360} r={200} fill="url(#adGlow)" opacity={stepsU} />
          <StickFigure pose={i0(pose)} x={760} t={t + 1.3} scale={1.3} floor={FLOOR - 120 * more} opacity={second * 0.9} />
        </g>
      )}

      {/* the person (protected, then rising) */}
      <StickFigure pose={pose} x={heroX} t={t} floor={heroFloor} opacity={Math.max(shield, best)} />
    </svg>
  );
};
/** the second person mirrors the first (same deed), slightly behind in phase */
const i0 = (p: Pose): Pose => ({ ...p, ph: 1.1 });

/** HOOK over the logo intro (plain words, from the meaning of the sahih hadith) */
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const op = env(t, 0.45, 0.5, 2.55, 0.45);
  if (op <= 0.001) return null;
  const u = P(t, 0.45, 0.9, E.o);
  return (
    <div style={{ position: "absolute", left: 60, width: 960, top: 1300, textAlign: "center", direction: "rtl", fontFamily: FONT.ar, fontWeight: 700, fontSize: 56, lineHeight: 1.5, color: C.white, opacity: op, transform: `translateY(${(1 - u) * 18}px)` }}>
      مئة مرة في يومك…
      <br />
      وخطاياك تُحطّ <span style={{ color: C.gold, textShadow: "0 0 18px rgba(227,204,143,.45)" }}>ولو كانت مثل زبد البحر</span>
    </div>
  );
};

export const AdhkarReel: React.FC = () => {
  const ready = useReligiousFonts();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  if (!ready) return null;
  const k = pageAtT(t);
  const wf = worldFade(t, OUTRO);
  const hadith2 = k >= 5;
  return (
    <AbsoluteFill>
      <NavyBackground dustBoost={1 + 0.7 * env(t, PG[3].start, 1, PG[4].start, 1) + 0.6 * env(t, PG[12].start, 1, OUTRO, 1)}>
        <AbsoluteFill style={{ opacity: wf }}>
          <InkLayer>
            <Scene t={t} />
          </InkLayer>
        </AbsoluteFill>
        <TextShield />
        <HudFrame
          left={k === 4 ? "ADHKAR · SABAH & MASA'" : `HADITH · ${hadith2 ? "02" : "01"} · SAHIH`}
          category="فضل الأذكار"
          topic={hadith2 ? "لا إله إلا الله وحده" : "سبحان الله وبحمده"}
          title="FADL AL-ADHKAR"
          counter={`${String(k + 1).padStart(2, "0")} / ${NP}`}
          outAt={OUTRO}
          switches={SW.slice(0, -1)}
        />
        <ProgressTicks count={NP} index={k} opacity={wf * (t > 2 ? 1 : 0)} />
        <div style={{ opacity: wf }}>
          {PG.map((p, i) => (
            <TipCaption key={i} words={p.words} start={p.start - 0.15} end={SW[i] + 0.1} variant="naskh" boxes={false} breaks={p.breaks} size={58} y={1420} source={p.source ?? undefined} />
          ))}
        </div>
        <LogoIntro sub="HADITH · ADHKAR" />
        <LogoOutro
          outroAt={OUTRO}
          total={D.total}
          cta={
            <>
              لا تنسوا <span style={{ color: C.gold }}>الصلاة على رسول الله ﷺ</span>
              <div style={{ marginTop: 34, fontSize: 40, fontWeight: 500, color: C.grey }}>
                انشرها لتنال <span style={{ color: C.gold }}>الأجر</span>
              </div>
            </>
          }
        />
      </NavyBackground>
      <Audio src={staticFile("religious/adhkar/mix.wav")} />
      <Hook t={t} />
    </AbsoluteFill>
  );
};

export const ADHKAR_TOTAL = D.total;
