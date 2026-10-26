---
name: offline-assets
description: How to use the repo's offline asset library (assets/sfx sound effects, assets/fonts Arabic + Latin fonts, assets/overlays light leaks/grain/dust/bokeh) inside the Remotion project in video/. Use whenever a video needs a sound effect, an ambient drone, a font, or a texture overlay, or when you are tempted to download one (you are offline).
---

# Offline assets: SFX, fonts, overlays

Everything lives at the repo root in `assets/` (licenses in `assets/LICENSES.md`, all free: CC0 sounds,
OFL fonts, self-made overlays). Remotion only serves files from **`video/public/`**, so copy what a video needs:

```bash
# from repo root — copy only what you use (keeps the bundle small)
mkdir -p video/public/sfx video/public/fonts video/public/overlays
cp assets/sfx/whoosh_soft_01.mp3 assets/sfx/boom_cinematic_01.mp3 video/public/sfx/
cp assets/fonts/Cairo/Cairo-Variable.woff2 video/public/fonts/
cp assets/overlays/light_leak_warm_01.jpg video/public/overlays/
```
Then reference with `staticFile("sfx/whoosh_soft_01.mp3")`. Do not hot-link `../assets` from code;
`staticFile()` only sees `video/public/`. Commit the copied files with the video (they are small).

## Sound effects — `assets/sfx/` (see `assets/sfx/INDEX.md` for every file)
Families (all MP3 44.1 kHz, peak-normalised to −1 dBFS, so set `volume` per use):
- Transitions: `whoosh_soft_01`, `whoosh_fast_02`, `whoosh_deep_03`, `whoosh_long_04`, `whoosh_reverse_05` (builds INTO a cut),
  `whoosh_air_06/07`, `swish_01..04` (very short), `swipe_ui_01`.
- UI / HUD: `click_*`, `tick_*`, `tick_soft_01`, `beep_hud_*`, `beep_confirm_04`, `beep_data_03`, `scan_hud_01`,
  `counter_roll_01` (number count-up), `ding_notify_01`, `switch_toggle_01`, `pop_*`, `error_buzz_01`, `powerup_01`.
- Impacts: `boom_cinematic_01`, `boom_sub_02`, `boom_explosion_03`, `boom_crunch_04`, `hit_trailer_01`, `hit_punch_01/02`,
  `hit_metal_clang_01`, `hit_soft_01`, `hit_glass_01`, `thud_soft_01`.
- Build / release: `riser_noise_01` (2.7 s), `riser_tonal_02` (4.3 s), `riser_dark_03` (4.9 s), `downlifter_01`, `downlifter_sub_02`,
  `swell_reveal_01`.
- Magic / light: `shimmer_01`, `sparkle_02`, `chime_soft_01`, `chime_high_02`, `gong_soft_01`, `bell_metal_01`.
- Glitch: `glitch_digital_01`, `glitch_short_02`, `glitch_03..05`.
- Foley: `shutter_camera_01/02`, `shutter_synth_01`, `typewriter_key_01/02`, `typewriter_return_03`, `typing_keyboard_loop`,
  `keypress_01`, `page_turn_01/02`, `book_open_01`, `book_close_01`, `heartbeat_single_01`, `heartbeat_slow_loop`,
  `heartbeat_fast_loop`, `heartbeat_synth_loop_60bpm`, `wind_gentle_loop` (20 s), `wind_gust_01`.
- Beds (no melody, loopable 20 s, fit religious content): `drone_calm_low_loop`, `drone_warm_pad_loop`,
  `drone_dark_space_loop`, `drone_air_texture_loop`; sci-fi hums `forcefield_hum_01`, `computer_noise_01`.

**Hit alignment:** most one-shots start on their transient (silence trimmed), so put the Sequence `from` on the event frame.
Exceptions: risers/`whoosh_reverse_05`/`swell_reveal_01` PEAK AT THEIR END → start them `durationInFrames` before the hit:
```tsx
const riserLen = Math.round(2.74 * fps); // riser_noise_01 duration from INDEX.md
<Sequence from={hitFrame - riserLen} durationInFrames={riserLen}><Audio src={staticFile("sfx/riser_noise_01.mp3")} volume={0.5} /></Sequence>
```
Whooshes peak ~55–60 % into the file: start them ~40 % of their length before the cut.
Loop a bed: `<Audio src={staticFile("sfx/drone_calm_low_loop.mp3")} loop volume={0.12} />`.

