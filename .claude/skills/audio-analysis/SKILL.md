---
name: audio-analysis
description: Use whenever a video depends on an audio file (voiceover, recitation, song, SFX, a rendered MP4) and you need to know what is in it - when speech starts/stops, where the loud moments, beats or hits are, BPM, loudness (LUFS/true peak) - or to sync text/cuts/SFX to it in Remotion. Never tell the user you cannot hear audio; run scripts/analyze-audio instead.
---

# Audio analysis (offline) — "hear" the audio with numbers

You cannot listen, but you can **measure**. `scripts/analyze-audio` (Python 3 standard library + ffmpeg/ffprobe,
no pip, no internet) turns any audio/video file into timing JSON with seconds **and frame numbers**.

> Never answer «لا أستطيع سماع الصوت». Say instead «حلّلت الصوت…» and use the numbers.

## Run it
```bash
scripts/analyze-audio audio/voiceover_main.mp3 --fps 30 --out /tmp/vo.json      # summary printed to stderr
scripts/analyze-audio music.mp3 --fps 30 --no-curve --out /tmp/music.json        # songs: beats/onsets
scripts/analyze-audio vo.mp3 --lines script.txt --out /tmp/vo.json               # map script lines -> times
scripts/analyze-audio ../videos/ad-v2.mp4 --no-curve --quiet --out /tmp/qa.json   # QA a render's loudness
```
Options: `--noise -35` silence threshold dBFS (noisy phone audio: −30; studio TTS: −40/−45), `--min-silence 0.25`
(raise to 0.4 to keep a sentence in one segment; lower to 0.15 to split words), `--min-speech 0.12`,
`--hop 0.05` (curve step), `--top 12` strongest moments.

## What you get (JSON keys)
| key | meaning | use it for |
|---|---|---|
| `duration_s`, `duration_frames` | length | `durationInFrames` of the composition |
| `loudness.integrated_lufs / lra_lu / true_peak_dbtp` | EBU R128 | mix targets (reels ≈ −14 LUFS, TP ≤ −1) |
| `speech_segments[]` (`start,end,start_frame,end_frame`) | non-silent runs = phrases/lines | caption/title timing, B-roll cuts |
| `silences[]` | pauses | breathing room, place SFX/whooshes/transitions here |
| `strongest_moments[]` (`t,frame,rms_db`) | loudest instants ≥0.5 s apart | big hits, flashes, reveals |
| `onsets[]` (`t,frame,strength`) | sudden energy rises (word starts, drum hits) | word pops, cuts on hits |
| `low_hits[]` | onsets in < 150 Hz (kicks, booms, bass drops) | shake / zoom punch / cuts on kicks |
| `tempo.bpm, confidence, beats_s, beat_frames` | estimated beat grid | music cuts. **Trust only if confidence ≥ 0.3** (speech gives ~0.05) |
| `lines[]` (with `--lines`) | your script lines with start/end | captions for TTS/VO without word timings |
| `curve.rms_db[]` every `hop_s` | loudness envelope (dBFS) | audio-reactive visuals, find build-ups |

