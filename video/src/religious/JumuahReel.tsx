import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { NavyBackground, TextShield } from "./NavyBackground";
import { HudFrame, ProgressTicks } from "./HudFrame";
import { AyahKaraoke } from "./AyahKaraoke";
import { TipCaption } from "./TipCaption";
import { LogoIntro, LogoOutro, worldFade } from "./LogoBrand";
import { InkLayer } from "./InkBoil";
import { StickFigure, POSE, mixPose } from "./StickFigure";
import { DrawPath, Orb, circD } from "./LineArt";
import { E, P, env, hash, lerp, arNum } from "./anim";
import { C, FONT, FPS, FLOOR, useReligiousFonts } from "./theme";
import type { AyahData } from "./types";
import data from "./data/jumuah.json";

/**
 * Friday reel (style v2): hadith «إن من أفضل أيامكم يوم الجمعة… فأكثروا علي من الصلاة فيه فإن صلاتكم معروضة علي»
 * (Abu Dawud 1047, sahih per al-Albani; the clip leaves out the middle, shown as «…»), the speaker's line, then
 * Al-Ahzab 33:56 recited. Voice only (music removed: BS-RoFormer + htdemucs_ft average), no SFX.
 * Never a depiction of the Prophet ﷺ or the angels: the angels are only descending points of light, Allah only light
 * from above, Madinah only the line drawing of the dome. Each shot grows out of the previous one:
 * seven days -> Friday glows -> many prayers rise -> they reach the dome (presented) -> the mushaf -> light from above,
 * descending lights reach the dome -> the believers at Jumu'ah, their prayers and salams rise to it.
 */
type Word = { t: string; on: number; off: number; k: string };
type Page = { kind: string; source: string | null; start: number; end: number; words: Word[] };
const D = data as unknown as { off: number; total: number; ayah: { surah: number; n: number }; pages: Page[] };
const PG = D.pages;
const NP = PG.length;
const w = (p: number, i: number) => PG[p].words[i].on;
const SW = PG.map((p, k) => (k + 1 < NP ? PG[k + 1].start - 0.25 : D.total));
const OUTRO = PG[NP - 1].words[PG[NP - 1].words.length - 1].off + 0.25;
const QP = PG.findIndex((p) => p.kind === "quran");
const pageAtT = (t: number) => {
  let k = 0;
  for (let i = 1; i < NP; i++) if (t >= SW[i - 1]) k = i;
  return k;
};

const Label: React.FC<{ x: number; y: number; text: string; op: number; color?: string; size?: number }> = ({ x, y, text, op, color = C.teal, size = 15 }) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor="middle" fill={color} opacity={op} style={{ fontFamily: FONT.mono, fontSize: size, letterSpacing: ".3em" }}>
      {text}
    </text>
  );

// the dome of the Prophet's Mosque, as a gold line drawing (a building only)
const DX = 540, DY = 470; // base centre of the dome drum
const DOME = [
  `M${DX - 150},${DY} L${DX + 150},${DY}`, // base
  `M${DX - 110},${DY} L${DX - 110},${DY - 60} L${DX + 110},${DY - 60} L${DX + 110},${DY}`, // drum
  `M${DX - 104},${DY - 60} C${DX - 110},${DY - 150} ${DX - 40},${DY - 190} ${DX},${DY - 215} C${DX + 40},${DY - 190} ${DX + 110},${DY - 150} ${DX + 104},${DY - 60}`, // dome
  `M${DX},${DY - 215} L${DX},${DY - 262}`, // finial
  `M${DX + 9},${DY - 286} A14,14 0 1 0 ${DX + 9},${DY - 262} A11,11 0 1 1 ${DX + 9},${DY - 286}`, // crescent
  ...[-70, -35, 0, 35, 70].map((x) => `M${DX + x - 9},${DY - 14} L${DX + x - 9},${DY - 40} A9,9 0 0 1 ${DX + x + 9},${DY - 40} L${DX + x + 9},${DY - 14}`), // windows
];
const DOME_TOP = DY - 120;
const BOOK = "M0,-28 Q-34,-44 -78,-34 L-78,40 Q-34,30 0,46 Q34,30 78,40 L78,-34 Q34,-44 0,-28 Z M0,-28 L0,46";

