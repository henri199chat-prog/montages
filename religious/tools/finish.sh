#!/usr/bin/env bash
# finish.sh <in.mp4> [out.mp4] — final master for social (video-finishing-sound rules):
# keeps the encode (Remotion already wrote H.264 yuv420p), adds +faststart and BT.709 colour tags,
# then prints loudness (-14..-16 LUFS, TP <= -1 dBTP) and the stream summary. Audio and video are copied, not re-encoded.
set -euo pipefail
IN="$1"; OUT="${2:-${IN%.mp4}.final.mp4}"
ffmpeg -v error -y -i "$IN" -map 0 -c copy -movflags +faststart \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 "$OUT"
ffprobe -v error -show_entries stream=codec_name,width,height,pix_fmt,color_space,sample_rate,bit_rate:format=duration -of compact "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
echo "-> $OUT"
