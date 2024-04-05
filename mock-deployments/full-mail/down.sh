#!/bin/sh
SCRIPT_DIR=$(dirname "$0")
docker-compose -p psydb-full-mail-deployment -f $SCRIPT_DIR/docker-compose.yaml down
