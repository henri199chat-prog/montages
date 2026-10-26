---
name: audio-mixing-remotion
description: Use when a Remotion video combines voiceover/recitation, music and SFX - setting volumes, ducking music under the voice, fades in/out, SFX levels, loops, trimming, and hitting about -14 LUFS / -1 dBTP for reels, then verifying the render's loudness offline.
---

# Audio mixing in Remotion

Remotion mixes all `<Audio>` tags at render (sum of volumes, linear gain 0–1+). Import `Audio` from `"remotion"`
(`@remotion/media` is not installed). Volumes are **linear**: −6 dB ≈ 0.5, −12 dB ≈ 0.25, −20 dB ≈ 0.1.
```tsx
const db = (d: number) => Math.pow(10, d / 20);   // volume={db(-12)}
```

## Targets
| Layer | Level (approx.) |
|---|---|
| Final master (Reels/TikTok/Shorts) | **−14 LUFS integrated**, true peak ≤ −1 dBTP (YouTube long-form −14, also fine) |
| Voice / recitation | the loudest continuous layer; ≈ −14…−16 LUFS on its own |
| Music under speech | −25…−30 LUFS (≈ voice −12 dB) ; in gaps −18 ; at the climax/outro without voice ≈ −14 |
| SFX accents | short, peak just under the voice; impacts may peak higher only when no voice |
| Ambient drone/bed | very low: −30…−35 LUFS (felt, not heard); 0 under Quran recitation or very low |
Files in `assets/sfx` are peak-normalised to −1 dBFS; start from the suggested volumes in `assets/sfx/INDEX.md`
(roughly: hits 0.5–0.8, whooshes 0.3–0.5, UI ticks 0.2–0.4, risers 0.3–0.5, drones 0.06–0.15).
The voiceovers in `audio/` are already mastered at −16 LUFS / −1.5 dBTP → use `volume={1}`.

## Ducking music under the voice (from speech segments)
```tsx
// segs = analyze-audio speech_segments of the VO (seconds); offset = frame where the VO Sequence starts
const duck = (frame: number, fps: number, segs: { start: number; end: number }[], offset = 0) => {
  const t = (frame - offset) / fps; const A = 0.15, R = 0.35;            // attack/release seconds
  let g = 1;
  for (const s of segs) {
    if (t >= s.start - A && t <= s.end + R) {
      const k = t < s.start ? (s.start - t) / A : t > s.end ? (t - s.end) / R : 0;
      g = Math.min(g, 1 - (1 - k) * (1 - db(-12)));                    // -12 dB under speech
    }
  }
  return g;
};
<Audio src={staticFile("music.mp3")} volume={(f) => 0.5 * duck(f, fps, vo.speech_segments, voFrom)
  * interpolate(f, [0, 15, total - 45, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
```
Note: the `volume` callback receives the frame **relative to the Audio's own Sequence**.

## Fades, trims, loops
```tsx
<Sequence from={toF(3.2)} durationInFrames={toF(4)}>
  <Audio src={staticFile("sfx/drone_calm_low_loop.mp3")} loop volume={(f) => 0.12 * interpolate(f, [0, 30, 90, 120], [0, 1, 1, 0], clamp)} />
</Sequence>
<Audio src={staticFile("song.mp3")} trimBefore={toF(12.5)} trimAfter={toF(40)} />   {/* cut a part of a song */}
<Audio src={staticFile("vo.mp3")} playbackRate={1} />                               {/* keep 1 for voice */}
```
(Older Remotion used `startFrom`/`endAt`; in 4.0.538 use `trimBefore`/`trimAfter`.)
Always fade music in ≥ 0.3 s and out ≥ 1.5 s (cosine-like via `Easing.inOut(Easing.sin)`); never hard-cut music
except as a deliberate effect (abrupt cut to silence before a reveal). Add 2–5 frame fades on any audio that starts
mid-waveform to avoid clicks.

## SFX placement rules
- Not continuous, not random: every SFX belongs to a visual event. Silence is a tool (cut all audio 0.3–0.6 s before a reveal).
- Big reveal = boom (+ flash); section change = whoosh/riser; small UI entry = soft tick (0.2–0.3).
- Layer for weight: `boom_sub_02` (low) + `hit_trailer_01` (mid/high) at the same frame, each at ~0.5.
- Don't stack SFX on top of important words; place them in the gaps (`silences[]`) or let them sit 6 dB under.
- Music + SFX: duck music ~3 dB for 0.3 s around big SFX.
- Religious: no music at all; drone very low; tick/bleep on HUD reveals; soft gong/chime on reveals; under
  recitation only the drone (or silence).

## Verify (always, offline)
```bash
cd video && npx remotion render <Comp> ../videos/<name>-v<N>.mp4
cd .. && scripts/analyze-audio videos/<name>-v<N>.mp4 --no-curve --quiet --out /tmp/qa.json
python3 -c "import json;d=json.load(open('/tmp/qa.json'));print(d['loudness'])"
```
- Integrated < −16 → raise everything (or the VO) by `db(+x)`; > −12 → lower. True peak > −1 → lower the loudest SFX.
- For a precise final master you may post-process with ffmpeg (keeps video untouched):
  `ffmpeg -i in.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k out.mp4`
  (save as a new version file, never overwrite older versions).
