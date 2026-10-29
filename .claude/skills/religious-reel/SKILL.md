---
name: religious-reel
description: Use FIRST for ANY religious / Islamic video for Ayman (aymen.1303) - Quran recitation reels, hadith, naseeha, Islamic tips, religious podcast clips. Holds his confirmed style (navy + gold HUD, Uthmani karaoke text, logo intro/outro, clean voice + quiet drone, no SFX on Quran), the Quran accuracy rules and a ready Remotion kit. Overrides religious-hud-reel on any conflict.
---

# Religious reel — Ayman's style (Remotion)

**Read `religious/README.md` fully first, and look at `religious/reference/made_002_tawbah_102-104.jpg`
and `religious/reference/ref_work2_hadith_work4_luqman.jpg`.** Do not ask Ayman to re-explain the style or send examples:
it is all there. Ask only what is truly missing (which surah/ayat if you cannot identify them, the hadith source, the CTA).

Priority on conflicts: **Quran/hadith accuracy (README §7) > Ayman's style (README) > sam-content-os > religious-hud-reel / generic skills.**

## Workflow

Style v2 (README §16) is the default: ink boil on the scene, a written reads sheet before code, the tafsir drawn word
by word, anticipation/overshoot/no twinning, a hook over the intro, `finish.sh` at the end.

### 0. Report progress honestly
Give Ayman an accurate % with what is done and what remains. Reply in simple Arabic.

### 1. Words first: sam-content-os
Use the `sam-content-os` skill (`reels/sam-content-os/SKILL.md` + `reels/sam-content-os/AYMAN_NOTES.md`) to write the
**hook, voiceover script (talk/tips only), caption and CTA**, then build the video in the religious style below.
- Dialect: **Fusha** for religious reels. Skip its setup questions (answers are in AYMAN_NOTES).
- Quran recitation reels: no voiceover script, no SFX; hook/caption/CTA are text only. Caption format: README §11.
- **Quran/hadith accuracy rules always override sam-content-os** (no hype, no invented facts, exact text).
- Log the reel in **`religious/content-log.md`** (not reels/content-log.md).

### 2. Audio from Ayman's video
```bash
mkdir -p work/<name> && bash religious/tools/clean_voice.sh <his_video.mp4> work/<name>
python3 scripts/analyze-audio work/<name>/voice_clean.wav --out work/<name>/voice.json   # audio-analysis skill
```
Use ONLY his audio. If demucs/DeepFilterNet are missing the script warns and uses ffmpeg-only cleaning: tell Ayman.
`work/` is scratch: do not commit it (raw/recitation audio stays out of git unless Ayman says it is his and wants it kept).

### 3. Identify the passage → exact text
- Ask Ayman, or transcribe (faster-whisper in 20–30 s chunks if installed) **only to identify** the passage, then
  `python3 religious/tools/quran.py --find "<some plain words>"`.
- Text on screen = `python3 religious/tools/quran.py <surah> <a>-<b>` (verified Uthmani, offline). Never from memory or ASR.

### 4. Word timing → pages JSON
```bash
# best: forced alignment (needs torch + torchaudio; pip install torch torchaudio if the network allows)
python3 religious/tools/build_ayah_data.py --audio work/<name>/voice_clean.wav --surah 9 --ayat 102-104 \
    --fa --off 3.0 --out video/src/religious/data/<name>.json
# fallback (no torch): silence-based, approximate -> give ayah start times you measured with --breaks
python3 religious/tools/build_ayah_data.py ... --breaks 20.1,40.25
```
`--keys` marks extra gold words, `--max-words` sets words per page (default 9). Without `--fa`, check the timing in
Studio / stills at several points and fix it; say in the report it is approximate.

### 5. Mix + master
```bash
python3 religious/tools/mix_master.py --voice work/<name>/voice_clean.wav \
    --out video/public/religious/<name>/mix.wav --off 3.0      # prints total; -14 LUFS, TP <= -1
```
Quran: keep the drone, NO SFX. Talk/hadith/tips: add light SFX from `assets/sfx/` (INDEX.md) on the visual events, low
(about −24 to −30 dB under the voice), never over quoted Quran words. Use `audio-mixing-remotion` for `<Audio>` placement.

