#!/bin/sh
SCRIPT_DIR=$(dirname "$0")

# sort by time
# reverse
# directories themselves (to retain path)
DUMP=$(ls -trd $SCRIPT_DIR/dumps/* | tail -1)

cp -va $DUMP $SCRIPT_DIR/../fixtures/dump/
