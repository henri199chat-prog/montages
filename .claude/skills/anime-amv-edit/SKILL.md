---
name: anime-amv-edit
description: Use when editing an anime AMV, character montage, fight edit or anime/film scene edit in Remotion - story structure, cutting on vocal accents and hits, hold timing, lyric typography, whip/zoom/flash transitions, rage effect, audio layers and the delivery workflow.
---

# Anime AMV / edit standard (Remotion)

## Story first
- Story leads; lyrics serve it. For a backstory, tell it in real order (past → tragedy → present) so every power shot
  already carries meaning. Bring memories into the fight gradually (intercut, optionally B&W).
- Vary pacing hard: calm first verse, explosive second verse, near-still bridge on the loved one, slow outro.
- Keep the spotlight on the main character and their key relationship; include their most iconic moments.
- Never repeat a shot unless it is a deliberate callback.
- Show a short written plan (sections, timings, shot list) before a big render.

## Cutting
- Cut on vocal/rap accents and real audio hits, not a rigid grid. Get them offline:
  `scripts/analyze-audio song.mp3 --out /tmp/song.json` → `onsets` (accents), `low_hits` (kick/bass), `tempo.beat_frames`,
  `strongest_moments` (drops). Snap cuts to the nearest onset (skill `audio-beat-sync`).
- Hold emotional shots longer (2–4 s); action shots 0.3–1 s; drops = burst of 4–8 fast cuts then a hold.
- Cut on on-screen motion (door slam, sword swing) — match action across the cut.
- Native speed. Don't slow shots to fit the beat; speed up only when needed. Don't frame-interpolate anime
  (drawn on 2s/3s) — it creates ugly morphs.
- Trim clips with `<OffthreadVideo src={staticFile("clips/x.mp4")} trimBefore={toF(12.3)} />` inside a Sequence.

```tsx
// shot list driven edit
const shots = [ { src: "clips/ep1.mp4", in: 12.3, dur: 1.2 }, { src: "clips/ep5.mp4", in: 80.0, dur: 0.6 } ];
<Series>{shots.map((s, i) => (
  <Series.Sequence key={i} durationInFrames={toF(s.dur)}>
    <OffthreadVideo src={staticFile(s.src)} trimBefore={toF(s.in)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </Series.Sequence>))}
</Series>
```

## Audio
Three layers: song; original sounds (voices, breaths, swords, screams) slightly above the song when a line matters
and never cut mid-sentence; subtle SFX only where earned (`hit_*`, `whoosh_*`, `boom_*`). Measure the final mix
(skill `audio-mixing-remotion`).

## Look & transitions (skill `remotion-transitions-pro`)
- Whip pans with motion blur into the next line, zoom cuts on drums, white-bloom dissolves into memories
  (optional letterbox), torn/flash cuts on bass drops. No crude manga cracks or abrupt colour switches.
- Rage effect on explosive shots: crushed high-contrast near-B&W or black + glowing red, radial/motion blur, shake,
  RGB split:
```tsx
<AbsoluteFill style={{ filter: "grayscale(1) contrast(1.8) brightness(0.9)" }}>{shot}</AbsoluteFill>
<AbsoluteFill style={{ background: "#ff1a1a", mixBlendMode: "multiply", opacity: 0.55 }} />
```
- Flashes where they help the viewer read the moment; keep photosensitivity in mind (avoid more than 3 full-frame
  flashes per second).
- Keep the anime's original colours otherwise. Leave burned-in source subtitles; only remove source logos.
- Logo top-right, white, ~35 % opacity. At least 1080p.

## Lyrics (add after the cut is approved)
White serif caps (no serif Latin font in the kit: use Montserrat 800 or Bebas Neue, or the project's own font) with a
cyan/teal glow, word by word on sung syllables. Size follows word weight: small connectors, heavy words explode huge
with a zoom pump, shake and chromatic split (skill `kinetic-typography-remotion`). Key words can sit behind the
character only if a matte exists. Fights: tilted, shaking; soft memories: tiny, still, no glow. Optional small Arabic
translation; never two translations at once.

## Workflow
Plan approved → compressed review render → fixes → full render to `videos/<name>-v<N>.mp4`.
Check frame by frame (stills around every cut); be transparent about remaining issues. Remind the user about
copyright when publishing may need rights.
