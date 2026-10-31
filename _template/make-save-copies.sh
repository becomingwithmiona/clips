#!/bin/sh
# Usage: sh _template/make-save-copies.sh FOLDER   (makes FOLDER/save/*-save.mp4, about 4 to 8 MB each)
cd "$1" && mkdir -p save && ls *-vertical.mp4 | xargs -P4 -I{} sh -c 'ffmpeg -loglevel error -y -i {} -vf scale=1080:1920 -c:v libx264 -preset slow -crf 25 -maxrate 700k -bufsize 1400k -pix_fmt yuv420p -c:a copy -movflags +faststart save/$(basename {} .mp4)-save.mp4'
