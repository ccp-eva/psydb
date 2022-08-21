#!/bin/sh
SCRIPT_DIR=$(dirname "$0")
mongodump -d psydb -o $SCRIPT_DIR/$(date +%Y-%m-%d__%H%M)
