#!/bin/sh
SCRIPT_DIR=$(dirname "$0")
BASE_DIR=$SCRIPT_DIR/../

SUFFIX=$1

VERSION=$(git describe --tags --abbrev=0)
#VERSION=$(node -pe "require('$BASE_DIR/packages/psydb-web/package.json').version");
DATE=$(date +%Y%m%d%H%M)

echo $VERSION;
TAG="cdxoo/psydb:$VERSION.$DATE"
if [ ! -z $SUFFIX ]; then
    TAG=$TAG"_"$SUFFIX
fi
echo $TAG;

printf ">>> Press enter to continue"
read _

rush update
rush build --only @mpieva/psydb-ui

# NOTE: Unlinking is not supported when using workspaces. Run "rush purge" to remove project node_modules folders.
rush purge \
    && rm -rf $BASE_DIR/common/temp/

docker build -f $SCRIPT_DIR/Dockerfile -t cdxoo/psydb:latest $BASE_DIR \
    && docker tag cdxoo/psydb $TAG \
    && rush update --purge \
    && docker image prune --filter label=stage=psydb-prebuild
