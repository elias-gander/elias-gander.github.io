---
title:  "TODO"
---

TODO

bilder komprimieren:
mogrify -define jpeg:extent=100kb -resize 1024x1024 *.jpg

video komprimieren:
sudo sh compress.sh folder/file.MOV 1

video drehen und auf mp4 konvertieren:
ffmpeg -i folder/file.MOV  -vf "transpose=2" file.mp4

