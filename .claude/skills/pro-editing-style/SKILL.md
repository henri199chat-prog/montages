---
name: pro-editing-style
description: Use when planning or reviewing ANY reel, short, ad, analysis, comedy, football or anime video in Remotion - the professional editing method of the AG Anime channel - hook in the first second, story arc, cut rhythm and pacing, holding emotional shots, syncing only the big hits, restraint with effects, framing for 9:16, and the pre-render checklist.
---

# Pro editing style & pacing (AG Anime house style)

## 0. Method (before writing code)
1. Goal, audience, platform (Reels/TikTok/Shorts 1080x1920@30, YouTube 1920x1080).
2. Write a **beat sheet** (a comment block at the top of the composition): each block = time range, purpose, visual,
   text, SFX. Every scene must have a purpose; cut what adds no information or feeling.
3. Priorities: story → image clarity → audio balance → identity consistency. Effects come last.
4. The user wants the finished version, not drafts: self-review stills before showing a render.

## 1. Hook (0–1.5 s)
- Frame 0 already shows the hook: bold question / claim / the most striking image. No logo intro, no fade from black.
- Patterns: «هل تعرف أن…؟», a shocking number counting up, the end result first then "how", a mid-action shot.
- Hook text: 2–5 words, huge (110–160 px), scale 1.3→1.0 with `spring({damping: 14})` + a single boom/whoosh.

## 2. Story arc
Hook → context (who/what) → build (escalating info/tension) → **payoff / reveal** → short resolution + CTA.
Paragraph rhythm inside: introduce → visual support → emphasise the point → transition.
Long videos: chapters with numbered cards («١ — …»), pace changes between chapters.

## 3. Rhythm & cuts
- Vary pace: fast cuts (0.4–1 s) for action/hype; slow (2–4 s) for analysis, emotion, Quran. Never the same rhythm throughout.
- **Hold emotional shots** (2–4 s+). Let a reveal breathe 0.5–1 s of silence before and after.
- Cut on action (movement continues across the cut) or on the first frame of the spoken word it illustrates (±2 frames).
- **Sync only the big hits** (drop, reveal, impact, key word). Hits on everything = no hits.
- Camera always slightly alive: slow push 1.00→1.06 over a shot, ±3 px drift; alternate 1.00 / 1.07 scale on jump cuts;
  punch-in 1.13 with expo ease on emphasis words.
- Speed ramps: slow into the impact, snap fast on it, ease back.
- Sound leads picture: a whoosh/riser can start before the cut (J-cut), music swells into the reveal.

```tsx
// slow push-in for the life of a shot
const s = interpolate(frame, [0, durationInFrames], [1, 1.06], { easing: Easing.inOut(Easing.sin), extrapolateRight: "clamp" });
// punch-in on an emphasis word at frame P
const punch = interpolate(frame, [P, P + 6], [1, 1.13], { easing: Easing.out(Easing.exp), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
```

## 4. Effects — restraint
- Flash / shake / motion blur / glitch only when the moment earns it (character entrance, reveal, hit). Strong ones for the
  top 2–3 moments only. Clean cut + perfect timing beats any effect.
- Flash: white 0.8→0 over 7 frames. Shake: 16–18 px, 6–7 frames decaying. Max 3 flashes/s.
- One accent colour per video, consistent fonts (one display + one text font), consistent transitions.

## 5. Framing 9:16
- 16:9 footage in vertical: show the **whole** frame (width 1080, centred ~y 820) over a blurred, darkened copy of itself
  (`filter: blur(36px) brightness(0.5)`, scale cover). Never centre-crop faces; zoom ≤ 1.05.
- Faces never covered by text; text in the safe zone (x 90–990, y 250–1500).
- Presenter privacy rule of this channel: the presenter's eyes are hidden (blur/crop) unless he says otherwise for that video.

## 6. Genre presets
| Type | Pace | Audio | Look |
|---|---|---|---|
| Anime analysis / talking head | shots 1.5–4 s, B-roll ~40–50 % | voice first, music −25 LUFS under speech (only if asked) | captions Cairo Black, red/gold accents |
| Comedy with friends | punchline timing, freeze-frame + zoom on the joke, meme inserts | comic SFX (pop, boing-like swish, record-scratch glitch) | bold Lalezar/Marhey text, emojis OK |
| Football | build-up slower, goal = speed ramp + boom + flash + shake | crowd/whistle if available, low hits | score bug, Bebas/Changa numbers, team colours |
| Ad / app promo | one benefit per beat, product always readable | calm bed, ticks/taps/ding, swell on logo | dark glass UI, one brand accent, end card CTA |
| Religious | calm, 3–5 s holds, no fast cuts | **no music**, drone + soft SFX | see `religious-hud-reel` |
| AMV | follows the song structure | song + original voices + sparse SFX | see `anime-amv-edit` |

## 7. Ending
Short resolution, then end card 1.5–2.5 s: logo + soft gong/boom + CTA («تابعنا للمزيد» / «احفظها» / «شاركها»).
Loop-friendly ending for Reels when possible (last frame flows into the first).

## 8. Pre-render checklist
Hook in frame 0 • each scene has a purpose • text readable ≥ 1.2 s per line (≈ 3 words/s) • text inside safe zone, not on faces
• cuts on words/beats (±2 frames) • only big hits synced • no black/empty frames • audio −14 LUFS, voice clear above music
• Arabic shaped correctly • stills at 5–8 key frames checked by eye • rights/credits noted.
