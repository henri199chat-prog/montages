import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { C, FONT, FPS, FLOOR } from "./theme";
import { E, P, env, lerp } from "./anim";

/**
 * Ayman's logo + page name, professional at the START and the END of every religious reel (002 reel, 1:1 timings).
 * INTRO (0–3 s): thin ring draws, logo (380 px @ y 800) resolves from blur with a light sweep masked by the logo,
 *   "aymen.1303" opens up under it (46 px, letter-spacing .9em -> .32em) with sub "QURAN · RECITATION",
 *   then the name flies to the footer watermark, the logo shrinks to the top (118 px) and a gold dot drops a line
 *   from the logo to the floor. Voice starts at OFF (3.0 s in 002, 1.8 s in 001).
 * OUTRO (from outroAt = last word end + 0.25): logo 430 px @ y 720 with rotating dashed ring and a sweep,
 *   name at y 985, "FOLLOW · SHARE", CTA at y 1135, everything fades in the last 0.45 s. Hold ≈ 4.8 s.
 */
const LOGO = "religious/logo_rgba.png";

const Ring: React.FC<{ cx: number; cy: number; r: number; draw: number; dashedOp: number; rot: number }> = ({ cx, cy, r, draw, dashedOp, rot }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {draw > 0 && (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={C.mgold}
        strokeWidth={1.3}
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - draw}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    )}
    <circle
      cx={cx}
      cy={cy}
      r={r + 22}
      fill="none"
      stroke={C.mgold}
      strokeWidth={1}
      strokeDasharray="2 10"
      opacity={dashedOp}
      transform={`rotate(${rot} ${cx} ${cy})`}
    />
  </svg>
);

const Sweep: React.FC<{ size: number; cy: number; u: number; o: number }> = ({ size, cy, u, o }) =>
  o <= 0.001 ? null : (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: 540 - size / 2,
        top: cy - size / 2,
        opacity: o,
        mixBlendMode: "screen",
        WebkitMaskImage: `url(${staticFile(LOGO)})`,
        WebkitMaskSize: "100% 100%",
        maskImage: `url(${staticFile(LOGO)})`,
        maskSize: "100% 100%",
        background: `linear-gradient(115deg, rgba(255,250,230,0) ${u * 160 - 60}%, rgba(255,250,230,.95) ${u * 160 - 45}%, rgba(255,250,230,0) ${u * 160 - 30}%)`,
      }}
    />
  );

export const LogoIntro: React.FC<{ name?: string; sub?: string; showDrop?: boolean }> = ({
  name = "aymen.1303",
  sub = "QURAN · RECITATION",
  showDrop = true,
}) => {
  const t = useCurrentFrame() / FPS;
  if (t > 6.5) return null;
  const ia = P(t, 0.25, 1.1, E.o), iOut = P(t, 2.05, 0.8, E.io);
  const oy = lerp(800, 196, iOut);
  const sz = lerp(380 * (0.9 + 0.1 * ia), 118, iOut);
  const logoOp = t > 2.85 ? 1 - P(t, 2.85, 0.6, E.s) : P(t, 0.25, 0.9, E.s);
  const nIn = P(t, 0.75, 0.9, E.o), nFly = P(t, 1.85, 0.8, E.io);
  const lto = P(t, 2.8, 0.3, E.s) * (1 - P(t, 5.2, 1.2, E.s));
  const dropU = P(t, 2.55, 1.0, E.io), dy = lerp(262, FLOOR, dropU);
  const dropOp = env(t, 2.5, 0.2, 3.45, 0.4);
  const mask = "radial-gradient(circle at 50% 50%, #000 64%, transparent 71%)";
  return (
    <>
      <Ring cx={540} cy={oy} r={lerp(222, 70, iOut)} draw={P(t, 0.1, 1.2, E.io) * (1 - iOut)} dashedOp={0.5 * env(t, 0.4, 0.8, 1.9, 0.5)} rot={t * 10} />
      <Img
        src={staticFile(LOGO)}
        style={{
          position: "absolute",
          width: sz,
          left: 540 - sz / 2,
          top: oy - sz / 2,
          opacity: logoOp,
          WebkitMaskImage: mask,
          maskImage: mask,
          filter: `blur(${(4 * (1 - ia)).toFixed(2)}px) drop-shadow(0 0 ${(10 + 14 * env(t, 0.6, 0.6, 1.6, 0.8)).toFixed(1)}px rgba(227,204,143,.45))`,
        }}
      />
      <Sweep size={sz} cy={oy} u={P(t, 0.9, 1.0, E.io)} o={env(t, 0.9, 0.2, 1.7, 0.3) * (1 - iOut)} />
      {/* small top logo during the first ayah */}
      <Img
        src={staticFile(LOGO)}
        style={{ position: "absolute", width: 118, left: 481, top: 137, opacity: lto, WebkitMaskImage: mask, maskImage: mask, filter: "drop-shadow(0 0 8px rgba(227,204,143,.4))" }}
      />
      {/* page name: big under the logo, then flies to the footer watermark position */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1080,
          textAlign: "center",
          fontFamily: FONT.mono,
          direction: "ltr",
          whiteSpace: "nowrap",
          color: C.gold,
          fontSize: 46,
          letterSpacing: `${lerp(0.9, 0.32, nIn).toFixed(3)}em`,
          top: lerp(1040, 1816, nFly),
          transform: `translateX(${lerp(0, 388, nFly).toFixed(1)}px) scale(${lerp(1, 0.4, nFly).toFixed(3)})`,
          opacity: nIn * (1 - P(t, 2.6, 0.25, E.s)),
          textShadow: `0 0 ${(18 * env(t, 1.0, 0.5, 1.9, 0.6)).toFixed(1)}px rgba(227,204,143,.6)`,
        }}
      >
        {name}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1080,
          textAlign: "center",
          top: 1112,
          fontFamily: FONT.monoR,
          direction: "ltr",
          color: C.teal,
          fontSize: 19,
          letterSpacing: ".5em",
          opacity: P(t, 1.1, 0.7, E.s) * (1 - P(t, 1.95, 0.4, E.s)),
        }}
      >
        {sub}
      </div>
      {showDrop && dropOp > 0.001 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="dropHalo">
              <stop offset="0" stopColor="#FFF3CF" stopOpacity={0.9} />
              <stop offset="1" stopColor={C.gold} stopOpacity={0} />
            </radialGradient>
          </defs>
          <line x1={540} x2={540} y1={lerp(262, dy, P(t, 3.1, 0.6, E.io))} y2={dy} stroke={C.gold} strokeWidth={1.4} opacity={env(t, 2.5, 0.2, 3.4, 0.6) * 0.8} />
          <circle cx={540} cy={dy} r={16} fill="url(#dropHalo)" opacity={dropOp} />
          <circle cx={540} cy={dy} r={3.4} fill="#FFF3CF" opacity={dropOp} />
        </svg>
      )}
    </>
  );
};

