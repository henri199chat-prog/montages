import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { NavyBackground, TextShield } from "./NavyBackground";
import { HudFrame, ProgressTicks } from "./HudFrame";
import { TipCaption } from "./TipCaption";
import { LogoIntro, LogoOutro, worldFade } from "./LogoBrand";
import { InkLayer } from "./InkBoil";
import { StickFigure, POSE, mixPose, squash, type Pose } from "./StickFigure";
import { DrawPath, Orb, circD, waveD } from "./LineArt";
import { E, P, env, hash, lerp } from "./anim";
import { C, FONT, FPS, FLOOR, useReligiousFonts } from "./theme";
import data from "./data/law.json";

/**
 * Naseeha «لا تقل لو» — Sheikh Muhammad ibn Salih al-Uthaymeen (name as on the original clip). Voice only: music and
 * booms removed (BS-RoFormer + htdemucs_ft average), then a light clarity EQ; quiet drone bed; no SFX. Style v2.
 * One figure, one story, each shot grows from the previous:
 * looks back, an imagined coral path behind him («لو أني فعلت») -> the path breaks («انتهى الأمر راح») -> he turns
 * forward, hands raised, light from above, worries straighten into gold («سلّم الأمر للملك الجبار») -> a heavy coral
 * cloud rains on him («كره الإنسان وقوعه») -> where the rain fell a sprout grows into a glowing tree («خيراً له»).
 */
type Word = { t: string; on: number; off: number; k: string };
type Page = { start: number; end: number; breaks: number[]; words: Word[] };
const D = data as unknown as { off: number; total: number; pages: Page[] };
const PG = D.pages;
const NP = PG.length;
const w = (p: number, i: number) => PG[p].words[i].on;
const SW = PG.map((p, k) => (k + 1 < NP ? PG[k + 1].start - 0.25 : D.total));
// hold 1.4 s after the last word so the payoff (the tree of «خيراً له») is seen before the outro
const OUTRO = PG[NP - 1].words[PG[NP - 1].words.length - 1].off + 0.25 + 1.4;
const pageAtT = (t: number) => {
  let k = 0;
  for (let i = 1; i < NP; i++) if (t >= SW[i - 1]) k = i;
  return k;
};
const find = (p: number, s: string) => {
  const i = PG[p].words.findIndex((x) => x.t.includes(s));
  return w(p, Math.max(0, i));
};

const Label: React.FC<{ x: number; y: number; text: string; op: number; color?: string; size?: number }> = ({ x, y, text, op, color = C.teal, size = 15 }) =>
  op <= 0.001 ? null : (
    <text x={x} y={y} textAnchor="middle" fill={color} opacity={op} style={{ fontFamily: FONT.mono, fontSize: size, letterSpacing: ".3em" }}>
      {text}
    </text>
  );

// looking back over the shoulder (bowed, head turned to the left side)
const LOOK_BACK: Pose = { ...POSE.bowed, f: -0.8, hd: 18, m: -0.6 };
const HX = 600;

