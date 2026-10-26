# ⭐ PRIMARY voiceover (v2, use this): `misbaha_vo_male_main.mp3`

> **Claude Code / Remotion: use `audio/misbaha_vo_male_main.mp3`** (WAV master: `misbaha_vo_male_main.wav`).
> The older `voiceover_main.*` / `voiceover_male2.*` (edge-tts) files further down are **superseded**. They are kept only for reference. Whisper hears «حسن» (with س) in them instead of «حِصْن».

| | |
|---|---|
| File | `misbaha_vo_male_main.mp3` (320 kbps, 48 kHz, mono) + `misbaha_vo_male_main.wav` (24-bit master) |
| Duration | **20.01 s** (WAV) / 20.04 s (MP3, encoder padding) → about 601 frames @30fps |
| Alt take | `misbaha_vo_male_alt.mp3` (same voice, different takes, 20.05 s) |
| Engine | **Habibi-TTS, Specialized MSA model** (F5-TTS fine-tune, Apache-2.0), run locally on CPU. Male voice prompt: ClArTTS classical-Arabic narrator (CC-BY-4.0, from a LibriVox reading of «أدب الدنيا والدين», denoised with DeepFilterNet). Not a clone of Ayman's voice. |
| Delivery | Calm, reverent MSA. Each phrase is generated separately at a fixed, slightly slow length. Pauses: 0.75 s between the three tasbih phrases, 0.8 s between sentences, 1.15 s before «مِسْبَحَة». |
| Post | HPF 75 Hz, +2 dB warmth @170 Hz, −1.5 dB @380 Hz, light presence, de-esser, 2.5:1 compression, a very light small-room reverb (about −19 dB wet), two-pass loudnorm |
| Loudness | **−16.3 LUFS integrated, true peak −1.6 dBTP**, LRA 2.6 LU. No music, no SFX. |
| Check | Whisper large-v3 transcript of the final file: «سبحان الله، الحمد لله، الله أكبر، اجعل ذكر الله رفيقك في كل وقت، عداد للتسبيح، وأذكار الصباح والمساء من **حصن** المسلم، يعمل بدون إنترنت، **مسبحة**» (exact match) |

## PRIMARY timings: `misbaha_vo_male_main` (seconds, measured from the final audio)
Measured with `scripts/analyze-audio audio/misbaha_vo_male_main.wav --noise -40 --min-silence 0.3`. The same data is in `misbaha_vo_male_main_timing.json`, with frame numbers at 30fps.

| # | Phrase | Start | End | Frames @30fps |
|---|---|---|---|---|
| 1a | سُبْحَانَ اللّٰهِ | 0.44 | 1.47 | 13–44 |
| 1b | اَلْحَمْدُ لِلّٰهِ | 2.28 | 3.34 | 68–100 |
| 1c | اَللّٰهُ أَكْبَرُ | 4.06 | 5.06 | 122–152 |
| 2 | اِجْعَلْ ذِكْرَ اللّٰهِ رَفِيقَكَ فِي كُلِّ وَقْتٍ. | 6.02 | 8.84 | 181–265 |
| 3 | عَدَّادٌ لِلتَّسْبِيحِ، وَأَذْكَارُ الصَّبَاحِ وَالْمَسَاءِ مِنْ حِصْنِ الْمُسْلِمِ. | 9.75 | 14.44 | 293–433 |
| 4 | يَعْمَلُ بِدُونِ إِنْتَرْنِتْ. | 15.38 | 16.95 | 461–509 |
| 5 | مِسْبَحَة. (app name, logo reveal) | 18.24 | 19.11 | 547–573 |

### Alt timings: `misbaha_vo_male_alt` (seconds)
| 1a | 1b | 1c | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 0.44–1.42 | 2.24–3.25 | 4.01–5.09 | 5.99–8.74 | 9.66–14.50 | 15.47–16.96 | 18.28–19.16 |

Note: the current Remotion composition is 15 s. Extend it to about 20.5 s (615 frames @30fps) to fit this voiceover.

---

# (Older, superseded) edge-tts voiceover

# التعليق الصوتي لإعلان تطبيق «مِسْبَحة»

تعليق صوتي عربي هادئ وخاشع، **بدون موسيقى**. مُعالَج: high-pass عند 70Hz، ضغط خفيف، صدى دافئ خفيف جدًا، جهارة ‎-16 LUFS، ذروة حقيقية ‎-1.5 dBTP. التسجيل أحادي (mono) بتردد 48kHz.

## الملفات

| الملف | الصوت | المدة |
|---|---|---|
| `voiceover_main.wav` (24-bit) / `voiceover_main.mp3` (320k) | **ar-SA-HamedNeural** (ذكر، سعودي فصيح) — **النسخة الرئيسية** | 20.58 ث / 20.62 ث |
| `voiceover_male2.wav` / `voiceover_male2.mp3` | ar-EG-ShakirNeural (ذكر، بديل) | 19.73 ث / 19.75 ث |
| `voiceover_*_lines.srt` | توقيت كل سطر | — |
| `voiceover_*_words.srt` | توقيت كل كلمة | — |
| `voiceover_*_timing.json` | الأسطر + المقاطع + الكلمات (بالثواني) | — |

