#! /usr/bin/env sh

echo "updating modules"
git submodule init
git submodule update

echo "building blog to docs/"
hugo -d docs --minify