const Scene: React.FC<{ t: number }> = ({ t }) => {
  // ---- page 0: the seven days, Friday glows ----
  const daysOp = env(t, PG[0].start - 0.4, 0.6, PG[2].start - 0.2, 0.8);
  const daysIn = (i: number) => P(t, w(0, 3) - 0.3 + i * 0.09, 0.5, E.o);
  const friday = P(t, w(0, 4) - 0.1, 1.0, E.back);
  // ---- page 1: many prayers rise ----
  const many = P(t, w(1, 0) - 0.2, 2.4, E.s);
  // ---- page 2: presented (the dome) ----
  const domeU = P(t, PG[2].start - 0.6, 1.6, E.io);
  const domeOp = env(t, PG[2].start - 0.8, 0.8, OUTRO - 0.1, 0.6) * (1 - 0.65 * env(t, PG[3].start - 0.3, 0.6, PG[4].start - 0.3, 0.6));
  const presented = P(t, w(2, 2) - 0.2, 1.2, E.o);
  // ---- page 3: the mushaf ----
  const bookOp = env(t, PG[3].start - 0.4, 0.6, PG[4].start + 0.6, 0.8);
  const bookU = P(t, w(3, 3) - 0.3, 1.2, E.io);
  // ---- page 4: light from above (Allah), descending lights (the angels) to the dome ----
  const light = Math.max(P(t, w(3, 1) - 0.2, 1.0) * 0.5 * bookOp, P(t, w(4, 1) - 0.2, 1.4, E.o) * env(t, w(4, 1) - 0.2, 0.1, OUTRO, 0.6));
  const angels = P(t, w(4, 2) - 0.2, 1.0, E.o);
  const toDome = P(t, w(4, 3) - 0.1, 2.0, E.io);
  // ---- page 5: the believers, their prayers and salams ----
  const crowd = P(t, w(5, 0) - 0.3, 1.4, E.o);
  const salla = P(t, w(5, 3) - 0.1, 0.4);
  const sallim = P(t, w(5, 5) - 0.1, 0.4);
  const taslim = P(t, w(5, 6) - 0.1, 1.6, E.o);
  const domeGlow = Math.max(presented * 0.6 * (1 - env(t, PG[3].start - 0.3, 0.6, PG[4].start, 0.6)), toDome * 0.8, taslim);

  // the seated believer of pages 1–2 (prays, prayers rise)
  const heroOp = env(t, PG[1].start - 0.5, 0.7, PG[3].start - 0.3, 0.6);
  const heroPose = mixPose(POSE.kneel, POSE.kneelDua, P(t, w(1, 0) - 0.2, 0.9, E.back));
  // rows of believers (page 5): two rows, varied poses and phases (no twinning)
  const rows = Array.from({ length: 12 }, (_, i) => {
    const row = i < 7 ? 0 : 1;
    const k = row ? i - 7 : i;
    const n = row ? 5 : 7;
    return { x: 540 + (k - (n - 1) / 2) * (row ? 150 : 140), floor: row ? FLOOR - 90 : FLOOR, s: row ? 0.72 : 0.9, ph: hash(i, 3) * 3, dua: hash(i, 4) > 0.45, i };
  });

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="jRays" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.gold} stopOpacity={0.4} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="jGlow">
          <stop offset="0" stopColor="#FFF3CF" stopOpacity={0.55} />
          <stop offset="0.5" stopColor={C.gold} stopOpacity={0.16} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* light from above — light only */}
      {light > 0.001 &&
        Array.from({ length: 9 }, (_, i) => {
          const x0 = 540 + (i - 4) * 16, x1 = 540 + (i - 4) * 60;
          return <path key={i} d={`M${x0 - 3},150 L${x0 + 3},150 L${x1 + 12},${lerp(150, 900, light)} L${x1 - 12},${lerp(150, 900, light)} Z`} fill="url(#jRays)" opacity={0.6 * light} />;
        })}

      {/* the seven days; Friday glows (page 0), then it becomes the source of the rising prayers */}
      {daysOp > 0.001 && (
        <g opacity={daysOp}>
          {["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"].map((d, i) => {
            const fri = i === 6;
            // a row of days, right to left like the Arabic week; on «يوم الجمعة» Friday rises to the centre and grows
            const bx = 900 - i * 120, by = 700;
            const x = fri ? lerp(bx, 540, friday) : bx + (bx - 540) * 0.08 * friday;
            const y = fri ? lerp(by, 560, friday) : by + 30 * friday;
            const r = fri ? lerp(26, 70, friday) : lerp(26, 20, friday);
            return (
              <g key={d} opacity={daysIn(i) * (fri ? 1 : lerp(1, 0.35, friday))}>
                {fri && <circle cx={x} cy={y} r={r * 2.6} fill="url(#jGlow)" opacity={friday} />}
                <DrawPath d={circD(x, y, r)} progress={daysIn(i)} color={fri && friday > 0.3 ? C.gold : C.mgold} width={fri ? 2.4 : 1.6} glow={fri && friday > 0.3} />
                <Label x={x} y={y + r + 32} text={d} op={1} color={fri ? C.gold : C.teal} size={fri ? lerp(14, 20, friday) : 14} />
              </g>
            );
          })}
          <Label x={540} y={440} text="AL-JUMU'AH · KHAYR AL-AYYAM" op={friday} color={C.gold} size={18} />
        </g>
      )}

      {/* the dome (Madinah) — the prayers are presented */}
      {domeOp > 0.001 && (
        <g opacity={domeOp}>
          <ellipse cx={DX} cy={DOME_TOP} rx={260} ry={220} fill="url(#jGlow)" opacity={0.3 + 0.7 * domeGlow} />
          {DOME.map((d, i) => (
            <DrawPath key={i} d={d} progress={P(domeU, i * 0.06, 0.7)} color={i === 2 || i === 4 ? C.gold : C.mgold} width={i === 2 ? 2.4 : 1.4} glow={i === 2} />
          ))}
          {/* a ring for every arriving prayer */}
          {[0, 1, 2, 3].map((i) => {
            const u = ((t * 0.7 + i / 4) % 1) * Math.max(presented, toDome, taslim);
            return <ellipse key={i} cx={DX} cy={DOME_TOP} rx={120 + 160 * u} ry={90 + 120 * u} fill="none" stroke={C.gold} strokeWidth={1.2} opacity={(1 - u) * 0.5 * Math.max(presented, toDome, taslim)} />;
          })}
          <Label x={DX} y={DY + 40} text="AL-MADINAH" op={domeU * (1 - P(t, PG[3].start, 0.6))} color={C.mgold} />
        </g>
      )}

      {/* many prayers rise from the believer (page 1) and reach the dome (page 2) */}
      {heroOp > 0.001 &&
        Array.from({ length: 22 }, (_, i) => {
          const st = w(1, 0) + i * 0.16 * (1.2 - many * 0.6);
          const cyc = 2.6;
          const ph = (t - st) / cyc;
          if (ph < 0) return null;
          const u = ph % 1;
          const goDome = presented > 0.01;
          const sx = 540 + (hash(i, 5) - 0.5) * 60, sy = FLOOR - 330;
          const ex = goDome ? DX + (hash(i, 6) - 0.5) * 120 : 540 + (hash(i, 6) - 0.5) * 520;
          const ey = goDome ? DOME_TOP + 30 : 260 + hash(i, 7) * 200;
          const x = lerp(sx, ex, u) + 40 * Math.sin(u * Math.PI * 2 + i);
          const y = lerp(sy, ey, E.s(u));
          return <Orb key={i} x={x} y={y} r={lerp(7, 4, u)} opacity={heroOp * Math.sin(Math.PI * u) * 0.95} />;
        })}
      <StickFigure pose={heroPose} x={540} t={t} scale={1.5} opacity={heroOp} />

      {/* «في كتابه»: the mushaf */}
      {bookOp > 0.001 && (
        <g opacity={bookOp} transform={`translate(540,${lerp(820, 780, bookU)}) scale(2.3)`}>
          <circle r={70} fill="url(#jGlow)" opacity={bookU} />
          <DrawPath d={BOOK} progress={bookU} width={1.1} glow />
          {[-1, 1].map((s) =>
            [0, 1, 2, 3].map((j) => (
              <line key={`${s}${j}`} x1={s * 14} x2={s * lerp(14, 64, P(bookU, 0.4 + j * 0.1, 0.4))} y1={-12 + j * 14} y2={-14 + j * 14} stroke={C.mgold} strokeWidth={0.8} opacity={0.8} />
            ))
          )}
        </g>
      )}

      {/* «وملائكته يصلون على النبي»: descending points of light (never figures) that reach the dome */}
      {angels > 0.001 &&
        Array.from({ length: 36 }, (_, i) => {
          const col = i % 9, row = Math.floor(i / 9);
          const x0 = 140 + col * 100 + (row % 2) * 50, y0 = 180 + row * 70;
          const u = P(t, w(4, 3) - 0.2 + hash(i, 8) * 0.9, 1.6, E.io) * toDome;
          const x = lerp(x0, DX + (hash(i, 9) - 0.5) * 140, u), y = lerp(y0 + 20 * Math.sin(t * 1.2 + i), DOME_TOP, u);
          const op = angels * P(t, w(4, 2) - 0.2 + (i % 9) * 0.05 + row * 0.08, 0.6) * (1 - P(u, 0.85, 0.15)) * (1 - P(t, PG[5].start - 0.3, 0.6));
          return op > 0.01 ? <circle key={i} cx={x} cy={y} r={3 + 1.5 * hash(i, 10)} fill="#FFF3CF" opacity={op} style={{ filter: `drop-shadow(0 0 6px ${C.gold})` }} /> : null;
        })}

      {/* «يا أيها الذين آمنوا صلوا عليه وسلموا تسليما»: the believers at Jumu'ah, prayers (gold) and salams (white) rise */}
      {crowd > 0.001 && (
        <g opacity={crowd * env(t, PG[5].start - 0.3, 0.1, OUTRO - 0.1, 0.6)}>
          {rows.map((r) => (
            <StickFigure
              key={r.i}
              pose={r.dua ? POSE.kneelDua : POSE.kneelChest}
              x={r.x}
              floor={r.floor}
              t={t + r.ph}
              scale={r.s}
              opacity={P(t, w(5, 0) - 0.3 + r.i * 0.07, 0.7, E.o) * (r.floor < FLOOR ? 0.6 : 0.9)}
            />
          ))}
          {rows.map((r) =>
            [0, 1].map((k) => {
              const on = k === 0 ? salla : sallim;
              if (on <= 0.001) return null;
              const st = (k === 0 ? w(5, 3) : w(5, 5)) + hash(r.i, 11 + k) * 0.8;
              const u = ((t - st) / 2.4) % 1;
              if (t < st) return null;
              const x = lerp(r.x, DX + (hash(r.i, 13) - 0.5) * 160, E.s(u)), y = lerp(r.floor - 260 * r.s, DOME_TOP + 40, E.s(u));
              return k === 0 ? (
                <Orb key={`${r.i}${k}`} x={x} y={y} r={5} opacity={Math.sin(Math.PI * u) * 0.9} />
              ) : (
                <circle key={`${r.i}${k}`} cx={x} cy={y} r={7} fill="none" stroke={C.white} strokeWidth={1.6} opacity={Math.sin(Math.PI * u) * 0.8} />
              );
            })
          )}
          <Label x={540} y={FLOOR + 44} text="AL-MU'MINUN · SALAT & SALAM" op={salla} color={C.gold} />
        </g>
      )}
    </svg>
  );
};

