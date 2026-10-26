import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { C, FPS } from "./theme";
import { hash } from "./anim";

/**
 * The ONE persistent world of every religious reel: navy radial vignette + faint drifting dust + film grain.
 * Never cut away from it, never zoom it (Ayman's base style has 0 hard cuts and no Ken Burns).
 * dustBoost > 1 brightens the dust at a climax (002 used 1 + 1.2 * climax).
 */
const DUST = Array.from({ length: 110 }, (_, i) => ({
  x: hash(i, 11) * 1080,
  y: hash(i, 12) * 1920,
  r: 0.6 + hash(i, 13) * 1.9,
  vx: (hash(i, 14) - 0.5) * 6,
  vy: -2 - hash(i, 15) * 8,
  ph: hash(i, 16) * 6.28,
  a: 0.12 + hash(i, 17) * 0.4,
  gold: hash(i, 18) > 0.3,
}));

export const NavyBackground: React.FC<{ dustBoost?: number; grain?: number; children?: React.ReactNode }> = ({
  dustBoost = 1,
  grain = 0.075,
  children,
}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  return (
    <AbsoluteFill style={{ background: C.deep, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 55% at 50% 45%, ${C.centre} 0%, ${C.mid} 55%, ${C.deep} 100%)`,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="dustG">
            <stop offset="0" stopColor="#FFF6D6" stopOpacity={1} />
            <stop offset="0.22" stopColor={C.gold} stopOpacity={0.75} />
            <stop offset="0.55" stopColor={C.gold} stopOpacity={0.18} />
            <stop offset="1" stopColor={C.gold} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="dustW">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
            <stop offset="0.22" stopColor={C.white} stopOpacity={0.75} />
            <stop offset="0.55" stopColor={C.white} stopOpacity={0.18} />
            <stop offset="1" stopColor={C.white} stopOpacity={0} />
          </radialGradient>
        </defs>
        {DUST.map((d, i) => {
          let x = (d.x + d.vx * t + 12 * Math.sin(t * 0.21 + d.ph)) % 1080;
          if (x < 0) x += 1080;
          let y = (d.y + d.vy * t) % 1920;
          if (y < 0) y += 1920;
          const a = Math.min(1, d.a * (0.55 + 0.45 * Math.sin(t * 0.9 + d.ph * 3)) * dustBoost);
          return <circle key={i} cx={x} cy={y} r={d.r * 4.4} fill={d.gold ? "url(#dustG)" : "url(#dustW)"} opacity={a} />;
        })}
      </svg>
      {children}
      {/* vignette */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse 78% 62% at 50% 46%, rgba(5,10,15,0) 55%, rgba(5,10,15,.55) 100%)",
        }}
      />
      {/* grain: 512 px tile grid shifted every frame (Img, not background-image, so Remotion waits for it) */}
      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: grain, overflow: "hidden" }}>
        {Array.from({ length: 20 }, (_, i) => (
          <Img
            key={i}
            src={staticFile("religious/grain_tile_512.png")}
            style={{
              position: "absolute",
              width: 512,
              height: 512,
              left: (i % 4) * 512 - Math.floor(hash(f, 1) * 512),
              top: Math.floor(i / 4) * 512 - Math.floor(hash(f, 2) * 512),
            }}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** dark gradient behind the verse text so light rays / scenery never cross the words (001 bug, fixed in 002) */
export const TextShield: React.FC<{ top?: number }> = ({ top = 1180 }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top,
      width: 1080,
      height: 1920 - top,
      pointerEvents: "none",
      background: "linear-gradient(180deg, rgba(10,20,29,0) 0, rgba(10,20,29,.55) 110px, rgba(10,20,29,.62) 100%)",
    }}
  />
);
