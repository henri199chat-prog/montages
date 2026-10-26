#!/bin/bash
# Voice chain after demucs(vocals) + DeepFilterNet3 (atten_lim 24 dB)
set -e
cd "$(dirname "$0")/.."
ffmpeg -v error -y -i audio/voc_dfn.wav -af "\
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
afftdn=nr=6:nf=-55:tn=1" -c:a pcm_f32le audio/voc_eq.wav
