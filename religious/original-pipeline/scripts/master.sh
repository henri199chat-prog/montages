#!/bin/bash
# master: voice gain -> oversampled limiter -> + drone (-35 dBFS) -> final -14 LUFS / TP <= -1
set -e; cd "$(dirname "$0")/.."
meas(){ ffmpeg -hide_banner -nostats -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Integrated/{f=1} f&&/ I:/{i=$2} /True peak/{p=1} p&&/Peak:/{tp=$2} END{print i, tp}'; }
G=${G:-0}
for it in 1 2 3; do
ffmpeg -v error -y -i audio/voice_fx.wav -i audio/drone.wav -filter_complex "[0]volume=${G}dB,aresample=192000,alimiter=limit=0.80:attack=3:release=60:level=disabled,aresample=48000[v];[v][1]amix=inputs=2:normalize=0:duration=first,aresample=192000,alimiter=limit=0.86:attack=2:release=50:level=disabled,aresample=48000" -c:a pcm_s24le audio/clean.wav
read I TP < <(meas audio/clean.wav); echo "iter $it G=$G  I=$I TP=$TP"
G=$(python3 -c "print(round($G+(-14.0-($I)),2))")
python3 -c "import sys; sys.exit(0 if abs(-14.0-($I))<0.1 else 1)" && break
done
