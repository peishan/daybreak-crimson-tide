#!/usr/bin/env bash
# Trim and compress one cinematic clip for mobile.
#   tools/process-cinematic.sh input.mp4 output.mp4 [seconds-to-keep]
# Output: H.264 (Main) + AAC, at most 960 px wide, faststart, no end card if you give the length to keep.
set -euo pipefail
in="$1"; out="$2"; keep="${3:-}"
trim=()
[ -n "$keep" ] && trim=(-t "$keep")
ffmpeg -v error -y -i "$in" "${trim[@]}" \
  -vf "scale='min(960,iw)':-2" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 27 -preset slow -movflags +faststart \
  -c:a aac -b:a 96k -ac 2 "$out"
ls -la "$out"
