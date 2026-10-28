#!/bin/bash
# name src start end speed crop(x:y:w) [extra-filter-before-crop]
cut(){ n=$1; s=$2; a=$3; b=$4; sp=$5; x=$6; y=$7; w=$8; pre=$9
  h=$(python3 -c "print(round($w/1.081))")
  f="${pre:+$pre,}crop=$w:$h:$x:$y,scale=1000:926:flags=lanczos,setpts=(PTS-STARTPTS)/$sp,fps=30"
  ffmpeg -hide_banner -loglevel error -y -ss $a -to $b -i src/$s.mp4 -an -vf "$f" -c:v libx264 -crf 16 -pix_fmt yuv420p proj/assets/$n.mp4
  echo "$n $(ffprobe -v error -show_entries format=duration -of csv=p=0 proj/assets/$n.mp4)"; }
cut s1 pc 12.4 19.4 1 590 266 1010
cut s2 pc 23.3 25.8 1 535 90 1200
cut s3 pc 37.0 41.4 1 535 90 1200
cut s4 pc 41.6 44.8 1 535 90 1200
cut s5 pc 69.0 74.5 1 640 140 1000
cut s6 pc 105.5 110.5 1 640 140 1000
cut s7 pc 122.5 127.5 1 1150 90 770 "drawbox=x=1190:y=348:w=680:h=60:color=white:t=fill"
cut s8 pc 135.5 141.5 1 370 440 770
cut s9 pc 158.0 161.0 1 535 90 800 "drawbox=x=520:y=385:w=1400:h=815:color=white:t=fill"
cut s10a ph 7.0 16.0 3 150 320 900
cut s10b ph 16.0 21.0 1 150 320 900
