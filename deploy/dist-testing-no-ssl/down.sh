#!/bin/sh
SCRIPT_DIR=$(dirname "$0")
docker-compose -p psydb-deployment -f $SCRIPT_DIR/docker-compose.yaml down
