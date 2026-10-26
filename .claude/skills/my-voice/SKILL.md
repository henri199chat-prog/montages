---
name: my-voice
description: Use whenever a video needs a voiceover in the creator's own voice (Aymen) - a new script, a fixed word, a missing line, a dub - instead of a robotic TTS voice or asking him to record again. Clones his voice locally with OmniVoice from a 5 s reference clip that is kept OUT of GitHub, generates line by line, checks every line with Whisper and applies the same studio processing as his own recordings.
---

# my-voice: say anything in the creator's own voice

Approved by the creator on 2026-10-26 after a blind test (two new sentences, Whisper word-perfect). Engine: OmniVoice
(k2-fsa, Apache-2.0), CPU, about 2 minutes per 10 s of speech.

## ⛔ Privacy rule (the creator's explicit instruction)
- His voice is **never committed to GitHub** — the repo is public. Not the reference clip, not `voice.pt`, not raw takes,
  not voice-only tracks or tests. They live in `~/.my-voice/` (outside the repo) and in `.gitignore`.
- Finished videos that he will publish anyway may be committed (`videos/*.mp4`).
- Only his voice, with his consent. Never clone anyone else's voice from a video he sends.

## Each new session (the container is wiped)
`~/.my-voice` is empty in a new session. Ask him to send his reference clip (`my-voice-reference.mp3`, sent to him in
chat on 2026-10-26 — he keeps it on his phone), then:
```bash
scripts/my-voice setup /path/to/my-voice-reference.mp3 "اجعل لسانك رطبًا بذكر الله، في كل وقتٍ وكل مكان."
```
(For a different clip: 3-10 s, clean, one sentence, and pass its exact words.)

## Generate
```bash
scripts/my-voice say out.wav "السطر الأول." "السطر الثاني." ...     # one take per line, 0.45 s pauses, -16 LUFS
```
Then: Whisper-check each line (`scratchpad tts/hear.py` style: faster-whisper large-v3, language ar) and regenerate any
line whose words differ; get word timings from Whisper for captions (see the Tasbih reel v2 pipeline in
`audio/README.md`); put the file in an ignored path (e.g. `video/public/vo/`, `private/`).

## Tips
- Same language as the reference (MSA reference → MSA lines) for natural pronunciation; numbers as words.
- Short sentences (≤ 20 words) per line sound most natural; split long lines at commas.
- If a word is mispronounced, rewrite it (spelling, tashkeel on that word only) and regenerate that line only.
