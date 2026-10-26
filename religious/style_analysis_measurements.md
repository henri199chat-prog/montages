# Reference "House Style" Analysis: Ayman's religious edits

Source: `reference/lv_0_20261023144305.mp4`, 410 MB, downloaded from Drive with gdown (public link, it worked).
Brand logo: `brand/logo.png` (1254×1254, gold calligraphic "A" with an arch and circle on navy #050E17). **This same logo is the outro mark in the reference video.**

## 1. Metadata
| Item | Value |
|---|---|
| Duration | 336.20 s (5:36.2), 10,086 frames |
| Resolution | 1080×1920, **9:16 vertical**, SAR 1:1 |
| FPS | 30 constant |
| Video | H.264 High, yuv420p, BT.709, about 9.6 Mb/s (encoder `bytevehwavc`) |
| Audio | AAC-LC, 44.1 kHz, stereo, about 159 kb/s |
| Container tags | Exported from **CapCut Android (product "vicut", app 15.5.0, region TN)**, export target 12 Mb/s. No template, effect, or transition IDs are recorded, so it was hand-built. |

## 2. Compilation structure: 4 separate works
I found the boundaries from logo outros, audio silences/dips and changes in the header labels:

| # | Time range | Length | Topic / header (L = Latin mono, R = Arabic) | Outro |
|---|---|---|---|---|
| 1 | 0:00.0 – 1:57.2 | 117.2 s | Naseeha, khushu' in prayer. L "KHUSHU' · PRAYER", R "نصيحة · الخشوع في الصلاة", footer "07 / 10 … AT-TUMA'NINAH FI AS-SALAH". Covers al-Fatiha and the hadith "قسمت الصلاة". | Logo + "اطمئن في صلاتك" (1:53–1:56) |
| 2 | 1:57.2 – 2:27.7 | 30.5 s | Hadith qudsi, husn al-dhann. R "حديث قدسي · حسن الظن بالله" | Logo + "أحسن الظن بالله" (2:23–2:27) |
| 3 | 2:27.7 – 4:48.6 | 140.9 s | "تفوتك صلاة الفجر؟", tips for waking for Fajr. L "FIG.0x — SLEEP/ALARM/CALL…", R "بروتوكول الفجر · 04 / 01". Credit: "الشيخ محمد بن صالح العثيمين رحمه الله". | Gold octagram (8-point star) + CTA "شاركها لعلها توقظ أحداً لصلاة الفجر" (4:43–4:48). No logo. |
| 4 | 4:48.6 – 5:36.2 | 47.6 s | Quran, Luqman 31:7–9. L "QURAN · 31:07", R "سورة لقمان · الآية ٧", footer "LUQMAN · 31 : 7 — 9" | Logo + "شاركها لعلها تكون صدقة جارية" (5:32–5:36) |

Boundary evidence:
- 1→2: audio dip to −42 LUFS momentary at 116–117 s, plus the logo outro.
- 2→3: logo, then the strongest visual change score in the file (147.7 s).
- 3→4: true silence from 287.7 to 289.6 s.

Works 1, 2 and 4 open the same way: a small gold logo at the top-centre, and a single glowing dot that draws a thin line downward. Work 3 opens cold on its title question.

## 3. Cuts and pacing
- **There are 0 hard cuts.** ffmpeg scdet's highest score was 2.4 (a hard cut is usually above 10). Between consecutive frames, at most 12% of pixels ever change.
- The piece is **100% motion graphics** on one continuous background. It has no live footage: no nature, mosques or sky. Scenes change only by animating graphic elements in and out.
- I measured the rhythm with "caption/layout change events" in the lower caption band (86 events in total). The mean gap is 3.9 s and the median 2.8 s.
  - W1: 21 events, mean 5.3 s, median 5.5 s (range 1.8–9.1). Slow, contemplative.
  - W2: 5 events, mean 5.1 s, median 4.1 s.
  - W3: 57 events, mean 2.4 s, median 2.35 s (range 0.9–5.1). Fast, punchy "explainer" pace.
  - W4: 3 events, mean 11.9 s. A whole ayah stays on screen and is revealed progressively in time with the recitation.
- Caption timing follows the voice word by word (karaoke reveal), not pauses. Only 22% of caption changes fall within 0.7 s of an audio pause, which is the same as chance.

## 4. Visual style (what I saw on the contact sheets)
**Palette and grading**
- Background is a flat deep navy/teal-blue with a radial **vignette**: centre about #152E43, mid #10202E, corners about #0A141D.
- Background clusters: #0E1D2B (38%), #162A39 (31%), #08131C (26%), #050911.
- Accents:
  - Warm gold #E3CC8F (highlights) and muted gold #B09F75 / #A69B7D (lines, labels, header Arabic)
  - Off-white text #F0F2EB / #FBFBFB
  - Dim grey #97A0A2 (text not yet read)
  - Muted teal #608F8C (Latin monospace labels)
- Bright pixels are only about 0.7% of the frame, so the look is very minimal and dark.
- Mean luma is 41/255 throughout. W3 dims to about 32 during the warning section "تأخيرها عمداً" (4:26–4:42).

**Frame chrome (a "HUD/editorial" layout, the same in every work)**
- Thin L-shaped **corner brackets** sit at all 4 corners.
- Header row near the top (about y = 5–7%):
  - Left: Latin label in letter-spaced uppercase **monospace**, teal-grey (e.g. "QURAN · 31:07", "FIG.02 — SLEEP").
  - Right: Arabic "category in gold · topic in light grey".
  - A thin hairline sits under the row.
- Footer row near the bottom: page counter in mono ("07 / 10"), a centred transliterated title in spaced mono caps, and a hairline above.
- Faint drifting dust/star **particles** (tiny dots) appear everywhere.
- There are no light leaks, film grain, borders or letterbox.

**Typography (Arabic throughout, centred)**
- Main text sits in the lower-middle (about 60–75% height). It is large, about 5–7% of frame height per line, with 1–3 lines.
- W1, W2 and W4 use a **classical Naskh with full tashkeel** (Amiri / KFGQPC-Uthmani style). Quran uses Uthmani script with ornate gold **﴿ ﴾ brackets** and an ayah-number medallion.
- W3 uses a **bold modern geometric Arabic sans** (Cairo/Tajawal/Readex-like). The key word goes in a **gold rounded-rectangle outline box with soft glow**, and the gold boxes are reused for each highlighted word.
- **Karaoke reveal:** upcoming words sit in dim grey (about 40% opacity) and light up to white or gold as they are spoken. Key words end in gold (e.g. "تَطْمَئِنَّ", "هَوْنًا", "سَيَغفِر").
- There is a secondary small line of context (source or attribution) in grey or gold above the main text.

**Illustration and motion language**
- Everything is thin-line gold/teal vector art at 1–2 px with glowing nodes: concentric circles, arcs, a semicircle "protractor" with labelled points, horizontal timelines with dots, a mihrab/arch outline with a water line, ripple/wifi arcs, heart + ECG line, clock dial with hands, alarm clock, phone icon, mind-map hub diagram, "×431" counters, an Islamic octagram, and tree/garden line drawings for Jannah.
- Motion types are line draw-on, nodes orbiting or travelling along paths, dials rotating, a pulse/glow on a focus element, gentle fades, and a spotlight/lens circle (4:39) that focuses on a word.
- There is **no Ken Burns and no camera zoom**. The background is static and only the elements animate.
- Framing is a strict centre axis with a vertical symmetric composition. The diagram sits in the upper-middle and the text in the lower-middle.

**Intro and outro**
- Intro: small logo at the top, then a dot and line drawing into the first diagram. The text starts within about 1 s.
- Outro: a centred gold logo inside a thin circle with diamond ticks (or the gold octagram in W3), plus a one-line CTA/takeaway in white or gold. It is held about 3–4 s, then fades to the empty background.

## 5. Transitions
- blackdetect found **no black frames**. The minimum luma is 31, so there are no dips to black.
- Every transition is an **element-level crossfade/morph on a persistent background**: the old diagram fades or shrinks to a dot, and the new one draws on. Text crossfades with the karaoke reveal.
- Between works the move is: logo outro, fade to empty background (about 0.5–1 s), then the new intro.

## 6. Audio
- Whole file: **−14.1 LUFS integrated**, true peak **−1.0 dBTP**, LRA 5.4 LU. Each work is normalised separately to −14.0 LUFS:

| Work | Integrated | True peak | LRA |
|---|---|---|---|
| W1 | −14.0 LUFS | −2.3 dBTP | 7.0 LU |
| W2 | −14.0 LUFS | −1.0 dBTP | 6.0 LU |
| W3 | −14.1 LUFS | −1.4 dBTP | 4.2 LU |
| W4 | −14.0 LUFS | −1.6 dBTP | 3.6 LU |

- Content is voice-led. These are estimates from spectral analysis, since I can't listen:
  - **W1:** almost mono (side/mid 0.09), spoken male lecture/naseeha clip, 32 speech pauses (average 0.9 s).
  - **W2:** bass-heavy (58% of energy at 60–250 Hz) and wider stereo, so the voice has a low pad or reverb.
  - **W3:** continuous narration from Ibn Uthaymeen with few pauses, stereo width 0.30, compressed (low dynamics).
  - **W4:** **Quran recitation** with reverb (side/mid 0.33), dark tone (centroid 970 Hz, almost nothing above 4 kHz), long melodic phrases, 20% quiet frames between ayat.
- During pauses in W1–W3 a quiet **low tonal drone/pad** stays on, about −33 to −36 dBFS, with spectral peaks at about 54/81/120 Hz. It's a soft ambient bed, not a melodic music track. I found no clear nasheed, percussion or melody, and no obvious SFX hits.
- Silence ≥0.3 s at −35 dB appears only at 0–0.32 s, 287.7–289.6 s (the gap between works 3 and 4) and the final outro (328.3–336.2 s, where the tail fades under the logo).

## 7. HOUSE STYLE RULES (what all 4 works share)
1. **Format:** 1080×1920, 30 fps, H.264 about 10–12 Mb/s, AAC 44.1 kHz stereo. Built in CapCut style, about 0.5–2.5 min per piece.
2. **No stock footage.** Motion graphics only, on one deep-navy radial-vignette background (#152E43 centre to #0A141D edges) with faint floating dust particles.
3. **Two-colour accent system:** gold (#E3CC8F bright / #B09F75 muted) for emphasis, lines and brand; off-white #F0F2EB for text; grey (about #97A0A2 at low opacity) for unread text; teal #608F8C for Latin mono labels.
4. **HUD frame:**
   - 4 corner brackets.
   - Header: Latin mono label on the left, Arabic "gold category · grey topic" on the right, with a hairline.
   - Footer: a mono counter and a transliterated title.
5. **Arabic centred text in the lower-middle with a karaoke word reveal** that follows the voice. Classical Naskh with tashkeel for Quran and hadith (Quran gets ﴿﴾ gold brackets and an ayah medallion). Bold modern sans with gold glow boxes for key words in tips/explainers.
6. **Thin-line gold iconography/diagram** in the upper-middle that illustrates each idea (circles, arcs, timelines, clocks, hearts, octagram, mihrab arch), animated by draw-on, orbit and pulse.
7. **No hard cuts, no black dips, no zooms.** Only soft crossfades and morphs of elements; pacing comes from caption changes (2.5–5.5 s per beat, slower for Quran).
8. **Intro:** small logo at the top, then a dot and line drawing in. **Outro:** the centred gold "A" logo (brand/logo.png) in a thin circle, plus a one-line takeaway or "شاركها لعلها…" share CTA, held about 3–4 s.
9. **Audio:** a voice-only source (sheikh clip or recitation) over a very quiet low ambient drone (about −35 dBFS). No melodic music. Normalise to −14 LUFS integrated, true peak ≤ −1 dBTP.
10. **Sourcing on screen:** name the sheikh or hadith source in a small gold/grey line, and give the surah and ayah reference in the header and footer.

## Files
- Original: `reference/lv_0_20261023144305.mp4`
- Proxies (720×1280, H.264 CRF24, AAC 128k):
  - `reference/proxy_full_720p.mp4` (16 MB, whole file)
  - `reference/proxy_work1_0000-0157.mp4` (4.6 MB)
  - `reference/proxy_work2_0157-0228.mp4` (1.9 MB)
  - `reference/proxy_work3_0228-0449.mp4` (7.2 MB)
  - `reference/proxy_work4_0449-0536.mp4` (2.3 MB)
- Contact sheets:
  - `reference/contact_work1.jpg`
  - `reference/contact_work2_work4.jpg`
  - `reference/contact_work3_a.jpg`
  - `reference/contact_work3_b.jpg`
  - `reference/timeline_overview.jpg` (1 frame every 3 s)
  - `reference/detail_108.jpg`, `detail_262.jpg`, `detail_318.jpg` (1 fps around the boundaries)
- Keyframes: `reference/frames/kfNN_wW_tSSS.jpg` (64 full-res; named by work and time in seconds)
- Raw data: `reference/scdet.txt`, `yavg.txt`, `ebur.log`, `silence.log`, `black.log`, `beats.json`, `pauses.json`
