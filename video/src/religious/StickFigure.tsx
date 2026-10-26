import React from "react";
import { C, FLOOR } from "./theme";
import { clamp, lerp, rad } from "./anim";

/**
 * OPTIONAL character layer (only for some verse / podcast videos; the base HUD style stays).
 * Ayman's rules: minimal PURE WHITE stick figure, solid round head, NO EYES, only a single-line mouth;
 * emotion through body language (slump = fear/sin, open chest = peace, raised hands / dua = hope,
 * hands on chest = contentment, sujud = submission); smooth puppet animation, squash-and-stretch.
 * Size: 002 used scale 1.62 for the hero (001's figures were judged too small -> ~1.5× bigger).
 * Ported 1:1 from the 002 reel (lib.js class Fig).
 */
const LEN = { th: 64, sh: 62, sp: 98, neck: 12, hr: 25, ua: 54, fa: 50 };
export type Pose = {
  sp: number; hd: number; uaL: number; faL: number; uaR: number; faR: number;
  thL: number; shL: number; thR: number; shR: number;
  m: number; // mouth curve -1 (sad) .. 1 (smile)
  f: number; // facing: 0 front, ±1 side
  sl: number; // spine length factor
  kn?: number; gh?: number; mo?: number;
  sq?: number; // squash (-0.05..0.05)
  lift?: number; br?: number; bp?: number; ph?: number;
};
export const POSE: Record<string, Pose> = {
  stand: { sp: 0, hd: 0, uaL: -13, faL: -7, uaR: 13, faR: 7, thL: -7, shL: -4, thR: 7, shR: 4, m: 0.25, f: 0, sl: 1 },
  bowed: { sp: 4, hd: 26, uaL: -6, faL: -2, uaR: 6, faR: 2, thL: -6, shL: -3, thR: 6, shR: 3, m: -0.5, f: 0, sl: 0.97 },
  slump: { sp: 6, hd: 22, uaL: -4, faL: 2, uaR: 6, faR: 3, thL: -4, shL: -2, thR: 5, shR: 3, m: -0.75, f: 0, sl: 0.9 },
  open: { sp: 0, hd: -6, uaL: -34, faL: -24, uaR: 34, faR: 24, thL: -9, shL: -6, thR: 9, shR: 6, m: 0.85, f: 0, sl: 1.03 },
  chest: { sp: 0, hd: -3, uaL: -26, faL: 118, uaR: 26, faR: -118, thL: -7, shL: -4, thR: 7, shR: 4, m: 0.55, f: 0, sl: 1.01 },
  dua: { sp: 0, hd: -10, uaL: -30, faL: 168, uaR: 30, faR: -168, thL: -7, shL: -4, thR: 7, shR: 4, m: 0.35, f: 0, sl: 1.01 },
  raise: { sp: 0, hd: -14, uaL: -150, faL: -162, uaR: 150, faR: 162, thL: -9, shL: -6, thR: 9, shR: 6, m: 0.95, f: 0, sl: 1.04 },
  offer: { sp: 0, hd: 4, uaL: -30, faL: -100, uaR: 30, faR: 100, thL: -7, shL: -4, thR: 7, shR: 4, m: 0.5, f: 0, sl: 1.0 },
  kneel: { sp: 8, hd: 10, uaL: -14, faL: -6, uaR: 14, faR: 6, thL: -20, shL: -90, thR: 20, shR: 92, m: 0.2, f: 0, sl: 1, kn: 1 },
  kneelBow: { sp: 16, hd: 30, uaL: -6, faL: 40, uaR: 8, faR: -36, thL: -20, shL: -90, thR: 20, shR: 92, m: -0.6, f: 0, sl: 0.95, kn: 1 },
  kneelChest: { sp: 6, hd: 18, uaL: -24, faL: 116, uaR: 24, faR: -116, thL: -20, shL: -90, thR: 20, shR: 92, m: -0.45, f: 0, sl: 0.97, kn: 1 },
  kneelOffer: { sp: 2, hd: 8, uaL: -26, faL: -96, uaR: 26, faR: 96, thL: -20, shL: -90, thR: 20, shR: 92, m: 0.1, f: 0, sl: 1, kn: 1 },
  kneelUp: { sp: 0, hd: -12, uaL: -24, faL: 116, uaR: 24, faR: -116, thL: -20, shL: -90, thR: 20, shR: 92, m: 0.55, f: 0, sl: 1.02, kn: 1 },
  kneelDua: { sp: 0, hd: -12, uaL: -30, faL: 168, uaR: 30, faR: -168, thL: -20, shL: -90, thR: 20, shR: 92, m: 0.45, f: 0, sl: 1.02, kn: 1 },
  sit: { sp: 0, hd: 6, uaL: -25, faL: -40, uaR: 25, faR: 40, thL: -74, shL: 66, thR: 74, shR: -66, m: 0.45, f: 0, sl: 1 },
  sitDua: { sp: 0, hd: -10, uaL: -30, faL: 168, uaR: 30, faR: -168, thL: -74, shL: 66, thR: 74, shR: -66, m: 0.5, f: 0, sl: 1.01 },
  sujud: { sp: 104, hd: 10, uaL: 40, faL: 90, uaR: 46, faR: 92, thL: -8, shL: -90, thR: -12, shR: -92, m: 0.4, f: 1, sl: 1, gh: 1, mo: 0 },
  kneelSide: { sp: 14, hd: 14, uaL: 20, faL: 60, uaR: 26, faR: 66, thL: -6, shL: -90, thR: -10, shR: -92, m: 0.4, f: 1, sl: 1, mo: 1 },
};