const Scene: React.FC<{ t: number }> = ({ t }) => {
  // ---- times ----
  const tLaw = find(0, "لَوْ");
  const tGone = w(1, 0); // انتهى
  const tSallim = find(1, "سَلِّمِ");
  const tMalik = find(1, "لِلْمَلِكِ");
  const tKariha = find(2, "كَرِهَ");
  const tKhayr = find(3, "خَيْرًا");

  // ---- the figure ----
  const keys: [number, Pose][] = [
    [0, LOOK_BACK],
    [tSallim - 0.2, POSE.chest],
    [tMalik - 0.1, POSE.dua],
    [tKariha - 0.3, POSE.bowed],
    [PG[3].start - 0.1, POSE.stand],
    [tKhayr - 0.1, POSE.raise],
  ];
  let pose = keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t >= keys[i][0]) pose = mixPose(keys[i - 1][1], keys[i][1], P(t, keys[i][0], 0.85, E.back));
  pose = { ...pose, sq: squash(t, keys.slice(1).map((k) => k[0]), 1.2) };
  const figOp = P(t, PG[0].start - 0.6, 0.8, E.s);

  // ---- page 0: the imagined path behind him («لو») and worries ----
  const lawU = P(t, tLaw - 0.2, 1.0, E.io);
  const broken = P(t, tGone - 0.1, 1.2, E.io); // «انتهى الأمر راح»
  const worry = env(t, PG[0].start - 0.2, 0.6, tMalik + 0.6, 0.8);
  const calm = P(t, tSallim, 1.6, E.io);
  // ---- page 1: light from above (light only) ----
  const light = env(t, tMalik - 0.3, 1.0, PG[2].start - 0.2, 0.8) + 0.8 * P(t, tKhayr, 1.2) ;
  // ---- page 2: the cloud he disliked ----
  const cloud = env(t, PG[2].start - 0.4, 0.8, tKhayr + 0.2, 0.8);
  const rain = env(t, tKariha - 0.1, 0.4, PG[3].start + 0.4, 0.6);
  // ---- page 3: the good outcome grows where the rain fell ----
  const grow = P(t, PG[3].start - 0.6, 2.2, E.o);
  const bloom = P(t, tKhayr - 0.1, 1.2, E.o);
  const TX = 330, TB = FLOOR; // tree base

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="lRays" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.gold} stopOpacity={0.4} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="lGlow">
          <stop offset="0" stopColor="#FFF3CF" stopOpacity={0.5} />
          <stop offset="0.5" stopColor={C.gold} stopOpacity={0.15} />
          <stop offset="1" stopColor={C.gold} stopOpacity={0} />
        </radialGradient>
      </defs>
      <line x1={90} x2={990} y1={FLOOR} y2={FLOOR} stroke={C.mgold} strokeWidth={1.2} opacity={0.5 * figOp} />

      {/* light from above — light only («للملك الجبار عز وجل») */}
      {light > 0.001 &&
        Array.from({ length: 9 }, (_, i) => {
          const a = Math.min(1, light);
          const x0 = HX + (i - 4) * 16, x1 = HX + (i - 4) * 62;
          return <path key={i} d={`M${x0 - 3},150 L${x0 + 3},150 L${x1 + 12},${lerp(150, 1000, a)} L${x1 - 12},${lerp(150, 1000, a)} Z`} fill="url(#lRays)" opacity={0.6 * a} />;
        })}

      {/* the road he walked (gold, ahead) and the imagined road behind him («لو أني فعلت») that breaks */}
      <DrawPath d={`M${HX},${FLOOR} C${HX + 120},${FLOOR - 40} ${HX + 260},${FLOOR - 160} ${HX + 360},${FLOOR - 420}`} progress={P(t, PG[0].start - 0.2, 1.2, E.io)} color={C.gold} width={1.8} opacity={0.5 + 0.5 * calm} glow={calm > 0.5} />
      {lawU > 0.001 &&
        Array.from({ length: 14 }, (_, i) => {
          // the imagined path: dashes that drift apart and fall when «انتهى الأمر»
          const u0 = i / 14, u1 = (i + 0.55) / 14;
          const pt = (u: number) => [HX - 40 - u * 420, FLOOR - 20 - Math.sin(u * Math.PI * 0.9) * 360];
          const [x0, y0] = pt(u0), [x1, y1] = pt(u1);
          const fall = P(broken, (13 - i) * 0.035, 0.5, E.i);
          const dx = (hash(i, 2) - 0.5) * 60 * fall, dy = 220 * fall * (0.5 + hash(i, 3));
          return (
            <line key={i} x1={x0 + dx} y1={y0 + dy} x2={x1 + dx} y2={y1 + dy} stroke={C.coral} strokeWidth={2.2} strokeLinecap="round" opacity={P(lawU, u0 * 0.8, 0.2) * (1 - fall) * 0.9} />
          );
        })}
      <Label x={HX - 300} y={FLOOR - 430} text="LAW · IF ONLY" op={lawU * (1 - broken)} color={C.coralText} />

      {/* worries over his head straighten into gold when he hands the matter over */}
      {worry > 0.001 &&
        [0, 1, 2].map((i) => (
          <DrawPath key={i} d={waveD(HX - 130, HX + 130, FLOOR - 560 - i * 34, lerp(16, 0, calm), 46, t * 2.6 + i)} progress={1} color={calm > 0.5 ? C.gold : C.coral} width={2} opacity={worry * 0.85} />
        ))}

      {/* the thing he disliked: a heavy cloud and rain */}
      {cloud > 0.001 && (
        <g opacity={cloud}>
          <DrawPath d={`M${HX - 170},${560} C${HX - 190},${500} ${HX - 110},${460} ${HX - 60},${490} C${HX - 30},${430} ${HX + 70},${430} ${HX + 90},${485} C${HX + 160},${470} ${HX + 190},${545} ${HX + 130},${565} Z`} progress={P(t, PG[2].start - 0.4, 1.0, E.io)} color={C.coral} width={2.2} />
          {rain > 0.001 &&
            Array.from({ length: 16 }, (_, i) => {
              const ph = (t * 1.4 + hash(i, 4)) % 1;
              const x = HX - 150 + hash(i, 5) * 280 - ph * 24;
              return <line key={i} x1={x} y1={590 + ph * 520} x2={x - 8} y2={620 + ph * 520} stroke={C.coral} strokeWidth={1.6} opacity={rain * 0.75 * (1 - ph)} />;
            })}
          <Label x={HX} y={420} text="KARIHA · DISLIKED" op={P(t, tKariha, 0.5) * (1 - grow)} color={C.coralText} />
        </g>
      )}

      {/* the good outcome: a sprout where the rain fell, becoming a glowing tree */}
      {grow > 0.001 && (
        <g>
          <ellipse cx={TX} cy={TB - 260} rx={220} ry={240} fill="url(#lGlow)" opacity={bloom} />
          <DrawPath d={`M${TX},${TB} C${TX - 6},${TB - 120} ${TX + 10},${TB - 240} ${TX},${TB - lerp(60, 330, grow)}`} progress={grow} color={C.gold} width={3} glow />
          {[
            [-1, 0.45, 70],
            [1, 0.6, 80],
            [-1, 0.78, 60],
            [1, 0.9, 50],
          ].map(([s, at, len], i) => {
            const u = P(grow, (at as number) - 0.2, 0.4, E.o);
            const y = TB - 330 * (at as number);
            return <DrawPath key={i} d={`M${TX},${y} Q${TX + (s as number) * (len as number) * 0.6},${y - 30} ${TX + (s as number) * (len as number)},${y - 50}`} progress={u} color={C.gold} width={2} />;
          })}
          {Array.from({ length: 9 }, (_, i) => {
            const a = (i / 9) * Math.PI * 2;
            const u = P(t, tKhayr - 0.2 + i * 0.06, 0.6, E.back);
            return <Orb key={i} x={TX + Math.cos(a) * 110 * u} y={TB - 360 + Math.sin(a) * 80 * u} r={8 * u} opacity={u} />;
          })}
          <DrawPath d={circD(TX, TB - 360, 150)} progress={bloom} color={C.mgold} width={1} dash="2 9" opacity={0.6 * bloom} />
          <Label x={TX} y={TB - 560} text="KHAYR · THE GOOD END" op={bloom} color={C.gold} />
        </g>
      )}

      <StickFigure pose={pose} x={HX} t={t} opacity={figOp} />
    </svg>
  );
};

