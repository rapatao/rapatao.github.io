#! /usr/bin/env sh

curl -s -o static/js/reaktions.js https://reaktions.rapatao.com/reaktions.js

echo "building blog to docs/"
docker run --rm -v .:/src hugomods/hugo:exts-0.120.4 hugo --gc -d docs --minify --cleanDestinationDir

echo
echo "resizing images"
find docs/images -type f -name "*" -exec convert -verbose -strip {} {} \;
