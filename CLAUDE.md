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
  `@remotion/fonts`. Never use `@remotion/google-fonts`. Prefer the offline assets; new sounds only via `openverse-sfx`.
- `scripts/analyze-audio <file> [--out x.json] [--fps 30]` (Python + ffmpeg, offline): speech/silence segments,
  loudness curve, onsets/beats/BPM, LUFS, frame numbers.
- لا تقل إنك لا تسمع الصوت؛ حلّله بـ audio-analysis
- Never say you can't hear audio; analyze it with the audio-analysis skill (`scripts/analyze-audio`).

## Sound tools (added 2026-10-26)

- `earshot` + `real-sound` skills (https://github.com/Leonxlnx/earshot, MIT, vendored in `tools/earshot/`): make sound
  effects in code and "listen" to audio. Install each session: `scripts/install-earshot` (light) or `--full` (models).
  30 calm code-made sounds are already rendered in `assets/sfx/earshot_calm/` (see `assets/sfx/INDEX.md`).
- `real-sfx` skill (https://github.com/Clipwing/skills, scripts MIT, bundled uisfx sounds CC0; see its `LICENSE.md`):
  places each sound on the exact frame and returns a mixed MP4 + SFX WAV. Its `config.json` uses `assets/sfx/` as the
  main library; rebuild the index after adding sounds: `cd .claude/skills/real-sfx && python3 scripts/build_index.py`.
- `openverse-sfx` skill + `scripts/openverse-sfx`: search Openverse for free sounds; only CC0 / public domain
  (CC BY with credit and the user's OK). Never NC / ND / SA. Freesound and Wikimedia file downloads are blocked from
  the cloud container; the search still works.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- When graphify-out/graph.json exists, run `graphify query "<question>"` before your first grep, search or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
- A committed graphify-out/graph.json is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.

## Reels content (`reels/`)

- `reels/sam-content-os/` is the SAM Content OS skill (https://github.com/saoudphotos/sam-content-os, by @saoudalajme;
  the repo has no licence file, so keep it for personal use). It loads through the symlink
  `.claude/skills/sam-content-os`. Use it whenever the user sends a reel topic: hook, script, caption, edit guide, CTA,
  score. Keep its content log at `reels/content-log.md`. `reels/sam-content-os.skill` is the upload file for claude.ai.
