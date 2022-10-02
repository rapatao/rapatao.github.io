#! /usr/bin/env sh

curl -o static/js/reaktions.js https://reaktions.rapatao.com/reaktions.js

echo "building blog to docs/"
hugo --gc -d docs --minify --cleanDestinationDir

echo
echo "resizing images"
find docs/images -type f -name "*" -exec convert -verbose -strip {} {} \;