export const LogoOutro: React.FC<{
  outroAt: number; // seconds: last word end + 0.25
  total: number; // video length (s)
  name?: string;
  sub?: string;
  cta?: React.ReactNode; // default «شاركها لعلها تكون صدقة جارية»
}> = ({ outroAt, total, name = "aymen.1303", sub = "FOLLOW · SHARE", cta }) => {
  const t = useCurrentFrame() / FPS;
  if (t < outroAt - 0.2) return null;
  const t0 = outroAt;
  const ou = P(t, t0, 1.8, E.o);
  const fadeEnd = 1 - P(t, total - 0.45, 0.45, E.s);
  const oo = P(t, t0, 1.2, E.s) * fadeEnd;
  const s2 = 430 * (0.86 + 0.14 * ou);
  const mask = "radial-gradient(circle at 50% 50%, #000 64%, transparent 71%)";
  return (
    <>
      <Ring cx={540} cy={720} r={246 * (0.86 + 0.14 * ou)} draw={P(t, t0 + 0.3, 1.6, E.io) * oo} dashedOp={0.5 * oo * P(t, t0 + 0.6, 1)} rot={t * 10} />
      <Img
        src={staticFile(LOGO)}
        style={{
          position: "absolute",
          width: s2,
          left: 540 - s2 / 2,
          top: 720 - s2 / 2,
          opacity: oo,
          WebkitMaskImage: mask,
          maskImage: mask,
          filter: `drop-shadow(0 0 ${(16 + 10 * Math.sin(t * 1.6)).toFixed(1)}px rgba(227,204,143,${(0.35 * ou).toFixed(3)}))`,
        }}
      />
      <Sweep size={s2} cy={720} u={P(t, t0 + 0.9, 1.2, E.io)} o={env(t, t0 + 0.9, 0.2, t0 + 1.9, 0.4)} />
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1080,
          textAlign: "center",
          top: 985,
          fontFamily: FONT.mono,
          direction: "ltr",
          whiteSpace: "nowrap",
          color: C.gold,
          fontSize: 44,
          letterSpacing: `${lerp(0.7, 0.3, P(t, t0 + 0.8, 1.2, E.o)).toFixed(3)}em`,
          opacity: P(t, t0 + 0.7, 1.0, E.s) * fadeEnd,
          textShadow: `0 0 ${(10 + 6 * Math.sin(t * 2)).toFixed(1)}px rgba(227,204,143,.45)`,
        }}
      >
        {name}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1080,
          textAlign: "center",
          top: 1050,
          fontFamily: FONT.monoR,
          direction: "ltr",
          color: C.teal,
          fontSize: 19,
          letterSpacing: ".5em",
          opacity: P(t, t0 + 1.2, 1.0, E.s) * fadeEnd * 0.9,
        }}
      >
        {sub}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: 1080,
          textAlign: "center",
          top: 1135,
          fontFamily: FONT.ar,
          fontWeight: 600,
          fontSize: 46,
          color: C.white,
          direction: "rtl",
          opacity: P(t, t0 + 1.4, 0.9, E.s) * fadeEnd,
          transform: `translateY(${((1 - P(t, t0 + 1.4, 1.0, E.o)) * 12).toFixed(1)}px)`,
        }}
      >
        {cta ?? (
          <>
            شاركها لعلها تكون <span style={{ color: C.gold }}>صدقة جارية</span>
          </>
        )}
      </div>
    </>
  );
};

/** multiply your scene/world layers by this so they fade out for the outro (002: 1 - 0.97 * fade) */
export const worldFade = (t: number, outroAt: number) => 1 - P(t, outroAt - 0.15, 0.9, E.s) * 0.97;
