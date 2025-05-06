#!/bin/bash

SCRIPT_DIR=$(realpath $(dirname "$0"))
README="$SCRIPT_DIR/../README.md"

echo "" > $README

for file in $(find $SCRIPT_DIR -type f -iname '*.md' | sort -n); do
    cat $file >> $README
done
