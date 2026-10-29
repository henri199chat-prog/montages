# الأسلوب الديني لأيمن — Ayman's religious reel style (aymen.1303)

> **اقرأ هذا الملف كاملاً قبل أي فيديو ديني (قرآن، حديث، نصيحة، بودكاست ديني).**
> Read this whole file before ANY religious/Islamic video. Then follow `.claude/skills/religious-reel/SKILL.md`.
>
> Everything here comes from Ayman's own reference video, from the 2 reels already made and accepted
> (001 العنكبوت 29:2–7, 002 التوبة 9:102–104) and from what Ayman said in chat. Nothing is invented.
> If something is not written here, **ask Ayman** instead of guessing.
>
> **On conflicts this file wins** over the generic `religious-hud-reel` skill (that one has a grid, push-ins,
> SFX on recitation and an octagram logo, which are NOT Ayman's style).

---

## 0. باختصار — In one minute

| | |
|---|---|
| الهوية | صفحة **aymen.1303** (أيمن الغلقاوي، تونس). شعار ذهبي: حرف "A" بخط عربي مع قوس ودائرة. |
| Look | Motion graphics only. Deep navy background with a vignette, floating dust, gold thin-line art, HUD frame, Arabic karaoke text at the bottom. **No stock footage, no hard cuts, no black dips.** |
| Sound | Only the voice from Ayman's video, cleaned to sound like a calm professional mic. **Quran = recitation + very quiet drone, NO SFX, NO music.** Talks/hadith = light synced SFX, kept low. −14 LUFS, TP ≤ −1 dBTP. |
| Text | Quran in Uthmani script with full tashkeel, from the verified text only (`religious/tools/quran.py`), always on screen at the bottom, word by word with the recitation. Cite surah:ayah. |
| Brand | Logo + "aymen.1303" big at the start and the end, small watermark the whole time. |
| Format | 1080×1920, 30 fps, H.264, about 0.5–2.5 min. |

Ayman confirmed the base style with: «إي، هذا هو الأسلوب بالضبط» ("yes, this is exactly the style").

---

## 1. الهوية — Identity
- القناة: **aymen.1303** — Ayman (أيمن الغلقاوي)، تونسي، يكتب بالعربية، يشتغل من هاتف أندرويد فقط.
- Content: Quran recitation reels, hadith, naseeha (advice), Islamic tips, religious podcast clips.
- Tone: calm, respectful, contemplative. Lots of empty space; one idea on screen at a time.
- Logo files: `religious/brand/logo_original.png` (1254², on navy #050E17) and `religious/brand/logo_rgba.png`
  (transparent, used in video). In Remotion: `video/public/religious/logo_rgba.png`.
- **Reciter name credit** («القارئ أيمن الغلقاوي»): was never confirmed by Ayman. In the last accepted version the
  reciter line was replaced by the logo. **Do not add a reciter name unless Ayman asks.**

## 2. الأسلوب البصري — Visual style (BASE layer, always)
Measured from Ayman's reference video (`religious/style_analysis_measurements.md`, contact sheets in `religious/reference/`).

- **Background:** flat deep navy with a radial vignette: centre #152E43 → mid #10202E → corners #0A141D
  (clusters #0E1D2B / #162A39 / #08131C). Mean luma ≈ 41/255. Very dark and minimal: bright pixels ≈ 0.7 % of the frame.
- **Dust:** faint tiny dots drifting everywhere. Film grain is very light (opacity .075, overlay) — barely visible.
- **HUD frame (same in every work):**
  - 4 thin L-shaped corner brackets.
  - Header (y ≈ 5–7 %): left = Latin mono, letter-spaced uppercase, teal-grey (e.g. `QURAN · 31:07`);
    right = Arabic «**category in gold** · topic in light grey» (e.g. «القرآن الكريم · سورة التوبة»). Hairline under it.
  - Footer: mono counter (`01 / 03`), centred transliterated title in spaced mono caps (`AT-TAWBAH · 9 : 102 — 104`),
    hairline above, and the watermark `aymen.1303`.
- **Illustration:** thin gold/teal vector lines, 1–2 px, with glowing nodes: concentric circles, arcs, timelines with
  dots, a mihrab/arch outline, ripple arcs, heart + ECG line, clock dial, phone icon, mind-map hub, counters, trees/garden
  for Jannah. Strict centre axis: diagram upper-middle, text lower-middle.
- **No** grid, no light leaks, no borders/letterbox, no live footage (no nature, mosques, sky).
- Never depict prophets, companions, angels or Allah. The stick figure below is a faceless symbol of "a person".

### 2b. Optional layers Ayman showed and liked (use when the content fits or he asks)
**Character layer** (`religious/reference/character_ref1-3.jpg`):
- White stick figure, **no eyes, only a mouth**; body language carries the emotion (slump = sin/sadness, hands up = dua,
  hand on chest = sincerity, kneel = humility, raise = hope).
- Gold spotlight from above on the figure.
- Worries = red/coral wavy lines around the head that **straighten into gold lines** when relief comes.
- Coral colour for negative words; a red strikethrough for rejected words.

**Soul layer** (same refs): crescent moon, a glowing arched door = hope / tawbah, god rays only at the climax, gold dust,
a big dark shadow = fear, dim figures in the background, a curving ground line, a slow continuous camera
(the base HUD style has NO camera move; use camera only together with this layer, and very slowly).

**Speech-visualisation method** (`speech_ref4`; Ayman: «الألوان ما ناخذوهاش» = take the method, NOT its colours —
colours stay navy/gold):
- One idea per screen; clear the screen between ideas.
- Abstract ideas become objects. Up = divine, down = worldly.
- Squiggly line = straying; taut straight line = returning.
- Prayers/dua = particles rising; tethers snapping = letting go.
- List items pop in on their exact word.

## 3. الحركة — Motion
- **0 hard cuts.** Every change is an element-level crossfade/morph on the persistent background: old diagram fades or
  shrinks to a dot, new one draws on. No dips to black.
- Motion types: line draw-on, nodes orbiting/travelling on paths, dials rotating, pulse/glow on the focus element, gentle
  fades, a spotlight/lens circle on a word.
- Easing: soft in-out, nothing bouncy or fast. Everything slow and breathing.
- **Pacing** (measured): text changes every ≈ 2.8 s median overall —
  naseeha ≈ 5.5 s, hadith ≈ 4.1 s, tips/explainer ≈ 2.35 s (fast), **Quran ≈ 11.9 s per page** (a whole ayah stays and is revealed progressively).
- Visuals change **on the word** that is spoken, not on pauses.
- **Every Quran word should be visualised** (Ayman asked for more effort on this for video 2): each meaningful word/phrase
  gets its own visual beat in the scene above the text.

## 4. الخطوط — Typography
- Quran: **Amiri Quran** (Uthmani, full tashkeel), ornate gold **﴿ ﴾** and an ayah-number medallion **۝** with Arabic digits.
  Line-height **2.42** (smaller made waqf marks collide). 1–3 lines, centred, ≈ 70 px, shrink to fit ≤ 920 px width.
- Hadith / naseeha: classical Naskh with tashkeel (Amiri).
- Tips / explainer: bold modern Arabic sans (**IBM Plex Sans Arabic** SemiBold/Bold) with the key word in a **gold
  rounded-rectangle outline box with soft glow**.
- Latin labels: **IBM Plex Mono**, uppercase, wide letter-spacing.
- **Karaoke:** unread words grey at ≈ 40 % opacity → light up to white (or gold for key/divine words) over 0.18 s as spoken.
- A small context line (source/attribution) in grey or gold above the main text.
- Fonts are offline in `assets/fonts/` and `video/public/religious/fonts/`. Never `@remotion/google-fonts`.

## 5. الألوان — Colours
| Use | Hex |
|---|---|
| Gold (highlights, key words, brand) | **#E3CC8F** |
| Muted gold (lines, labels, header Arabic) | #B09F75 / #A69B7D |
| Text white | #F0F2EB |
| Unread grey | #97A0A2 (≈ 40 % opacity) |
| Latin mono labels | teal #608F8C |
| Negative words / worries (character layer) | coral #E66A65 (text #EE8A84) |
| Background | #152E43 centre, #10202E mid, #0A141D corners, #0E1D2B base |
All in `video/src/religious/theme.ts` (`C`).

## 6. الصوت — Audio rules
1. Ayman sends a raw video: **use ONLY its audio**. Clean it to sound like a calm, clear, professional microphone:
   no noise, no chatter, no music. Chain used in 002 (`religious/tools/clean_voice.sh`): demucs vocals → DeepFilterNet3
   (atten-lim 24 dB) → ffmpeg EQ/de-ess/gentle compression/light afftdn. If demucs/DFN are missing, the script falls back
   to ffmpeg-only and says so — tell Ayman honestly.
   **Removing music from a voice (Ayman's ear test, 2026-10-28):** htdemucs alone left a garbled residue under the
   words. Best = the average of two stems: BS-RoFormer (`pip install "audio-separator[cpu]" audioread`, model
   `model_bs_roformer_ep_317_sdr_12.9755.ckpt`, ~25 s CPU per 1 s of audio) and `demucs -n htdemucs_ft`. Then only light
   EQ / de-ess / compression; heavy denoise (anlmdn) makes the voice sound unnatural.
2. Quran recitation: subtle stereo hall reverb (wet −17 dB) + a **very quiet low drone** (D2/A2/D3/A3 soft partials,
   lowpass 420 Hz, ≈ **−35 dBFS RMS**). **No sound effects, no music, ever.**
3. Podcast / hadith / talk / tips: **light SFX synced to the visuals, kept low** (from `assets/sfx/`, see INDEX.md:
   soft whoosh, soft tick, chime, page turn, shimmer). Never over the words of a Quran verse quoted inside a talk.
4. Master: **−14 LUFS integrated, true peak ≤ −1 dBTP** (`religious/tools/mix_master.py` does trim + reverb + drone +
   master in one go, offline).
5. Verify with `scripts/analyze-audio` (audio-analysis skill). Never say you cannot hear audio; analyse it.

## 7. دقّة القرآن والحديث — Quran & hadith accuracy (overrides everything, including sam-content-os)
- **Quran text only from the verified Uthmani text** bundled offline: `religious/data/quran-uthmani.json`
  (Tanzil via api.alquran.cloud). Get it with `python3 religious/tools/quran.py 9 102-104`. Never type a verse from memory,
  never use Whisper's text on screen (Whisper/ASR only to *identify* the passage: `quran.py --find "..."`).
- Full tashkeel, waqf marks kept (glued to the previous word), ﴿﴾ and ayah numbers. Always cite **surah : ayah** in header,
  footer and caption.
- Show exactly the ayat that are recited — no more, no less. If the reciter repeats a part, the text follows the recitation.
- Hadith: **only authentic** (sahih/hasan) with the source on screen (e.g. «رواه مسلم»). Name the sheikh for clips
  (e.g. «الشيخ محمد بن صالح العثيمين رحمه الله»). If you cannot verify a hadith or its grading offline, **ask Ayman**; never invent.
- No invented facts, numbers or "miracles", no clickbait about the Quran.
- Meaning lines (tafsir/translation) only from a known source, and labelled as meaning, not as Quran.

## 8. بنية الريل — Reel structure (Quran recitation, as in 002)
| Time | What |
|---|---|
| 0 – 3.0 s | **Logo intro**: thin ring draws, big logo (380 px) resolves with a light sweep, "aymen.1303" + "QURAN · RECITATION" under it; then the name flies to the footer watermark, the logo shrinks to the top (118 px) and a gold dot drops a line to the floor. HUD fades in ≈ 1.9 s. |
| 3.0 s → | Recitation starts (OFF = 3.0 s; 001 used 1.8 s). Pages of 1–3 lines (≤ 9 words), karaoke word by word, scene above illustrates each word/phrase. Page switch = soft fade, header/counter update. |
| last word + 0.25 s | **Logo outro** (≈ 4.8 s): big logo (430 px) with rotating dashed ring, "aymen.1303", "FOLLOW · SHARE", CTA «شاركها لعلها تكون صدقة جارية», world fades, final 0.45 s fades out. |
Talk/tips reels: same intro/outro idea; the CTA can be the takeaway (e.g. «اطمئن في صلاتك», «أحسن الظن بالله»).

## 9. أمثلة موصوفة — Examples described in words
- **Ref work 1 — Naseeha, khushu' in prayer (117 s)** (`reference/ref_work1_khushu_fatiha.jpg`): header «نصيحة · الخشوع في الصلاة»,
  footer `07 / 10 … AT-TUMA'NINAH FI AS-SALAH`. A sheikh's voice; Naskh text with tashkeel; gold lines: a protractor with
  points, arcs, a mihrab. Key words end gold («تَطْمَئِنَّ»). Outro: logo + «اطمئن في صلاتك».
- **Ref work 2 — Hadith qudsi, husn al-dhann (30 s)** (`ref_work2_hadith_work4_luqman.jpg`, left): «حديث قدسي · حسن الظن بالله»,
  low warm voice, few slow text beats (≈ 4 s). Outro: logo + «أحسن الظن بالله».
- **Ref work 3 — "تفوتك صلاة الفجر؟" tips (141 s)** (`ref_work3_fajr_tips_a/b.jpg`): fast explainer (≈ 2.35 s per beat), bold sans
  with gold glow boxes, icons (alarm, phone, clock), `FIG.0x — SLEEP / ALARM / CALL`, credit to Ibn Uthaymeen. Darker during the
  warning part. CTA «شاركها لعلها توقظ أحداً لصلاة الفجر». (Its octagram outro is the ONE exception; Ayman's reels use the logo.)
- **Ref work 4 — Quran, Luqman 31:7–9 (48 s)** (right half of `ref_work2_hadith_work4_luqman.jpg`): `QURAN · 31:07`, «سورة لقمان · الآية ٧»,
  recitation with reverb, whole ayah on screen ≈ 12 s revealed with the voice. Logo + «شاركها لعلها تكون صدقة جارية».
- **Made 001 — Al-'Ankabut 29:2–7 (88 s)** (`made_001_ankabut_2-7.jpg`) and **Made 002 — At-Tawbah 9:102–104 (63 s)**
  (`made_002_tawbah_102-104.jpg`): Ayman's own recitation videos rebuilt in this style. 002 is the reference build:
  stick figure confessing (slump) → spotlight + dua → offering sadaqa (rising orbs) → arched door of tawbah glowing → raise.
  `video/src/religious/ReligiousDemo.tsx` replays 002's real word timings silently.

## 10. افعل / لا تفعل — Do's and don'ts (from Ayman's feedback and the 001→002 fixes)
**Do**
- Use only the audio from his video, cleaned to a calm pro-mic sound.
- Logo professionally at the start and end; "aymen.1303" big at intro/outro, subtle watermark throughout.
- Quran text always on screen at the bottom; visualise every word.
- Give accurate progress %: what is done, what remains.
- Put a **text shield** (dark gradient) under the verse so light rays/spotlight never wash over text.
- Keep figures big enough (002 figure = 1.62× scale, stroke 11; 001's were too small).
- Use separate particle pools per effect (shared pools made dust jump in 001).
- Render with BT.709 tv-range colour (001 had a colour/brightness shift).
- Run ASR in chunks (full-file Whisper hallucinated); use forced-alignment times directly (energy "refinement" shifted words).

**Don't**
- No SFX and no music on Quran recitation. No nasheed, no beat.
- No grid background, no push-in/zoom in the base style, no hard cuts, no black frames.
- Don't take colours from his inspiration videos (only their method).
- Don't add a reciter name unless he asks. Don't use an octagram as the brand mark.
- Don't type Quran from memory or show ASR text. Don't invent hadith, gradings or numbers.

## 11. النشر — Publishing (caption for TikTok + IG Reels)
- Original sound only (no added music from the app).
- Caption format: the verse in ﴿ ﴾ → its meaning (from a known source) → a short dua → «📖 سورة … : الآية …» →
  «شاركها لعلها تكون صدقة جارية 🤍» → hashtags.
- Best time to post: after maghrib or isha (Tunisia).
- Write hook/caption/CTA with `sam-content-os` (in Fusha) and log the reel in `religious/content-log.md`.

## 12. قائمة الفحص — QA checklist (before every render/push)
- [ ] Verse text = `quran.py` output exactly (diff it), tashkeel + waqf marks intact, ayah numbers correct, surah:ayah in header/footer.
- [ ] Every word lights up within ≈ 0.1 s of being recited (check 3+ points in Studio / stills).
- [ ] No text touched by light rays, particles or the figure; nothing outside the safe area (y 142–1806).
- [ ] Logo intro + outro present; watermark visible but subtle; no reciter name unless asked.
- [ ] Palette = navy/gold/white/grey only (+ coral only in the character layer).
- [ ] No hard cuts, no black frames (`ffmpeg -vf blackdetect`), no grid, no SFX on Quran.
- [ ] Audio: clean voice, drone ≈ −35 dBFS, **−14 LUFS, TP ≤ −1 dBTP** (`scripts/analyze-audio`).
- [ ] 1080×1920, 30 fps, H.264 yuv420p BT.709 tv, AAC 44.1/48 kHz stereo.
- [ ] Saved as `videos/<name>-v<N>.mp4` (never overwrite), committed, pushed; content log row added.

## 13. خريطة الملفات — File map
| Path | What |
|---|---|
| `religious/README.md` | this file |
| `religious/style_analysis_measurements.md` | full measurements of Ayman's reference video |
| `religious/reference/*.jpg` | contact sheets: his reference works, the 2 made reels, the character refs |
| `religious/brand/` | logo (original + transparent) |
| `religious/data/quran-uthmani.json` | verified Uthmani Quran, offline (1.4 MB) |
| `religious/tools/quran.py` | get ayat text / find a passage / romanise for alignment |
| `religious/tools/build_ayah_data.py` | recitation audio + ayat → word timings + pages JSON (`--fa` forced alignment) |
| `religious/tools/clean_voice.sh` | raw video → clean voice |
| `religious/tools/mix_master.py` | clean voice → reverb + drone + −14 LUFS master + meta JSON |
| `religious/original-pipeline/` | the original HTML/SVG/GSAP + Python scripts of reel 002 (reference only) |
| `religious/content-log.md` | content log of religious reels |
| `video/src/religious/` | Remotion kit: `RecitationReel` template, `NavyBackground`, `HudFrame`, `AyahKaraoke`, `TipCaption`, `LogoBrand`, `StickFigure`, `LineArt`, `theme`, `anim` |
| `video/src/religious/ReligiousDemo.tsx` | demo composition `ReligiousDemo` (002 timings, silent) |
| `video/public/religious/` | fonts, logo, grain, dust used by the kit |

## 14. غير موجود / غير مؤكد — Not found / not confirmed
- No separate style ZIP/file existed; the style was rebuilt from the reference video + chat.
- The reciter credit was never confirmed (see §1).
- `speech_ref4` (speech-visualisation reference) has no contact sheet; only the method is described above.
- Hadith/tafsir sources are NOT bundled offline: verify with Ayman when unsure.
- Recitation audio is not in the repo (copyright/size): Ayman sends it each time.

## 15. ما نأخذه من دليل @aymen.ai.lab — Lessons from the Instagram session (`docs/montage-playbook.md`)
Taken because they fit Ayman's style; everything else in that playbook (slow 4.5 % push-in, hard cuts, black frame at the
end, lavender/peach palette, accent pill `#e8775a`, AI voiceover) does NOT apply to religious reels.
- **Each shot is made from the previous one** (dot → line → shape → figure…) and **match cuts**: elements collapse into the
  point the next scene grows from. Same idea as our "element-level morph, no hard cuts" (§3), use it actively.
- **Reference-video analysis**: `ffprobe`; cut points with `select='gt(scene,0.2)'`; contact sheets at 4 fps (10 fps around
  transitions); `ebur128` for loudness; a table «second → scene → can we match it». Then rebuild in our style.
- **Word timing cross-check**: ElevenLabs `eleven_scribe_v1` (connector, uses credits) next to MMS forced alignment.
- **Metrics**: Windsor.ai connector can read Instagram numbers into `religious/content-log.md`. Posting only with
  explicit approval of the exact post.
- **Pitfalls**: Arabic on an SVG `textPath` does not render (place letters by hand); long Arabic titles 86–130 px on
  1080 wide; screen-left = small `left` (read the script literally in RTL); measure loudness with `ebur128` after render.
- **Captions/hooks**: `ig-reel` (`hookscore.py`, `beats.py`) and `ig-caption` skills are English-centric; scores on
  Arabic are rough. Religious text rules (§7) always win.
- Sources list: `docs/resources.md`.

## 16. الأسلوب ٢ — Style v2 (2026-10-29): hand-inked, acted, finished
Same palette, same HUD, same rules. What changed (from the `clawd-animation` and `video-finishing-sound` skills):
- **Ink boil + brush grain** on the scene layer (`InkLayer`, `video/src/religious/InkBoil.tsx`; on by default in
  `RecitationReel`, `ink={false}` for clean vectors). Lines wave very slightly and change 12×/s like hand-drawn animation;
  a fine grain makes strokes look brushed. Colours are untouched. Use it in talk reels too: wrap the `<Scene/>` in `<InkLayer>`.
- **Write the reads before the code** (a small timing sheet per page): for every word/phrase, what the viewer must
  understand, when, and where the eye is. One read at a time; fast actions, held meanings; let the reads set the length.
- **Draw the meaning (tafsir), not decoration**: every key word gets its own visual beat that matches its meaning
  (e.g. «عرضها السماوات والأرض» = a width line spanning seven heavens and the earth). Up = divine (light only), down = worldly.
- **Motion**: anticipation before big moves (squash/crouch), overshoot + settle on pose changes (`E.back`), arcs for
  thrown/rising things, no twinning (pairs of figures get different poses, sizes and phases), something always moving.
- **Hook** in the first 3 s over the logo intro: one plain-Arabic line that states the promise of the verses (never
  Quran text, never hype), e.g. «سباقٌ… جائزتُه بِسَعَةِ السماواتِ والأرض».
- **Recitation kept exactly as is** when Ayman asks: only silence in front for the intro, AAC 320k, and verify
  correlation with the source ≥ 0.999 (see `ImranReel`). When the reciter repeats words, the text repeats them.
- **Finishing**: render with `--crf 17 --color-space bt709`, then `bash religious/tools/finish.sh in.mp4 out.mp4`
  (+faststart, BT.709 tags, loudness report; streams copied).
Reference build: `video/src/religious/ImranReel.tsx` → `videos/imran-133-134-v2.mp4`.