سرعة القراءة ‎-10% (والكلمة الأخيرة «مِسْبَحَة» ‎-20%). ملاحظة: النسخة الرئيسية أطول من تكوين Remotion الحالي (15 ث)، لذلك يجب مدّ الفيديو إلى نحو 21 ث (630 إطارًا بمعدل 30fps) أو أكثر.

## التوقيتات — النسخة الرئيسية `voiceover_main` (بالثواني)

| # | النص | البداية | النهاية |
|---|---|---|---|
| 1 | سُبْحَانَ اللّٰهِ... الْحَمْدُ لِلّٰهِ... اللّٰهُ أَكْبَرُ. | 0.40 | 5.17 |
| 1أ | ↳ سُبْحَانَ اللّٰهِ | 0.40 | 1.52 |
| 1ب | ↳ الْحَمْدُ لِلّٰهِ | 2.27 | 3.31 |
| 1ج | ↳ اللّٰهُ أَكْبَرُ | 4.06 | 5.17 |
| 2 | اِجْعَلْ ذِكْرَ اللّٰهِ رَفِيقَكَ فِي كُلِّ وَقْتٍ. | 6.07 | 8.71 |
| 3 | عَدَّادٌ لِلتَّسْبِيحِ، وَأَذْكَارُ الصَّبَاحِ وَالْمَسَاءِ مِنْ حِصْنِ الْمُسْلِمِ. | 9.51 | 14.64 |
| 4 | يَعْمَلُ بِدُونِ إِنْتَرْنِتْ. | 15.44 | 17.24 |
| 5 | مِسْبَحَة. (اسم التطبيق — لحظة ظهور الشعار) | 18.34 | 19.25 |

## التوقيتات — البديل `voiceover_male2` (بالثواني)

| # | البداية | النهاية |
|---|---|---|
| 1 (أ / ب / ج) | 0.40 (0.40–1.41 / 2.16–3.23 / 3.98–5.02) | 5.02 |
| 2 | 5.92 | 8.27 |
| 3 | 9.07 | 14.11 |
| 4 | 14.91 | 16.41 |
| 5 | 17.51 | 18.40 |

للتحويل إلى إطارات في Remotion: `frame = Math.round(seconds * fps)`. توقيت كل كلمة موجود في `voiceover_*_timing.json` (الحقل `words`).

---

# Tasbih reel voiceover (Gulf, 2026-10-26): `tasbih_reel_vo_gulf.mp3`

Used by the `TasbihReel` composition (`video/public/vo/tasbih-reel-vo.wav`, word timings in
`video/src/tasbih-reel-vo.json`, copy in `tasbih_reel_vo_gulf_timing.json`). 29.1 s, -16.3 LUFS, -1.5 dBTP.

- Engine: Habibi-TTS **Specialized SAU** model with the `Gulf.wav` reference prompt from the Habibi repo, CPU, one
  generation per line (nfe 32). **Licence: CC-BY-NC-SA-4.0 (non-commercial).** Fine for a free app's organic reel;
  for paid ads or a monetised account, regenerate with the MSA / IRQ models (Apache-2.0) or a recorded voice.
- Whisper large-v3 check per line: all lines match the script except Whisper's usual MSA spellings (هذه/هذي, العدى/العدّ).
  «مسبحة» needed three takes (one take was heard as «مستباحة»); tashkeel on الذِّكر made it worse, so lines are plain text.
- edge-tts (ar-KW-FahedNeural) is not usable from the cloud container: it needs a WebSocket, which the proxy blocks.

## v2 (current): the creator's own voice, MSA: `tasbih_reel_voice_pro.mp3`

`tasbih_reel_voice_raw.m4a` is the original phone take (one take, 59.6 s, about -26 LUFS, noise floor about -70 dB).
`tasbih_reel_voice_pro.mp3` is what the reel uses (`video/public/vo/tasbih-reel-vo.wav`, 51.0 s, -15.8 LUFS, -1.5 dBTP):
pauses tightened (0.45 s between lines, at most 0.28 s inside a line), atempo 1.05, then
`highpass 80 · afftdn nr6 · EQ +2.5 dB @120 / -3 dB @320 / -1 dB @900 / +2.5 dB @3.8 kHz · deesser · high shelf +2 dB @10 kHz ·
compressor 3:1 @-24 dB + 2:1 @-14 dB · loudnorm -16 LUFS / -1.5 dBTP`.
Word timings: Whisper large-v3 on the final file, line starts snapped to the speech onsets (`tasbih_reel_voice_pro_timing.json`).
