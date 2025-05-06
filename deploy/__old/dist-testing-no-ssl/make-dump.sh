#!/bin/sh
SCRIPT_DIR=$(dirname "$0")
mongodump --gzip --host localhost:47017 -d psydb -o \
    $SCRIPT_DIR/mongodb-dumps/$(date +%Y-%m-%d__%H%M)
