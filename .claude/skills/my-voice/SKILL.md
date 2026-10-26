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

## Generate (line by line, checked, retaken until clean)
```bash
scripts/my-voice lines private/<job>/lines private/<job>/lines.txt 7   # NN.wav per line, resumable
scripts/my-voice check private/<job>/lines private/<job>/lines.txt     # Whisper: word match, stutter, long pauses
scripts/my-voice retake private/<job>/lines 5 "النص" 31                # redo line 5 with another seed (or fixed spelling)
scripts/my-voice join private/<job>/lines video/public/<job>/vo.wav    # 0.45 s pauses + studio chain, -16 LUFS
```
**Quality bar (the creator asked for it explicitly): no wrong word, no stutter.** Run `check` after every batch; a line passes
only with ≥95 % word match (normalised: no diacritics, alef/ya/ta-marbuta folded), no repeated word, no pause > 0.7 s
and 1.4-3.6 words/s. Retake failing lines with new seeds (up to 4), then try a spelling/tashkeel fix on the misheard
word. Whisper's MSA spelling of a correct word (هذه/هذي, digits) is not an error — judge those by reading the diff.
Get word timings for captions from Whisper on the joined file.

## Tips
- Same language as the reference (MSA reference → MSA lines) for natural pronunciation; numbers as words.
- Short sentences (≤ 20 words) per line sound most natural; split long lines at commas.
- If a word is mispronounced, rewrite it (spelling, tashkeel on that word only) and regenerate that line only.