/** HOOK over the logo intro (plain words from the meaning of the hadith, not Quran text) */
const Hook: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const op = env(t, 0.45, 0.5, 2.55, 0.45);
  if (op <= 0.001) return null;
  const u = P(t, 0.45, 0.9, E.o);
  return (
    <div style={{ position: "absolute", left: 60, width: 960, top: 1290, textAlign: "center", direction: "rtl", fontFamily: FONT.ar, fontWeight: 700, fontSize: 56, lineHeight: 1.5, color: C.white, opacity: op, transform: `translateY(${(1 - u) * 18}px)` }}>
      يومُ الجمعة…
      <br />
      أكثِرْ فيه من <span style={{ color: C.gold, textShadow: "0 0 18px rgba(227,204,143,.45)" }}>الصلاة على النبي ﷺ</span>
    </div>
  );
};

export const JumuahReel: React.FC = () => {
  const ready = useReligiousFonts();
  const t = useCurrentFrame() / FPS;
  if (!ready) return null;
  const k = pageAtT(t);
  const wf = worldFade(t, OUTRO);
  const isQ = k >= QP;
  const ayah: AyahData = {
    surah: 33,
    surahName: "سورة الأحزاب",
    en: "Al-Ahzab",
    ayat: [56],
    off: D.off,
    total: D.total,
    pages: PG.slice(QP).map((p, i, arr) => ({ n: 56, first: i === 0, num: i === arr.length - 1, lines: [p.words.length], start: p.start, end: p.end, words: p.words })),
  };
  return (
    <AbsoluteFill>
      <NavyBackground dustBoost={1 + 0.9 * env(t, w(NP - 1, 6), 1, OUTRO, 1) + 0.5 * env(t, w(QP, 2), 1, PG[NP - 1].start, 1)}>
        <AbsoluteFill style={{ opacity: wf }}>
          <InkLayer>
            <Scene t={t} />
          </InkLayer>
        </AbsoluteFill>
        <TextShield />
        <HudFrame
          left={isQ ? `QURAN · 33:56` : PG[k].kind === "hadith" ? "HADITH · JUMU'AH" : "JUMU'AH · FRIDAY"}
          category={isQ ? "القرآن الكريم" : "يوم الجمعة"}
          topic={isQ ? "سورة الأحزاب" : "الصلاة على النبي ﷺ"}
          title="AL-JUMU'AH · 33 : 56"
          counter={`0${k + 1} / 0${NP}`}
          outAt={OUTRO}
          switches={SW.slice(0, -1)}
        />
        <ProgressTicks count={NP} index={k} opacity={wf * (t > 2 ? 1 : 0)} />
        <div style={{ opacity: wf }}>
          {PG.slice(0, QP).map((p, i) => (
            <TipCaption key={i} words={p.words} start={p.start - 0.15} end={SW[i] + 0.1} variant="naskh" boxes={false} size={60} y={1420} source={p.source ?? undefined} />
          ))}
          {isQ && (
            <div style={{ position: "absolute", left: 0, width: 1080, top: 1300, textAlign: "center", fontFamily: FONT.ar, fontWeight: 500, fontSize: 26, color: C.mgold, direction: "rtl", opacity: P(t, PG[QP].start - 0.5, 0.5, E.s) }}>
              سورة الأحزاب : الآية {arNum(56)}
            </div>
          )}
          <AyahKaraoke data={ayah} top={1330} height={330} baseSize={68} endDim={1} />
        </div>
        <LogoIntro sub="JUMU'AH · FRIDAY" />
        <LogoOutro
          outroAt={OUTRO}
          total={D.total}
          cta={
            <>
              اللهم صلِّ وسلِّم على <span style={{ color: C.gold }}>نبينا محمد</span>
              <div style={{ marginTop: 34, fontSize: 40, fontWeight: 500, color: C.grey }}>
                انشرها لتنال <span style={{ color: C.gold }}>الأجر</span>
              </div>
            </>
          }
        />
      </NavyBackground>
      <Audio src={staticFile("religious/jumuah/mix.wav")} />
      <Hook />
    </AbsoluteFill>
  );
};

export const JUMUAH_TOTAL = D.total;
