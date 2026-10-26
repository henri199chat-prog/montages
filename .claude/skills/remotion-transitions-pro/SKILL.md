---
name: remotion-transitions-pro
description: Use when a Remotion video needs transitions between shots or scenes - match cut, whip pan with motion blur, zoom-through, mask/shape wipe, glitch/RGB split, light-leak or white-flash cut, dip, push/slide - implemented WITHOUT extra npm packages (offline), plus how to use @remotion/transitions only if it is already installed. Includes the SFX to pair with each.
---

# Transitions in Remotion (offline, no extra packages)

`@remotion/transitions` is **not** in `video/package.json` and cannot be installed offline. Check first:
`ls video/node_modules/@remotion/ | grep transitions`. If missing, use the hand-rolled `Overlap` pattern below.

**Rule:** every transition needs a reason (momentum, story, emotion). Default = hard cut on the beat/word.
Fancy transitions only at section changes or big hits; keep one family per video.

## Core pattern: overlap two scenes and drive both with progress `t` (0→1)
```tsx
import { AbsoluteFill, Easing, Img, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
type Tr = React.FC<{ t: number; a: React.ReactNode; b: React.ReactNode }>;
// A plays [0, aLen), B starts at aLen - len; during the overlap the transition renders both.
export const Overlap: React.FC<{ a: React.ReactNode; b: React.ReactNode; aLen: number; bLen: number; len: number; T: Tr }> =
  ({ a, b, aLen, bLen, len, T }) => {
  const f = useCurrentFrame(); const start = aLen - len;
  const t = interpolate(f, [start, aLen], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  if (f < start) return <>{a}</>;
  if (f >= aLen) return <Sequence from={start}>{b}</Sequence>;
  return <T t={t} a={a} b={<Sequence from={start} layout="none">{b}</Sequence>} />;
};
```
(Children inside `<Sequence from={start}>` see their own frame starting at 0, so B's animations start at the overlap.)
Total length = aLen + bLen − len. For chains, compute each scene's `from` = previous end − len.

## Recipes (each is a `Tr`)
```tsx
const L: React.CSSProperties = { position: "absolute", inset: 0 };

// Cross-dissolve (emotional, religious) — len 12–24
export const Dissolve: Tr = ({ t, a, b }) => <AbsoluteFill><div style={L}>{a}</div><div style={{ ...L, opacity: t }}>{b}</div></AbsoluteFill>;

// Whip pan with directional motion blur — len 6–10, pair with whoosh_fast_02 starting ~3 frames before the midpoint
export const Whip: Tr = ({ t, a, b }) => {
  const blur = Math.sin(t * Math.PI) * 60;                   // horizontal blur peak at midpoint
  const id = "whip"; const x = t * -1080;                    // move left
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <svg width={0} height={0}><filter id={id}><feGaussianBlur stdDeviation={`${blur} 0`} /></filter></svg>
    <div style={{ ...L, transform: `translateX(${x}px)`, filter: `url(#${id})` }}>{a}</div>
    <div style={{ ...L, transform: `translateX(${x + 1080}px)`, filter: `url(#${id})` }}>{b}</div>
  </AbsoluteFill>;
};

// Zoom-through (push into A, B emerges) — len 8–14, pair with whoosh_deep_03 / boom on landing
export const ZoomThrough: Tr = ({ t, a, b }) => <AbsoluteFill>
  <div style={{ ...L, transform: `scale(${1 + t * 3})`, filter: `blur(${t * 18}px)`, opacity: 1 - Math.max(0, (t - 0.5) * 2) }}>{a}</div>
  <div style={{ ...L, transform: `scale(${0.6 + 0.4 * t})`, filter: `blur(${(1 - t) * 18}px)`, opacity: Math.min(1, t * 2) }}>{b}</div>
</AbsoluteFill>;

// Mask wipe: circle reveal from a point (eye, light, fist) — len 10–16
export const IrisWipe = (cx = 50, cy = 45): Tr => ({ t, a, b }) => <AbsoluteFill>
  <div style={L}>{a}</div>
  <div style={{ ...L, clipPath: `circle(${t * 120}% at ${cx}% ${cy}%)` }}>{b}</div>
</AbsoluteFill>;

// Diagonal/linear wipe with soft edge
export const Wipe: Tr = ({ t, a, b }) => <AbsoluteFill>
  <div style={L}>{a}</div>
  <div style={{ ...L, WebkitMaskImage: `linear-gradient(115deg, #000 ${t * 140 - 20}%, transparent ${t * 140}%)`,
    maskImage: `linear-gradient(115deg, #000 ${t * 140 - 20}%, transparent ${t * 140}%)` }}>{b}</div>
</AbsoluteFill>;

// White flash / dip — len 6–10 (impact), dip-to-black len 16–24 (time passing)
export const Flash = (color = "#fff"): Tr => ({ t, a, b }) => <AbsoluteFill>
  <div style={L}>{t < 0.5 ? a : b}</div>
  <div style={{ ...L, background: color, opacity: 1 - Math.abs(t - 0.5) * 2 }} />
</AbsoluteFill>;

// Light-leak cut (needs overlays/light_leak_warm_01.jpg in video/public) — len 14–20, pair with shimmer_01
export const LeakCut: Tr = ({ t, a, b }) => <AbsoluteFill>
  <div style={L}>{t < 0.5 ? a : b}</div>
  <Img src={staticFile("overlays/light_leak_warm_01.jpg")} style={{ ...L, width: "100%", height: "100%", mixBlendMode: "screen",
    opacity: Math.sin(t * Math.PI) * 0.95, transform: `scale(${1.2 + t * 0.3}) rotate(${t * 8}deg)` }} />
</AbsoluteFill>;
```
(`Img`, `staticFile` come from `"remotion"`.)

## Glitch / RGB split (heavy impacts, mental breaks, comedy; 3–6 frames, NEVER in religious videos)
```tsx
export const Glitch: React.FC<{ children: React.ReactNode; amount: number }> = ({ children, amount }) => {
  const f = useCurrentFrame(); const r = (k: string) => random(`${k}${f}`) - 0.5;   // random from "remotion"
  const off = amount * 24;
  const ch = (m: string, dx: number) => <div style={{ ...L, transform: `translateX(${dx}px)`, mixBlendMode: "screen", filter: `url(#${m})` }}>{children}</div>;
  return <AbsoluteFill style={{ background: "#000" }}>
    <svg width={0} height={0}>
      <filter id="gR"><feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
      <filter id="gG"><feColorMatrix values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" /></filter>
      <filter id="gB"><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter>
    </svg>
    {ch("gR", off * (1 + r("a")))}{ch("gG", 0)}{ch("gB", -off * (1 + r("b")))}
    {amount > 0.3 && [0, 1, 2].map((i) => { const y = (random(`y${i}${f}`) * 100) | 0; return (
      <div key={i} style={{ ...L, clipPath: `inset(${y}% 0 ${Math.max(0, 100 - y - 6)}% 0)`, transform: `translateX(${r(`s${i}`) * 120 * amount}px)` }}>{children}</div>); })}
  </AbsoluteFill>;
};
// amount = pulse(frame, hitFrames, 5)   (see audio-beat-sync) ; SFX glitch_digital_01 / glitch_03..05
```

## Match cut (the most "pro" transition — no effect at all)
Same shape/motion/position across the cut: a spinning object → a spinning wheel, a fist → a planet, a door slam.
In Remotion, line the focal points up: measure subject centre/size in A's last frame and B's first frame, then
transform B: `transform: translate(dx, dy) scale(k)` easing back to identity over 8–12 frames
(`interpolate(f, [0, 10], [k, 1], {easing: Easing.out(Easing.cubic)})`). Cut exactly on the beat. Optional subtle whoosh.

## Impact accents (not transitions, but used on cuts)
Flash 1–2 frames white/invert (`filter: invert(1)` for one frame) + shake 4–8 frames + zoom pump 1.1→1.
Anime impact frame: 1–2 frames `filter: grayscale(1) contrast(3)` exactly on the hit. Max 3 flashes per second.

## If @remotion/transitions IS installed
```tsx
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade"; import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe"; import { flip } from "@remotion/transitions/flip";
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}><A /></TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: 12 })} />
  <TransitionSeries.Sequence durationInFrames={60}><B /></TransitionSeries.Sequence>
</TransitionSeries>
```
Total = sum of sequences − sum of transition durations. Custom presentations follow the same `t` logic as above.

## SFX pairing (assets/sfx)
| Transition | SFX | Placement |
|---|---|---|
| Whip pan | `whoosh_fast_02`, `swish_0x` | peak at the overlap midpoint (start ~40 % of the file before it) |
| Zoom-through | `whoosh_deep_03` + `boom_sub_02` | whoosh into, boom on landing |
| Build into drop | `riser_noise_01` / `whoosh_reverse_05` | ENDS on the cut |
| Leaving a high moment | `downlifter_01` | starts on the cut |
| Light leak / reveal | `shimmer_01`, `chime_soft_01` | on the brightest frame |
| Glitch | `glitch_digital_01`, `glitch_03..05` | same frames as the visual |
| Flash impact | `hit_trailer_01`, `boom_cinematic_01` | on the flash frame |
| UI slide/push | `swipe_ui_01`, `click_01` | start of motion |
