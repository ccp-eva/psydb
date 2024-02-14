#!/bin/sh
SCRIPT_DIR=$(dirname "$0")
SUFFIX=$1

OUTPUT=$SCRIPT_DIR/bson/$(date +%Y-%m-%d__%H%M)
if [ ! -z $SUFFIX ]; then
    OUTPUT=$OUTPUT"_"$SUFFIX
fi

mongodump --host localhost:47017 -d psydb -o $OUTPUT
