# montages — content workspace for @aymen.ai.lab

Instagram account about using Claude practically (Skills, commands, workflows) for Arab
creators, students and employees, beginner to intermediate. Full brand brief: `brand/brand.md`.

## Working with the owner

- Reply in Arabic, simple and direct. Content they send in English is analysed as is, and the reply is still in Arabic.
- Ask before any payment or paid generation beyond small SFX/voice takes.
- Never post, comment or DM on Instagram without explicit approval of the exact content.

## Brand

- Palette: lavender `#c9b8ef` / `#ece5fb`, sky `#bfe3f7` / `#e3f3fc`, peach `#ffd3bf`, accent `#e8775a`, ink `#2b2540`.
- Fonts: Tajawal 500/800 (text), Aref Ruqaa 700 (emotional words), JetBrains Mono (code). Font files are in each reel's `assets/fonts/`.
- Do not use Anthropic's Clawd mascot.

## Montage playbook

Read `docs/montage-playbook.md` before any editing work: the three proven formats
(`reels/reel02` voiced explainer, `reels/reel03` 120 BPM showreel, `reels/reel04` bold Arabic ad),
the motion rules behind the professional result, the QA steps, and the pitfalls already solved.
Start new reels by copying the closest format rather than from scratch.

## Reel pipeline (HyperFrames)

Each reel in `reels/<name>/` is a HyperFrames project generated from `template.tpl` by `build.py`:

1. Voiceover: ElevenLabs, voice **Tamer** `mX8opBj7bbi4G2cE9j2w`, model `eleven_v4`, one take per call (the account rate-limits concurrent requests, so a 429 started nothing and one retry is fine).
2. Word timings: ElevenLabs `eleven_scribe_v1` transcript saved as `w.json` (`[text, start, end]`); when transcription is unavailable, time words from pauses (`ffmpeg silencedetect`).
3. `python3 build.py` writes `index.html` (captions word by word, keyword pill in accent colour).
4. `npx -y hyperframes lint` then `npx -y hyperframes render --output out.mp4` (about 4 min per 75 s).
5. Normalise the final mix to about -14 LUFS: `ffmpeg -i out.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac final.mp4`.
6. Review a contact sheet of frames (`ffmpeg ... tile=`) before sending; the owner judges sound by ear.

Conventions that worked in reel02: scenes wrapped in `.stage > .zoom` (slow 4.5% push-in), one shared transition
(outgoing up + blur, incoming from below, peach light streak, whoosh peaking on the cut), match cuts between scenes,
no music bed, and a final frame that cuts back to the opening shot so the reel loops.

## Skills

- `.claude/skills/ig-*`: Instagram skills (MIT, Jake Schincariol). English-centric scoring; treat scores on Arabic text as rough.
- HyperFrames skills: `heygen-com/hyperframes` (`skills/hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`).
- Remotion skills: `remotion-dev/skills` (`remotion-best-practices`, `remotion-captions`, `remotion-render`, `remotion-create`, `remotion-multimedia`).
  These two are not vendored; install them into `~/.claude/skills` at the start of a session if missing.