/** blend two poses (u 0..1) — animate by keyframing pose names over time */
export const mixPose = (a: Pose, b: Pose, u: number): Pose => {
  const o = { ...a } as Record<string, number>;
  const B = b as unknown as Record<string, number>;
  for (const k in B) o[k] = k in o ? lerp(o[k], B[k], u) : B[k];
  return o as unknown as Pose;
};

/** squash-and-stretch around landing / key moments (times in s) */
export const squash = (t: number, keys: number[], amp = 1) => {
  let sq = 0;
  for (const kt of keys) {
    const a = t - kt;
    if (a > -0.18 && a < 0.6) sq += a < 0 ? -0.035 * Math.sin((Math.PI * (a + 0.18)) / 0.18) : 0.03 * Math.sin((Math.PI * a) / 0.3) * Math.exp(-a * 5);
  }
  return clamp(sq * amp, -0.05, 0.05);
};

export const StickFigure: React.FC<{
  pose: Pose;
  x: number;
  t: number; // seconds (breathing)
  scale?: number;
  floor?: number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}> = ({ pose: p, x, t, scale = 1.62, floor = FLOOR, color = C.white, strokeWidth = 11, opacity = 1 }) => {
  if (opacity <= 0.002) return null;
  const s = scale;
  const o = (a: number, l: number): [number, number] => [Math.sin(rad(a)) * l, Math.cos(rad(a)) * l];
  const br = 1 + (p.br ?? 0.012) * Math.sin((t * 2 * Math.PI) / (p.bp || 3.4) + (p.ph || 0));
  const sl = (p.sl || 1) * br;
  const kL = o(p.thL, LEN.th), fL: [number, number] = [kL[0] + o(p.shL, LEN.sh)[0], kL[1] + o(p.shL, LEN.sh)[1]];
  const kR = o(p.thR, LEN.th), fR: [number, number] = [kR[0] + o(p.shR, LEN.sh)[0], kR[1] + o(p.shR, LEN.sh)[1]];
  const sp = rad(p.sp), up = [Math.sin(sp), -Math.cos(sp)];
  const N: [number, number] = [up[0] * LEN.sp * sl, up[1] * LEN.sp * sl];
  const S: [number, number] = [up[0] * (LEN.sp * sl - 10), up[1] * (LEN.sp * sl - 10)];
  const ha = rad(p.sp + p.hd);
  const Hc: [number, number] = [N[0] + Math.sin(ha) * (LEN.neck + LEN.hr), N[1] - Math.cos(ha) * (LEN.neck + LEN.hr)];
  let low = Math.max(kL[1], fL[1], kR[1], fR[1]);
  if (p.gh) low = Math.max(low, Hc[1] + LEN.hr - 2);
  const hip = [x, floor - low * s - (p.lift || 0)];
  const T = (v: [number, number]) => [hip[0] + v[0] * s, hip[1] + v[1] * s];
  const pt = (v: [number, number]) => T(v).map((n) => n.toFixed(2)).join(",");
  const eL: [number, number] = [S[0] + o(p.uaL, LEN.ua)[0], S[1] + o(p.uaL, LEN.ua)[1]];
  const hL: [number, number] = [eL[0] + o(p.faL, LEN.fa)[0], eL[1] + o(p.faL, LEN.fa)[1]];
  const eR: [number, number] = [S[0] + o(p.uaR, LEN.ua)[0], S[1] + o(p.uaR, LEN.ua)[1]];
  const hR: [number, number] = [eR[0] + o(p.faR, LEN.fa)[0], eR[1] + o(p.faR, LEN.fa)[1]];
  const hc = T(Hc);
  const f = p.f || 0, mw = 13 * (1 - 0.38 * Math.abs(f)) * s, mx = f * 9 * s, my = 8.5 * s, c = (p.m || 0) * 7 * s;
  const rot = (xx: number, yy: number) => [hc[0] + xx * Math.cos(ha) - yy * Math.sin(ha), hc[1] + xx * Math.sin(ha) + yy * Math.cos(ha)];
  const a = rot(mx - mw / 2, my), b = rot(mx, my + c), d = rot(mx + mw / 2, my);
  const sq = p.sq || 0, gy = floor - (p.lift || 0);
  const st = { fill: "none", stroke: color, strokeWidth: strokeWidth * s, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <g opacity={opacity} transform={`translate(${x},${gy}) scale(${1 - sq * 0.5},${1 + sq}) translate(${-x},${-gy})`}>
      <path {...st} d={`M${pt([0, 0])} L${pt(kL)} L${pt(fL)}`} />
      <path {...st} d={`M${pt([0, 0])} L${pt(kR)} L${pt(fR)}`} />
      <path {...st} d={`M${pt([0, 0])} L${pt(N)}`} />
      <path {...st} d={`M${pt(S)} L${pt(eL)} L${pt(hL)}`} />
      <path {...st} d={`M${pt(S)} L${pt(eR)} L${pt(hR)}`} />
      <circle cx={hc[0]} cy={hc[1]} r={LEN.hr * s} fill={color} />
      {/* NO eyes. Mouth only. */}
      <path
        d={`M${a[0]},${a[1]} Q${b[0]},${b[1]} ${d[0]},${d[1]}`}
        fill="none"
        stroke={C.navy}
        strokeWidth={3.4 * s}
        strokeLinecap="round"
        opacity={p.mo == null ? 1 : clamp(p.mo)}
      />
    </g>
  );
};
