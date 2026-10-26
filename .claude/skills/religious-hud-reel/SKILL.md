---
name: religious-hud-reel
description: Generic style. For Ayman's own religious videos use the religious-reel skill first (it wins on conflicts). Use before planning or building ANY Islamic religious reel in Remotion (Quran verses, numerical miracles, hadith, reflections, recitation videos) - the house HUD / data-visualisation motion-graphics style with calm SFX and NO music, navy/gold palette, Uthmani verse typography, verification rules and a component kit.
---

# Religious HUD reel (Remotion)

Clean 2D/2.5D motion graphics built in code — not stock footage. The secret is **restraint**: lots of empty space,
ONE element speaking at a time, very soft motion.

## 0. Non-negotiable
- **No music, no singing.** Sound = low drone + clean soft SFX (+ the recitation/voice).
- No depiction of prophets, companions, angels or God in any form. A soul/person = a light orb, dot or abstract icon.
  No nature/mosque stock as main material (a simple vector element is fine).
- Verify every verse (Uthmani script, trusted mushaf), hadith (with grading) and number/statistic. Never invent counts
  or "miracles". If you cannot verify offline, say so and ask the user to confirm the text. Cite small: «البقرة: ٢٥٥».
- Credit the reciter by name on screen only as the user specifies.

## 1. Format & rhythm
9:16, 1080×1920, 30 fps, 45–90 s. On-screen hook from frame 0 (a question or bold statement), no intro.
Cycle: setup (1–2 s) → tension/calculation (3–4 s) → reveal hit (1 s) → breathing room. 1–2 s of ambience before
recitation/VO starts. During recitation: visual calm, no counting, no clicks.

## 2. Palette (one dominant + one accent)
```ts
export const HUD = { bgEdge: "#0A1622", bgCenter: "#13283A", gold: "#D9B56A", teal: "#6FC3B8", text: "#F3EEE2" };
// alternates: numeric miracles  #051A10→#123F28 + #5AFFA8 ; life/death/soul #191526 ; heart/self #152A4A + #E89343
```

## 3. Background kit
```tsx
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
export const HudBackground: React.FC = () => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const push = interpolate(f, [0, durationInFrames], [1, 1.06]);            // very slow push-in
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${HUD.bgCenter} 0%, ${HUD.bgEdge} 70%)` }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, opacity: 0.18,
        backgroundImage: `linear-gradient(${HUD.teal}33 1px, transparent 1px), linear-gradient(90deg, ${HUD.teal}33 1px, transparent 1px)`,
        backgroundSize: "60px 60px" }} />
      {Array.from({ length: 40 }).map((_, i) => {                              // dust drifting up
        const x = random(`x${i}`) * 1080, sp = 0.3 + random(`s${i}`) * 0.8, y = (random(`y${i}`) * 2100 - f * sp) % 2100;
        return <div key={i} style={{ position: "absolute", left: x, top: (y + 2100) % 2100 - 90, width: 3, height: 3,
          borderRadius: 3, background: HUD.gold, opacity: 0.25 + random(`o${i}`) * 0.35, boxShadow: `0 0 8px ${HUD.gold}` }} />;
      })}
      <Img src={staticFile("overlays/grain_tile_512.png")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", mixBlendMode: "overlay", opacity: 0.12, transform: `translate(${(f * 37) % 13}px, ${(f * 53) % 11}px)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};
```
(Copy `assets/overlays` to `video/public/overlays` first — skill `offline-assets`.)

## 4. HUD elements (SVG, eased, never linear)
```tsx
// self-drawing line / ring
const p = interpolate(f, [s, s + 30], [0, 1], { easing: Easing.out(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
<svg width={1080} height={1920} style={{ position: "absolute" }}>
  <circle cx={540} cy={860} r={300} fill="none" stroke={HUD.gold} strokeWidth={2} pathLength={1}
    strokeDasharray={1} strokeDashoffset={1 - p} transform="rotate(-90 540 860)" />
</svg>
// counter that races then slows near the value (easeOutExpo)
const v = Math.round(interpolate(f, [s, s + 45], [0, 114], { easing: Easing.out(Easing.exp), extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
<div style={{ fontFamily: "IBM Plex Sans Arabic", fontWeight: 700, fontSize: 220, color: HUD.gold,
  fontVariantNumeric: "tabular-nums", textShadow: `0 0 30px ${HUD.gold}88` }}>{v.toLocaleString("ar-EG")}</div>
// shockwave on reveal
const k = interpolate(f, [hit, hit + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
<div style={{ position: "absolute", left: 540 - 400 * k, top: 860 - 400 * k, width: 800 * k, height: 800 * k,
  borderRadius: "50%", border: `3px solid ${HUD.gold}`, opacity: 1 - k }} />
```
Other elements: orbit rings whose nodes light up in turn, wireframe globe, bar charts growing, equations dropping in,
loading bars, crosshair markers, light lines connecting numbers. Corner labels: «٠١ / ٠٦ — تأمّل», «FIG.01» in
small teal IBM Plex. Small transparent channel watermark bottom-centre.
Transitions: dissolve, camera move across the grid, horizontal light-scan wipe. No glitch, no hard cuts without meaning.

## 5. Typography
- Explanatory text: Cairo / IBM Plex Sans Arabic / Tajawal; clear hierarchy (huge numbers, big concept, medium
  explanation, tiny reference).
- Verses: **Amiri Quran** (Uthmani), white, line by line with a fade (skill `arabic-text-remotion`), max 2 lines,
  `lineHeight: 1.9`. Highlight only keywords: gold, or a thin gold box drawn around the word when it is recited.

## 6. Sound (from `assets/sfx`, see INDEX.md)
| Event | SFX | vol |
|---|---|---|
| Bed (whole video) | `drone_calm_low_loop` / `drone_dark_space_loop` (+ `drone_air_texture_loop`) looped | 0.06–0.12 |
| Grid/HUD element appears | `beep_hud_01`, `scan_hud_01`, `tick_soft_01` | 0.2–0.35 |
| Counting | `counter_roll_01` (+ ticks) | 0.3 |
| Before reveal | `riser_dark_03` / `riser_tonal_02` ending ON the hit | 0.35 |
| Reveal | `gong_soft_01` or `boom_cinematic_01` + `shimmer_01` | 0.5–0.7 |
| Verse appears | `whoosh_soft_01` / `swell_reveal_01` | 0.25 |
| Particles | `sparkle_02`, `chime_soft_01` | 0.2 |
| Theme | `heartbeat_slow_loop`, `wind_gentle_loop` | 0.15–0.3 |
Under recitation: only the drone (very low) or silence. Recitation ≈ −14 LUFS. Every text/number appearance gets a
light SFX; the strongest only for big moments. Measure with `scripts/analyze-audio` (skill `audio-mixing-remotion`).
Align a recitation to verse lines with `scripts/analyze-audio recitation.mp3 --lines verses.txt` (skill `audio-analysis`).

## 7. Ending
Data fades, a geometric logo (8-point star or concentric circles) scales in slightly + shockwave + final gong, with a
polite call: «احفظها» / «تابعنا للمزيد» / «شاركها لعلها تنفع غيرك».

## 8. QA before delivery
Verses/hadith/numbers verified • no music • every SFX synced to its event (±1 frame) • text centred and not crowded •
no black/empty frames • bloom doesn't burn text • loudness measured • stills of key frames reviewed.
