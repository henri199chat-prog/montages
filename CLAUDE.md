# montages

- The user is a beginner on a phone: reply in Arabic, with short, simple steps.
- The Remotion project lives in `video/`. Remotion skills are in `.claude/skills/`
  (official, from https://github.com/remotion-dev/skills); follow `remotion-best-practices`.
- After every new version of a video: render it to MP4 and save it as
  `videos/<name>-v<N>.mp4` (never overwrite older versions), then commit and push,
  so the user can watch it from GitHub on their phone.
  Render: `cd video && npx remotion render <CompositionId> ../videos/<name>-v<N>.mp4`
- `video/remotion.config.ts` points to the preinstalled Chrome in the cloud container,
  because Remotion cannot download its own there.
- HyperFrames skills (official, from https://github.com/heygen-com/hyperframes) are also in
  `.claude/skills/` (`hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`,
  `slideshow`, `figma`, `remotion-to-hyperframes`). HyperFrames is a separate framework
  (HTML to video); use it only when the user asks for it.
- Three skills copied from the user's Claude account are also in `.claude/skills/`:
  `video-ad-editor`, `video-editing-toolkit`, `clawd-animation`.
- `onetake` skill (from https://github.com/feitangyuan/onetake, PolyForm Noncommercial license:
  free for noncommercial use only) is in `.claude/skills/onetake/`. Example mp4/gif files were
  left out to keep the repo small; see the upstream repo for them.
- `openmontage/` is a copy of https://github.com/calesthio/OpenMontage (AGPLv3), kept for when it
  is needed; demo media, `.agents`, `.codex`, `.cursor` and `assets/` were left out. Its own
  CLAUDE.md and `.claude/skills/` do not load from the repo root: read `openmontage/AGENT_GUIDE.md`
  and the relevant skill there when a task needs it. Most of its pipelines call paid APIs
  (fal.ai, Veo, Kling, Google TTS...) that the cloud container's network blocks.

## Pro montage kit (offline)

- Start with skill `montage-kit-index` (`.claude/skills/montage-kit-index/SKILL.md`): it routes to
  `pro-editing-style`, `audio-analysis`, `audio-beat-sync`, `audio-mixing-remotion`,
  `kinetic-typography-remotion`, `remotion-transitions-pro`, `arabic-text-remotion`,
  `talking-head-captions`, `religious-hud-reel`, `anime-amv-edit`, `offline-assets`.
- Offline assets in `assets/`: `sfx/` (CC0 sound effects, see `assets/sfx/INDEX.md`), `fonts/` (Arabic + Latin,
  OFL), `overlays/`. Copy what you use into `video/public/` and load with `staticFile()` / `loadFont()` from
  `@remotion/fonts`. Never use `@remotion/google-fonts` or download anything (no internet).
- `scripts/analyze-audio <file> [--out x.json] [--fps 30]` (Python + ffmpeg, offline): speech/silence segments,
  loudness curve, onsets/beats/BPM, LUFS, frame numbers.
- لا تقل إنك لا تسمع الصوت؛ حلّله بـ audio-analysis
- Never say you can't hear audio; analyze it with the audio-analysis skill (`scripts/analyze-audio`).
