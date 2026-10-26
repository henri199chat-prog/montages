---
name: montage-kit-index
description: Start here for ANY new montage / reel / ad / AMV / religious video in Remotion in this repo. Routes to the pro-editing skills (style, beat sync, audio analysis, transitions, kinetic text, Arabic text, captions, mixing, religious HUD, AMV) and to the offline asset library in assets/ (SFX, Arabic fonts, overlays). Use before planning a video, and whenever you are about to say you cannot hear audio, cannot download a sound/font, or need a transition/SFX.
---

# Montage kit (offline) — index

This repo is used from a phone through Claude Code in an **offline** cloud session:
no `npm install`, no Google Fonts download, no sound downloads. Everything you need is already here.

## Golden rules
1. Reply to the user in Arabic (short, simple steps). He is a beginner on a phone.
2. **Never say "I can't hear the audio".** Run `scripts/analyze-audio <file> --fps 30` and read the JSON
   (speech segments, loudness, onsets, beats, peaks). See skill `audio-analysis`.
3. Never fetch fonts/sounds from the internet. Use `assets/` (copy what you need into `video/public/`).
   See skill `offline-assets`.
4. Only packages already in `video/package.json` exist (`remotion`, `@remotion/cli`, `@remotion/fonts`).
   `@remotion/transitions`, `@remotion/media`, `@remotion/media-utils`, `@remotion/google-fonts` are NOT installed:
   hand-roll transitions (skill `remotion-transitions-pro`) and use `Audio` from `"remotion"`.
5. After each version: render to `videos/<name>-v<N>.mp4`, commit, push (see root `CLAUDE.md`).

## Which skill to load
| Job | Skills |
|---|---|
| Any video: hook, story, pacing, when to cut | `pro-editing-style` |
| Know what is in an audio/voice/music file, timing | `audio-analysis` |
| Cut on music beats / VO words, place SFX on frames | `audio-beat-sync` |
| VO + music + SFX levels, ducking, fades, loudness | `audio-mixing-remotion` |
| Animated titles, word pops, counters | `kinetic-typography-remotion` |
| Whip pan, zoom-through, match cut, mask wipe, glitch, light leak, flash | `remotion-transitions-pro` |
| ANY Arabic text on screen (RTL, tashkeel, fonts, numerals) | `arabic-text-remotion` |
| Word-by-word captions for talking-head / VO reels | `talking-head-captions` |
| Quran / hadith / Islamic reflection reel (calm HUD, no music) | `religious-hud-reel` |
| Anime AMV / edit to a song | `anime-amv-edit` |
| Where the fonts/SFX/overlays are and how to load them | `offline-assets` |
| Remotion API basics | `remotion-best-practices` (official) |

## Default specs
- Reels/Shorts/TikTok: 1080x1920, 30 fps, H.264. Safe zone: keep text inside x 90–990, y 250–1500
  (bottom ~420 px and right ~120 px are covered by platform buttons).
- Master loudness about −14 LUFS, true peak ≤ −1 dBTP (check with `scripts/analyze-audio` on the render).
- Seconds → frames: `Math.round(sec * fps)`.

## Quick self-check before every render
- Hook visible in frame 0–15? Every SFX on its event (±1 frame)? Arabic text shaped correctly (no broken letters,
  no letter-spacing)? Nothing under the platform UI? Music not fighting the voice? No black frames?
- Render a few stills to look at: `npx remotion still <Comp> out.png --frame=120` (from `video/`).
