#! /usr/bin/env sh

echo "building blog to docs/"
hugo --gc -d docs --minify

echo
echo "resizing images"
find static/images -type f -name "*.jpg" -exec convert -strip {} {} \;