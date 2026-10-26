---
name: kinetic-typography-remotion
description: Use when animating text in Remotion - hook titles, word-by-word pops, lyric text, highlighted keywords, typewriter text, counters/numbers counting up, text masks and kinetic layouts - with spring/interpolate code that works for Arabic and Latin. Load arabic-text-remotion too whenever the text is Arabic.
---

# Kinetic typography in Remotion

Principles: one idea per screen, max 2 lines, hierarchy by size (key word 1.5–2x), every motion eased
(spring or Easing.out — never linear), entrances 6–12 frames, exits faster (4–8 frames), hold ≥ 1.2 s to read.
Size follows meaning: small connecting words, heavy words big with a pump.

## Building blocks
```tsx
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 1) Pop-in (scale overshoot) — hooks, key words
export const Pop: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const s = spring({ frame: f - delay, fps, config: { damping: 12, stiffness: 180, mass: 0.6 } });
  const o = interpolate(f - delay, [0, 4], [0, 1], clamp);
  return <span style={{ display: "inline-block", transform: `scale(${0.4 + 0.6 * s})`, opacity: o }}>{children}</span>;
};

// 2) Slide-up + blur reveal — calm, premium, religious
export const Rise: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f - delay, [0, 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)`, filter: `blur(${(1 - p) * 8}px)` }}>{children}</div>;
};

// 3) Zoom pump on a heavy word (lyrics/hype): 1.35 -> 1 with slight shake
export const Pump: React.FC<{ children: React.ReactNode; at: number }> = ({ children, at }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 8], [1.35, 1], { ...clamp, easing: Easing.out(Easing.exp) });
  const sh = f >= at && f < at + 6 ? (Math.sin(f * 9) * 6 * (at + 6 - f)) / 6 : 0;
  return <span style={{ display: "inline-block", transform: `translateX(${sh}px) scale(${k})` }}>{children}</span>;
};
```

## Word-by-word (works for Arabic: animate WHOLE words, never letters)
```tsx
const words = text.split(" ");
<div dir="rtl" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.28em", direction: "rtl" }}>
  {words.map((w, i) => <Pop key={i} delay={i * 4}>{w}</Pop>)}
</div>
```
With real timings (TTS `audio/*_timing.json` words or analyze-audio): `delay = Math.round(word.start * fps) - sequenceFrom - 1`.

## Keyword highlight box drawn around the word (religious/analysis)
```tsx
const p = interpolate(f, [at, at + 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
<span style={{ position: "relative", color: p > 0.5 ? "#D9B56A" : "#fff" }}>
  {word}
  <svg style={{ position: "absolute", left: -14, top: -8, width: "calc(100% + 28px)", height: "calc(100% + 16px)", overflow: "visible" }}>
    <rect x="0" y="0" width="100%" height="100%" rx="10" fill="none" stroke="#D9B56A" strokeWidth="3"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </svg>
</span>
```

## Number counter (fast then slows near the value)
```tsx
const v = interpolate(f, [start, start + 45], [0, target], { ...clamp, easing: Easing.out(Easing.exp) });
const shown = Math.round(v).toLocaleString("ar-EG"); // Eastern-Arabic digits ٠١٢; use "en-US" for 0-9
```
Pair with `counter_roll_01.mp3` (tick roll) and a `chime_soft_01` / `boom_cinematic_01` on the final value.

## Typewriter (Latin per character; Arabic per WORD to keep letters joined)
```tsx
const n = Math.floor(interpolate(f, [0, 40], [0, words.length], clamp));
<span>{words.slice(0, n).join(" ")}</span>   // + typewriter_key_0x.mp3 every 2–3 words
```

## Text behind subject (depth)
Put the title between a background layer and a cut-out PNG of the subject (person/character with alpha):
`<Img bg/> <Title/> <Img subject-cutout/>`. Without a cut-out, fake depth with a gradient mask on the text.

## Style recipes
| Look | CSS |
|---|---|
| Caption pill | `background: rgba(0,0,0,.55); borderRadius: 22; padding: "10px 26px"` |
| Hype heavy | Lalezar / Cairo 900, white, `textShadow: "0 6px 0 #000, 0 0 30px rgba(0,0,0,.6)"`, key word yellow `#FFE612` |
| Lyric glow (AMV) | white serif caps, `textShadow: "0 0 18px #3ff, 0 0 40px #0aa"` |
| Religious | Amiri/IBM Plex Sans Arabic, `#F3EEE2`, gold `#D9B56A` keywords, soft `textShadow: "0 2px 12px rgba(0,0,0,.5)"` |
| Stroke outline | `WebkitTextStroke: "3px #000"` + `paintOrder: "stroke fill"` (thin strokes only for Arabic) |

Avoid: per-letter animation of Arabic, letter-spacing on Arabic, more than 2 animated text layers at once,
text over faces, linear easing, text shorter than ~0.8 s on screen.
