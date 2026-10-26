---
name: audio-beat-sync
description: Use when cuts, text pops, shakes, flashes or SFX must land on the music beat, a drum hit, a lyric syllable or a voiceover word in a Remotion video - building a beat/onset timeline JSON, choosing which beats to cut on, and placing Sequences/Audio on exact frames. Pair with audio-analysis (to get the timestamps) and pro-editing-style (to decide what deserves a hit).
---

# Beat & audio sync in Remotion

## 1. Get timestamps (offline)
- Music: `scripts/analyze-audio song.mp3 --fps 30 --no-curve --out video/src/data/song.json`
  (then `echo "export const song = $(cat video/src/data/song.json) as const;" > video/src/data/song.ts`) → `tempo.beat_frames`, `onsets`, `low_hits` (kicks/booms), `strongest_moments` (drops).
- Voice: `audio/*_timing.json` / `*_words.srt` when they exist (exact TTS word times; see `audio/README.md` tables),
  else `speech_segments` from analyze-audio.
- Write a hand-curated **cue sheet** `video/src/data/cues.json` (seconds; one place to tweak timing) — never cut on every detected onset:
```json
{ "fps": 30,
  "cuts":  [0.00, 1.97, 3.94, 5.91, 7.88],
  "hits":  [{"t": 7.88, "type": "drop"}, {"t": 11.82, "type": "impact"}],
  "words": [{"t": 0.40, "text": "سُبْحَانَ اللّٰهِ"}, {"t": 2.27, "text": "الْحَمْدُ لِلّٰهِ"}] }
```

## 2. Helpers
```tsx
import { useVideoConfig, useCurrentFrame, interpolate, Easing, random } from "remotion";
export const toF = (s: number, fps: number) => Math.round(s * fps);
// snap a frame to the nearest beat if within `tol` frames (keeps hand timing but tightens it)
export const snap = (f: number, beats: number[], tol = 2) => {
  const b = beats.reduce((a, x) => (Math.abs(x - f) < Math.abs(a - f) ? x : a), beats[0]);
  return Math.abs(b - f) <= tol ? b : f;
};
// decaying pulse after each hit frame: 1 on the hit -> 0 after `len` frames
export const pulse = (frame: number, hits: number[], len = 8) => {
  let v = 0;
  for (const h of hits) if (frame >= h && frame < h + len) v = Math.max(v, 1 - (frame - h) / len);
  return Easing.out(Easing.cubic)(v);
};
```
Zoom punch + shake on kicks:
```tsx
const p = pulse(frame, kickFrames, 10);
const scale = 1 + 0.08 * p;
const shakeX = (random(`sx${frame}`) - 0.5) * 40 * p, shakeY = (random(`sy${frame}`) - 0.5) * 40 * p;
<AbsoluteFill style={{ transform: `translate(${shakeX}px,${shakeY}px) scale(${scale})` }}>…</AbsoluteFill>
```

## 3. Cuts on beats with Series
```tsx
const cutFrames = cues.cuts.map((s) => toF(s, fps));
const lens = cutFrames.map((f, i) => (cutFrames[i + 1] ?? durationInFrames) - f);
<Series>{clips.map((c, i) => (
  <Series.Sequence key={i} durationInFrames={lens[i]}><Clip {...c} /></Series.Sequence>))}</Series>
```

## 4. Placement rules (pro, not mechanical)
- **Cut ON the hit frame or 1 frame before** (a cut feels late if after). Text pops 1–2 frames before the syllable.
- Hits are transient-aligned in `assets/sfx`; risers/reverse whooshes must END on the hit (`from = hit − len`).
- Use the music's **phrase** (4 or 8 bars): change scenes every 2–4 beats in verses, every beat only in the drop,
  then a breather. Hold emotional/visual payoffs for 2–4 beats even if beats continue.
- **Sync only the big hits**: kicks of the drop, snare accents, lyric emphasis. Not every hi-hat. If everything hits, nothing hits.
- Fast rock/EDM (120–130 BPM): 0.5 cuts/s in intro → 2–3 cuts/s in drops. Epic/orchestral (75–85 BPM): one cut per
  1–2 s on big drums, slow push-ins, cross-dissolves in emotional parts.
- Flashes/impact frames: max 3 per second (photosensitivity), ≥ 10 frames apart at 30 fps.
- Tempo confidence < 0.3 (speech, rubato, ambient) → ignore the grid; use `onsets`/`strongest_moments` by ear-logic
  (biggest values, spaced out).
- Speech: a visual change on the **first frame of the word** it illustrates (±2 frames). Never cut in the middle of a word.

## 5. Check
Render stills on each hit frame (`npx remotion still Comp /tmp/h.png --frame=N`) and confirm the visual change is there.
After render: `scripts/analyze-audio ../videos/x.mp4 --no-curve` — loudness and that SFX peaks appear at the planned frames
(`strongest_moments`).
