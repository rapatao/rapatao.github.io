#! /usr/bin/env sh

echo "Converting from $1 to $2";

if [[ ! -z $1 && ! -z $2 ]]; then

    find ./static/images/posts -name "*.${1}" | sed "s/[.]${1}//g" | while read f; do
        if [[ $1 != $2 ]]; then
            echo "Converting ${f}.${1} to ${f}.${2}"
            magick "${f}.${1}" "${f}.${2}";
        else
            echo "Ignoring ${f}.${1}"
        fi;
    done;

fi;