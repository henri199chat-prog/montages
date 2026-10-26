---
name: image-to-video
description: Use when the user wants to animate a still photo or picture into a video shot ("حرّك الصورة", "حوّل الصورة لفيديو", image to video, parallax, Ken Burns, a living photo for a reel or B-roll). Makes a 2.5D camera move inside the photo with a depth map (near things move more than far ones), offline on CPU, and explains the limit (it does not make people walk or talk).
---

# image-to-video: a still photo becomes a moving shot

## What it does (and does not)
- **Does:** a real 2.5D camera move. Depth Anything V2 Small (Apache-2.0) estimates depth, then each frame is warped
  so the foreground moves more than the background: dolly in/out, orbit, rise, pan, or a flat Ken Burns.
- **Does not:** make the subject move (walk, turn, blink, talk). That needs a generative video model (Kling, Seedance,
  Veo, Wan) on a GPU or a paid service; the cloud container has no GPU and the Higgsfield connector here cannot
  generate. Say this plainly if the user asks for character motion.

## Run
```bash
scripts/install-i2v                                   # once per session (CPU torch + transformers + OpenCV)
~/.i2v-venv/bin/python scripts/image-to-video.py photo.jpg out.mp4 --move push --dur 5
#   --move push | pull | orbit | rise | pan | kenburns    --strength 0.5..1.5 (parallax)   --size 1080x1920
#   --depth-out depth.png  (check the depth: white = near)
```
About 25 s for a 4 s 1080x1920 shot on CPU (model download once, ~100 MB).

## Choosing the move
| Photo | Move |
|---|---|
| Portrait / one subject in front of a background | `push` (reveal) or `orbit` (strongest 3D feel) |
| Landscape, street, room | `pan` or `rise` |
| Ending shot | `pull` |
| Flat image: poster, screenshot, text, logo | `kenburns` (depth would bend straight lines) |

## Quality rules
- Keep `--strength` ≤ 1.0 for faces; higher values stretch the edges of the subject.
- Hair, glasses frames and thin objects can wobble at the edge: check one frame mid-shot before using it.
- 3-6 s per shot; longer moves start to show the warp.
- Use it in Remotion as B-roll: copy the MP4 to `video/public/` and play it with `<OffthreadVideo>`; add a light leak or
  grain from `assets/overlays/` to sell it.
