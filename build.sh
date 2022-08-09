#! /usr/bin/env sh

echo "building blog to docs/"
hugo --gc -d docs --minify

echo
echo "resizing images"
find docs/images -type f -name "*" -exec convert -verbose -strip {} {} \;