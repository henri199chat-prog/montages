---
name: openverse-sfx
description: Use when a video needs a real recorded sound (ambience, nature, bell, singing bowl, water, wind, crowd, foley) that is not in assets/sfx - search the Openverse API (api.openverse.org) for free sounds and download ONLY ones whose licence allows commercial use and editing (CC0 / public domain by default; CC BY only with credit). Never use NC, ND or SA sounds.
---

# openverse-sfx: free sounds from Openverse, licence-checked

Script: `scripts/openverse-sfx` (Python stdlib + ffmpeg, no API key).

```
scripts/openverse-sfx search "singing bowl" --max-sec 15            # CC0 + public domain only
scripts/openverse-sfx search "rain on window" --category sound_effect -n 20
scripts/openverse-sfx get <id> --name calm_bowl_01                    # -> assets/sfx/openverse/calm_bowl_01.mp3
scripts/openverse-sfx search "..." --allow-by / get <id> --allow-by  # also CC BY (credit required)
```

## Licence rules (always)

1. Allowed by default: `cc0`, `pdm` (public domain). No credit needed, commercial use OK.
2. `by` (CC BY): only with `--allow-by`, and the credit line in `assets/sfx/openverse/CREDITS.md` MUST go in the
   video description / end card. Ask the user before using one.
3. Never: `by-nc`, `by-nd`, `by-sa`, `by-nc-sa`, `by-nc-nd`, `sampling+`, `nc-sampling+`. The script refuses them twice
   (search filter and a re-check at download).
4. Every download is appended to `assets/sfx/openverse/CREDITS.md` (file, title, creator, licence, source page). Keep it.

## Network limits in this cloud container (checked 2026-10-26)

- The Openverse API itself works (search, details).
- Downloading the audio file is often refused by the host that stores it: `cdn.freesound.org` answers 403 here and
  `upload.wikimedia.org` answers 429 to the container's shared IP. The script then prints the source page: tell the
  user they can download it on their phone and upload it to the repo, or choose a sound from `assets/sfx/`
  (including the code-made `assets/sfx/earshot_calm/`) instead. Do not try to get around the block.

## After download

- Check it with `scripts/analyze-audio` (or `earshot measure`), trim/normalise with ffmpeg, copy to `video/public/sfx/`.
- Add a row to `assets/sfx/INDEX.md` and `assets/LICENSES.md`.