/** HOOK over the logo intro (plain words, not a quote) */
const Hook: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const op = env(t, 0.45, 0.5, 2.55, 0.45);
  if (op <= 0.001) return null;
  const u = P(t, 0.45, 0.9, E.o);
  return (
    <div style={{ position: "absolute", left: 60, width: 960, top: 1300, textAlign: "center", direction: "rtl", fontFamily: FONT.ar, fontWeight: 700, fontSize: 58, lineHeight: 1.5, color: C.white, opacity: op, transform: `translateY(${(1 - u) * 18}px)` }}>
      قبل أن تقول:
      <br />
      «<span style={{ color: C.coralText }}>لو</span> أنّي فعلتُ…»
    </div>
  );
};

export const LawReel: React.FC = () => {
  const ready = useReligiousFonts();
  const t = useCurrentFrame() / FPS;
  if (!ready) return null;
  const k = pageAtT(t);
  const wf = worldFade(t, OUTRO);
  return (
    <AbsoluteFill>
      <NavyBackground dustBoost={1 + 0.9 * env(t, find(3, "خَيْرًا"), 1, OUTRO, 1)}>
        <AbsoluteFill style={{ opacity: wf }}>
          <InkLayer>
            <Scene t={t} />
          </InkLayer>
        </AbsoluteFill>
        <TextShield />
        <HudFrame left="NASEEHA · QADAR" category="نصيحة" topic="لا تقل لو" title="LA TAQUL LAW" counter={`0${k + 1} / 0${NP}`} outAt={OUTRO} switches={SW.slice(0, -1)} />
        <ProgressTicks count={NP} index={k} opacity={wf * (t > 2 ? 1 : 0)} />
        <div style={{ opacity: wf }}>
          {PG.map((p, i) => (
            <TipCaption key={i} words={p.words} start={p.start - 0.15} end={SW[i] + 0.1} variant="naskh" boxes={false} breaks={p.breaks} size={60} y={1420} source="الشيخ محمد بن صالح العثيمين رحمه الله" />
          ))}
        </div>
        <LogoIntro sub="NASEEHA · REMINDER" />
        <LogoOutro
          outroAt={OUTRO}
          total={D.total}
          cta={
            <>
              قدَّرَ اللهُ <span style={{ color: C.gold }}>وما شاءَ فعل</span>
              <div style={{ marginTop: 34, fontSize: 40, fontWeight: 500, color: C.grey }}>
                انشرها لتنال <span style={{ color: C.gold }}>الأجر</span>
              </div>
            </>
          }
        />
      </NavyBackground>
      <Audio src={staticFile("religious/law/mix.wav")} />
      <Hook />
    </AbsoluteFill>
  );
};

export const LAW_TOTAL = D.total;
