#!/usr/bin/env bash
# clean_voice.sh <input video/audio> <out_dir>
# Ayman sends a raw video: take ONLY its audio and make it sound like a calm, clear, professional microphone
# (no chatter, no noise, no music). Chain from the 002 reel:
#   1) demucs vocal separation  (if installed: python -m demucs)        -> removes music/background/chatter
#   2) DeepFilterNet3, atten_lim 24 dB (if installed: deepFilter)        -> denoise without killing the voice
#   3) ffmpeg EQ + de-ess + gentle compression + light afftdn (always)   -> "studio mic" tone
# Steps 1–2 are skipped with a warning when the tools are missing (cloud container is offline);
# then a stronger ffmpeg-only denoise is used. Listen-check is impossible for you: verify with
# scripts/analyze-audio (noise floor in pauses < -60 dBFS, no clipping) and say so honestly in the report.
set -euo pipefail
IN="$1"; OUT="${2:-religious_work}"; mkdir -p "$OUT"
ffmpeg -v error -y -i "$IN" -vn -ac 2 -ar 44100 -c:a pcm_s16le "$OUT/raw.wav"
SRC="$OUT/raw.wav"
if python3 -c "import demucs" 2>/dev/null; then
  python3 -m demucs --two-stems=vocals -n htdemucs -o "$OUT/demucs" "$SRC"
  SRC=$(ls "$OUT"/demucs/htdemucs/*/vocals.wav | head -1)
else echo "WARN: demucs not installed -> no vocal separation (music/chatter stay if present)" >&2; fi
ffmpeg -v error -y -i "$SRC" -ac 1 -ar 48000 -c:a pcm_f32le "$OUT/voc48_mono.wav"
DFN=0
if command -v deepFilter >/dev/null 2>&1; then
  deepFilter --atten-lim 24 -o "$OUT/dfn" "$OUT/voc48_mono.wav" && cp "$OUT"/dfn/*.wav "$OUT/voc_dfn.wav" && DFN=1
fi
if [ "$DFN" = 0 ]; then
  echo "WARN: DeepFilterNet not available -> ffmpeg-only denoise (afftdn + anlmdn)" >&2
  ffmpeg -v error -y -i "$OUT/voc48_mono.wav" -af "afftdn=nr=14:nf=-50:tn=1,anlmdn=s=4:p=0.002:r=0.006" -c:a pcm_f32le "$OUT/voc_dfn.wav"
fi
# 002 voice chain (voice_chain.sh)
ffmpeg -v error -y -i "$OUT/voc_dfn.wav" -af "\
highpass=f=70:poles=2,highpass=f=55:poles=2,\
equalizer=f=170:t=q:w=1.0:g=-1.5,\
equalizer=f=330:t=q:w=1.1:g=-3.5,\
equalizer=f=650:t=q:w=1.4:g=-1.0,\
equalizer=f=1300:t=q:w=1.2:g=2.0,\
equalizer=f=2900:t=q:w=1.0:g=4.0,\
equalizer=f=4800:t=q:w=1.2:g=2.0,\
treble=g=1.0:f=8000:t=s,\
deesser=i=0.35:m=0.5:f=0.45:s=o,\
acompressor=threshold=-24dB:ratio=2.2:attack=12:release=160:knee=6:makeup=1.5,\
afftdn=nr=6:nf=-55:tn=1" -c:a pcm_f32le "$OUT/voice_clean.wav"
echo "-> $OUT/voice_clean.wav"
