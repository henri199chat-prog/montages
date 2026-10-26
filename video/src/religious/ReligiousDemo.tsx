import React from "react";
import { RecitationReel } from "./RecitationReel";
import { StickFigure, POSE, mixPose, squash } from "./StickFigure";
import { DrawPath, Orb, Spotlight, pointArchD, waveD, circD } from "./LineArt";
import { E, P, env, kf, lerp } from "./anim";
import { C, FLOOR } from "./theme";
import data from "./data/sample-tawbah-102-104.json";
import type { AyahData } from "./types";

/**
 * DEMO (silent): At-Tawbah 9:102–104 with the real word timings of Ayman's 002 reel.
 * Shows how to key visuals to words: page 0 «اعترفوا بذنوبهم» = slumped figure + coral squiggles,
 * page 1 «عسى الله أن يتوب عليهم» = spotlight + squiggles straighten into gold, figure lifts hands (dua),
 * page 2–3 = pointed arch (mihrab) draws, rising orbs (prayers / sadaqa), page 4–5 = door of tawbah glows, raise.
 * Render: npx remotion render ReligiousDemo ../videos/religious-demo-v1.mp4
 */
const D = data as AyahData;
const W = (p: number, i: number) => D.pages[p].words[i].on;
const PS = (p: number) => D.pages[p].start;
const PE = (p: number) => D.pages[p].end;

const Scene: React.FC<{ t: number }> = ({ t }) => {
  // pose timeline (seconds keyed to words)
  const poses: [number, keyof typeof POSE][] = [
    [0, "stand"],
    [W(0, 2), "slump"],
    [W(1, 3), "chest"],
    [W(1, 6), "dua"],
    [W(2, 0), "offer"],
    [W(3, 0), "kneelDua"],
    [W(4, 0), "stand"],
    [W(5, 5), "raise"],
  ];
  let pose = POSE.stand;
  for (let i = 0; i < poses.length; i++) {
    const [t0, name] = poses[i];
    if (t >= t0) pose = i === 0 ? POSE[name] : mixPose(POSE[poses[i - 1][1]], POSE[name], P(t, t0, 0.9, E.io));
  }
  pose = { ...pose, sq: squash(t, poses.slice(1).map((p) => p[0])) };
  const figOp = P(t, 3.0, 0.8, E.s);
  // worries: coral squiggles -> straight gold lines on «يتوب عليهم»
  const calm = P(t, W(1, 3), 1.6, E.io);
  const worryOp = env(t, W(0, 2) - 0.2, 0.8, PE(1), 1.0);
  const archU = P(t, PS(2) + 0.4, 2.2, E.io);
  const doorGlow = env(t, W(4, 0), 1.5, D.total - 5, 1.0);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {/* floor line opens from the centre */}
      <line x1={540 - 460 * P(t, 3.0, 1.0, E.o)} x2={540 + 460 * P(t, 3.0, 1.0, E.o)} y1={FLOOR} y2={FLOOR} stroke={C.mgold} strokeWidth={1.2} opacity={0.6} />
      {/* mihrab / door of tawbah */}
      <DrawPath d={pointArchD(540, FLOOR, 420, 640)} progress={archU} width={2.2} opacity={0.9} />
      <DrawPath d={pointArchD(540, FLOOR, 460, 690)} progress={archU} color={C.mgold} width={1.1} dash="2 9" opacity={0.6 * archU} />
      <path d={pointArchD(540, FLOOR, 420, 640)} fill={C.gold} opacity={0.12 * doorGlow} style={{ filter: "blur(30px)" }} />
      <Spotlight x={540} floor={FLOOR} opacity={0.9 * env(t, W(1, 0), 1.2, D.total - 5, 1)} />
      {/* worries around the head */}
      {[0, 1, 2].map((i) => (
        <DrawPath
          key={i}
          d={waveD(330, 750, 640 + i * 70, lerp(26, 0, calm), 70, t * 2 + i)}
          progress={1}
          color={calm > 0.5 ? C.gold : C.coral}
          width={2}
          opacity={worryOp * (0.5 + 0.2 * i)}
        />
      ))}
      {/* ripples of mercy on «غفور رحيم» */}
      {[0, 1, 2].map((i) => (
        <DrawPath key={i} d={circD(540, 760, 60 + i * 55 + 30 * P(t, W(1, 7) + i * 0.3, 2))} progress={P(t, W(1, 7) + i * 0.3, 1.2)} width={1.4} opacity={0.5 * env(t, W(1, 7), 0.5, PE(1), 1)} />
      ))}
      {/* rising orbs: sadaqa / prayers go up */}
      {Array.from({ length: 6 }, (_, i) => {
        const b = W(2, 2) + i * 0.7;
        const u = (t - b) / 3.2;
        if (u < 0 || u > 1) return null;
        return <Orb key={i} x={540 + (i % 2 ? 1 : -1) * (40 + i * 18)} y={lerp(FLOOR - 200, 300, E.o(u))} r={7} opacity={Math.sin(Math.PI * u)} />;
      })}
      <StickFigure pose={pose} x={540} t={t} opacity={figOp} />
    </svg>
  );
};

export const ReligiousDemo: React.FC = () => (
  <RecitationReel
    data={D}
    hudLeft={(_, n) => `QURAN · 09:${n}`}
    topic="سورة التوبة"
    title="AT-TAWBAH · 9 : 102 — 104"
    counter={(_, n) => `0${n - 101} / 03`}
    scene={(t) => <Scene t={t} />}
    camera={(t) =>
      kf(t, [
        [0, { s: 1, x: 540, y: 960 }],
        [PE(0), { s: 1.08, x: 540, y: 930 }],
        [PE(1), { s: 1.0, x: 550, y: 900 }],
        [PE(3), { s: 1.06, x: 540, y: 880 }],
        [D.total, { s: 1.0, x: 540, y: 950 }],
      ], E.s)
    }
    dustBoost={(t) => 1 + 1.2 * env(t, W(5, 5) - 0.4, 1.2, PE(5), 2.0)}
  />
);