Sample (real output on `audio/voiceover_main.mp3`, an Arabic TTS voiceover, 30 fps):
```json
{
 "file": "voiceover_main.mp3", "fps": 30, "duration_s": 20.616, "duration_frames": 619,
 "loudness": { "integrated_lufs": -16.0, "lra_lu": 3.9, "true_peak_dbtp": -1.5 },
 "speech_segments": [
  { "start": 0.48, "end": 1.588, "dur": 1.108, "start_frame": 14, "end_frame": 48 },
  { "start": 2.351, "end": 3.343, "dur": 0.992, "start_frame": 71, "end_frame": 100 },
  { "start": 4.14, "end": 5.19, "dur": 1.05, "start_frame": 124, "end_frame": 156 }, "..."
 ],
 "strongest_moments": [ { "t": 1.0, "frame": 30, "rms_db": -10.7 }, "..." ],
 "onsets": [ { "t": 0.49, "frame": 15, "strength": 34.3 }, "..." ],
 "tempo": { "bpm": 146.3, "confidence": 0.06, "...": "speech -> ignore tempo" },
 "lines": [ { "line": "سُبْحَانَ اللّٰهِ", "start": 0.48, "end": 1.588, "start_frame": 14, "end_frame": 48, "estimated": false }, "..." ]
}
```
Stderr summary of the same run: `speech segments: 8 | onsets: 59 | low hits: 38 | tempo: 146.3 BPM (conf 0.06)`.
The 8 segments matched the hand-checked TTS timings in `audio/README.md` within ~0.08 s
(starts are slightly late because the threshold cuts the soft attack: subtract 2 frames for text entrances).
On a 120 BPM test kick track it returned `119.8 BPM, confidence 0.97` and all 40 kicks in `low_hits`.

## Seconds → frames in Remotion
```tsx
// once:  mkdir -p video/src/data && echo "export const vo = $(cat /tmp/vo.json) as const;" > video/src/data/vo.ts
// (a .ts file avoids tsconfig JSON-import issues; use --no-curve to keep it small)
import { vo } from "./data/vo";
const { fps } = useVideoConfig();
const f = (s: number) => Math.round(s * fps);
{vo.speech_segments.map((s, i) => (
  <Sequence key={i} from={f(s.start) - 2} durationInFrames={f(s.end) - f(s.start) + 8} premountFor={fps}>
    <Line text={LINES[i]} />
  </Sequence>
))}
```
Use the `*_frame` fields directly when the JSON was made with the same `--fps` as the composition.
Composition length: `durationInFrames = vo.duration_frames + Math.round(0.8 * fps)` (tail for the outro).

## Matching speech segments to known script lines
Segment count rarely equals line count. Rule (what `--lines` does, do the same by hand if needed):
1. **Same count** → line i = segment i.
2. **More segments than lines** (a comma pause split a line) → repeatedly merge the two neighbouring segments with the
   **shortest gap** until counts match. Sanity-check: long lines should get long segments.
3. **Fewer segments than lines** (two lines spoken without a pause) → give each segment a run of consecutive lines,
   then split the segment's time **proportionally to character count** (spaces removed):
   `lineDur = segDur * chars(line) / chars(allLinesInSeg)`. Mark those as `estimated` and pad ±3 frames.
4. Re-check visually: render stills at each line start (`npx remotion still … --frame=N`).
5. If the voice comes from TTS with word timings (`audio/*_timing.json`, `*_words.srt`), use those instead — exact.

Word-level timing for captions without a timing file: inside one segment, distribute words proportionally to
character count (+ a 0.06 s gap at commas). Good enough for highlight-the-active-word captions.

## Syncing SFX and visuals
- Text entrance = segment start − 1…2 frames (eye leads the ear). Exit = segment end + 6…10 frames.
- Whoosh/transition = inside a `silences[]` gap, ending at the next segment start.
- Big boom/flash = a `strongest_moments` or `low_hits` frame (max 1 per ~2 s; photosensitivity: ≤ 3 flashes/s).
- Music cuts: `tempo.beat_frames` (if confidence ≥ 0.3) — cut on every 2nd/4th beat, hold emotional shots.
- Audio-reactive glow: `const db = vo.curve.rms_db[Math.floor(frame / fps / vo.curve.hop_s)]`,
  `glow = interpolate(db, [-45, -12], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})`.

## QA the final render
```bash
scripts/analyze-audio ../videos/name-v2.mp4 --no-curve --quiet --out /tmp/qa.json && python3 -c "import json;print(json.load(open('/tmp/qa.json'))['loudness'])"
```
Target reels: integrated −14 ±1 LUFS, true peak ≤ −1 dBTP. Too quiet → raise VO/master `volume`; peaks too high → lower SFX.
