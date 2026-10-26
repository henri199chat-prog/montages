# Offline asset kit

Everything here works with no internet. All of it is free to use in commercial videos (see `LICENSES.md`).

| folder | what | size |
|---|---|---|
| `sfx/` | 87 CC0 sound effects (MP3), catalogue in `sfx/INDEX.md` | ~3.6 MB |
| `fonts/` | 19 font families (Arabic + Latin display), WOFF2 + OFL.txt | ~2.5 MB |
| `overlays/` | light leaks, grain tile, dust, bokeh, glow sprite | ~0.5 MB |

Remotion's `staticFile()` only serves `video/public/`, so copy what a video uses there first:
```bash
mkdir -p video/public/sfx video/public/fonts video/public/overlays
cp assets/sfx/boom_cinematic_01.mp3 video/public/sfx/
cp assets/fonts/Cairo/Cairo-Variable.woff2 video/public/fonts/
cp assets/overlays/grain_tile_512.png video/public/overlays/
```
Then:
```tsx
import { loadFont } from "@remotion/fonts";
loadFont({ family: "Cairo", url: staticFile("fonts/Cairo-Variable.woff2"), weight: "200 1000" });
<Sequence from={45}><Audio src={staticFile("sfx/boom_cinematic_01.mp3")} volume={0.6} /></Sequence>
```
Details: skill `.claude/skills/offline-assets/SKILL.md`. Analyse any audio with `scripts/analyze-audio`.
