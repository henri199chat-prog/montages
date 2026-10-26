---
name: launch-motion-style
description: The creator's chosen reference style (learned 2026-10-26 from three viral "made with Claude Opus 5.5" motion films - a Spotify spot, a "Claude motion designer" reel on a laptop, a Duolingo spot on a monitor). Use for ANY new motion-graphics reel or when the user says the edit feels like slides / not like the examples - one continuous take where every beat grows out of the last, black + one neon accent with glow, a light trail that draws the next element, big kinetic words, counters and data, no slideshow cards. Pairs with the onetake skill (its protocol and move library) and Remotion.
---

# Launch-motion style (the creator's references)

Measured with `onetake/scripts/analyze_ref.py` on all three references (silent 720x1280 clips, 10-20 s):

| | Spotify spot | Claude laptop reel | Duolingo monitor |
|---|---|---|---|
| hard cuts | 0 (one burst of 5 micro-cuts at 4.3 s) | ~10 in 3 bursts | **0** |
| dead-still time | 7.5 % | 8 % | 4 % |
| longest quiet | 0.42 s | 1.4 s | 2.25 s |
| median t80 (how fast a move lands) | 0.69 s | 0.81 s | 0.82 s |
| curves | 100 % soft S-curves | 91 % soft | 94 % soft |
| motion blur | sharp | sharp | **shutter blur** |

## The rules this style lives by
1. **One take. Nothing is replaced, everything transforms.** The logo shrinks into a phone screen; a light line
   draws and *becomes* the next card; a flame lands on a counter; a waveform grows out of the mascot card. A beat
   ends by handing an element to the next beat (position, shape or colour carries over). Hard cuts only as a
   deliberate staccato burst (5 cuts in under a second), never as scene changes.
2. **Black (or near-black) + ONE neon accent**, with glow/bloom and a soft radial light behind the subject. Brand
   colour = the accent (Spotify green, Duolingo green, Claude orange). Everything else white/grey.
3. **The light trail** is the connective tissue: a glowing line/streak travels, draws an outline, swirls, and lands
   as the next element. Use it at least twice per film.
4. **Few words, huge.** Full-screen kinetic words ("EVERY", "SINGLE", "moment"), one word highlighted in the accent
   while the sentence is grey; text slides in by word with blur, never a paragraph on a card.
5. **Numbers move**: flip/roll counters (3·2·1, 365 DÍAS, +312 %), rings filling, bars growing - landing with a snap.
6. **Motion feel**: soft S-curves, moves land in ~0.7-0.8 s, something always moving (<10 % still), short quiet
   holds (≤1.5 s) only after a big landing.
7. **Depth**: particles, a 3D wave grid, a device mockup (phone, laptop on a reflective desk, monitor in a dim room)
   as the presentation frame; the camera drifts/leans, never fully static.
8. **Ending**: everything collapses into one line or dot, which resolves into the wordmark/logo.

## Applying it to a narrated Arabic reel (our case)
- Keep the voice and word-synced captions, but captions become *kinetic words* (2-4 words, one in the accent) placed
  in the composition, not a subtitle pill on top of slides.
- Each spoken idea = one transformation of the same element (e.g. a water drop → light trail → kidney outline →
  filter particles → stones → gauge → shield → glass).
- Build in Remotion (our pipeline) using onetake's ideas: carries, camera that chases the subject, springs with
  t80 ≈ 0.75 s, motion blur on fast moves (Remotion `<CameraMotionBlur>` / frame-sample blending).
- Accent per topic: health/water = aqua `#3fd0ff`; the creator's religious brand = gold `#d4af6a`.
