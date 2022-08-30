#!/bin/sh
SCRIPT_DIR=$(dirname "$0")
BASE_DIR=$SCRIPT_DIR/../

VERSION=$(node -pe "require('$BASE_DIR/packages/psydb-web/package.json').version");
DATE=$(date +%Y%m%d%H%M)

echo $VERSION;
TAG="cdxoo/psydb:$VESRION.$DATE"

rush update
rush build --only psydb-ui

rush unlink \
    && rm -rf $SCRIPT_DIR/../common/temp/

docker build -f $SCRIPT_DIR/Dockerfile -t cdxoo/psydb:latest $BASE_DIR \
    && docker tag cdxoo/psydb $TAG \
    && rush update
