#! /usr/bin/env sh

echo "building blog to docs/"
hugo --gc -d docs --minify