## Fonts — `assets/fonts/<Family>/` (WOFF2 + OFL.txt)
| Family | File(s) | Best for |
|---|---|---|
| Cairo | `Cairo-Variable.woff2` (wght 200–1000) | captions (Cairo Black 900 = house caption style), UI text |
| Tajawal | Regular / Bold / Black | clean modern captions, ads |
| Almarai | Regular / Bold / ExtraBold | very legible body text, ads |
| IBM Plex Sans Arabic | Regular / Bold | HUD labels, data, religious UI text |
| Readex Pro | `ReadexPro-Variable.woff2` (wght 160–700) | tech/UI, numbers |
| Noto Kufi Arabic | variable 100–900 | titles, bold geometric |
| Noto Naskh Arabic | variable 400–700 | readable body / fallback with tashkeel |
| Changa | variable 200–800 | sporty, football, gaming |
| Lalezar | Regular | heavy display hooks, football, comedy |
| Marhey | variable 300–700 | playful/comedy |
| El Messiri | variable 400–700 | elegant titles |
| Reem Kufi | variable 400–700 | Kufic titles, chapter numbers |
| Aref Ruqaa | Regular / Bold | calligraphic titles, quotes |
| Amiri | Regular / Bold | hadith, classical quotes (full tashkeel) |
| Amiri Quran | Regular | **Quranic text** (Uthmani marks ۚ ۖ ۗ) |
| Scheherazade New | Regular / Bold | Quran / heavy tashkeel alternative |
| Bebas Neue, Anton | Regular | Latin display, scores, big numbers |
| Montserrat | variable 100–900 | Latin UI/body |

Load (works offline, `@remotion/fonts` is installed):
```tsx
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
loadFont({ family: "Cairo", url: staticFile("fonts/Cairo-Variable.woff2"), weight: "200 1000" });
loadFont({ family: "Amiri Quran", url: staticFile("fonts/AmiriQuran-Regular.woff2"), weight: "400" });
// usage: style={{ fontFamily: "Cairo", fontWeight: 900 }}
```
Call `loadFont` at module top level (Remotion waits for it with delayRender internally). Static files: one `loadFont`
per weight with `weight: "700"`. Never use `@remotion/google-fonts` (needs internet).

## Overlays — `assets/overlays/`
| File | Use |
|---|---|
| `light_leak_warm_01.jpg`, `light_leak_cool_02.jpg`, `light_leak_gold_03.jpg`, `light_leak_red_04.jpg` (1080x1920 on black) | `mixBlendMode: "screen"`, opacity 0.2–0.7, drift/scale slowly; flash to 0.9 over a cut as a light-leak transition |
| `grain_tile_512.png` (neutral grey noise) | film grain: tile it, `mixBlendMode: "overlay"`, opacity 0.06–0.12, move the tile randomly each frame |
| `dust_specks_01.png` (RGBA) | old-film dust, opacity 0.3–0.6, jitter position every 2 frames |
| `bokeh_gold_01.png` (RGBA) | floating particles for religious/premium looks, slow upward drift |
| `glow_sprite_512.png` (RGBA white radial) | glows behind numbers/logos; tint with CSS `filter` or use as mask |

```tsx
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame, interpolate } from "remotion";
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.08 }) => {
  const f = useCurrentFrame();
  const x = Math.floor(random(`gx${f}`) * 512), y = Math.floor(random(`gy${f}`) * 512);
  return <AbsoluteFill style={{ backgroundImage: `url(${staticFile("overlays/grain_tile_512.png")})`,
    backgroundPosition: `${x}px ${y}px`, mixBlendMode: "overlay", opacity, pointerEvents: "none" }} />;
};
export const LightLeak: React.FC<{ src?: string; peak?: number }> = ({ src = "overlays/light_leak_warm_01.jpg", peak = 0.6 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 8, 20], [0, peak, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ mixBlendMode: "screen", opacity: o }}>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", transform: `scale(${1.1 + f * 0.004}) rotate(${f * 0.2}deg)` }} />
  </AbsoluteFill>;
};
```
Vignette needs no file: `background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)"`.