### 6. Build in Remotion (`video/src/religious/`)
Copy `ReligiousDemo.tsx` to `<Name>Reel.tsx` and change data, header strings and the `scene`:
```tsx
import { RecitationReel } from "./RecitationReel";
import data from "./data/<name>.json";
export const NameReel = () => (
  <RecitationReel data={data as AyahData} audio="religious/<name>/mix.wav"
    hudLeft={(_, n) => `QURAN · 09:${n}`} topic="سورة التوبة"
    title="AT-TAWBAH · 9 : 102 — 104" counter={(_, n) => `0${n - 101} / 03`}
    scene={(t, page) => <MyScene t={t} />} />);
```
Register in `video/src/Root.tsx` with `durationInFrames={Math.round(data.total * 30)}`, fps 30, 1080×1920.

Kit (all exported from `video/src/religious/index.ts`):
| Component / helper | Use |
|---|---|
| `RecitationReel` | whole recitation reel: background, scene, shield, HUD, karaoke, logo intro/outro, audio |
| `NavyBackground`, `TextShield` | navy vignette + dust + grain; dark gradient under the text |
| `HudFrame`, `ProgressTicks` | corner brackets, header (mono left / Arabic gold·grey right), footer counter + title + watermark |
| `AyahKaraoke`, `pageAt`, `wordOn` | Uthmani karaoke with ﴿﴾ + medallion, line-height 2.42 |
| `TipCaption` | talk/hadith/tips captions: grey→white, `k:"g"` gold glow box, `"c"` coral, `"x"` coral strikethrough, source line |
| `LogoIntro`, `LogoOutro`, `worldFade` | brand at start/end (CTA prop) |
| `StickFigure`, `POSE`, `mixPose`, `squash` | faceless figure (mouth only), 18 poses |
| `DrawPath`, `Orb`, `Spotlight`, `arcD`, `circD`, `starD`, `archD`, `pointArchD`, `waveD`, `ellD` | thin gold line art, draw-on |
| `P`, `E`, `env`, `kf`, `lerp`, `hash`, `arNum` | timing/easing helpers (all pure functions of t) |
| `C`, `FONT`, `useReligiousFonts` | palette + offline fonts |

Scene rules: key every visual to a word time from the JSON (`data.pages[p].words[i].on`); one idea at a time; draw-on,
fade, morph (no cuts); base style has no camera move (only with the soul layer, very slow); keep the art above y ≈ 1180
(the shield and the verse are below). Talk/tips reels: use `NavyBackground` + `HudFrame` + `TipCaption` + `LogoIntro/Outro`
directly instead of `RecitationReel`.

`religious/original-pipeline/` has the original HTML/SVG/GSAP scene of reel 002 (`web/scene.js`): read it for more scene
ideas; the Remotion kit is its translation (same coordinates and timings).

### 6b. Reads sheet first (style v2)
Before scene code, write per page: word → what the viewer must understand → the visual that shows its meaning → time.
One read at a time; give each meaning time to land. Hook line for 0.5–2.9 s (plain Arabic, not Quran text).

### 7. QA
Run the checklist in README §12. Render stills at several times and look at them:
`cd video && npx remotion still <Id> /tmp/s.png --frame=<n>`. Check text vs `quran.py`, loudness with `scripts/analyze-audio`.

### 8. Render + deliver
```bash
cd video && npx remotion render <Id> ../videos/<name>-v<N>.tmp.mp4 --codec h264 --crf 17 --color-space bt709 --audio-bitrate 320k
cd .. && bash religious/tools/finish.sh videos/<name>-v<N>.tmp.mp4 videos/<name>-v<N>.mp4 && rm videos/<name>-v<N>.tmp.mp4
```
Never overwrite an older version. Commit + push, add the row in `religious/content-log.md`, give Ayman the caption
(README §11) and post timing (after maghrib or isha).
