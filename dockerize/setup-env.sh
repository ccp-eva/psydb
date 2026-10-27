#!/bin/bash
set -eo pipefail # exit on any non-zero return code, also within pipes

SCRIPT_DIR=$1
REPO_DIR=$(cd "$SCRIPT_DIR/../" && pwd)

SUFFIX=$2

# NOTE: rush.json contains comments so we cant require() it
RUSH_VERSION=$(sed -n 's/^[[:space:]]*"rushVersion": "\([^"]*\)".*/\1/p' $REPO_DIR/rush.json)
NODE_VERSION="22.23.4"
ALPINE_VERSION="3.23"

VERSION=$(git describe --tags --abbrev=0)
#VERSION=$(node -pe "require('$REPO_DIR/packages/psydb-web/package.json').version");
DATE=$(date +%Y%m%d%H%M)
COMMIT_ID=$(git rev-parse --short=6 HEAD)

TAG="cdxoo/psydb:$VERSION.$COMMIT_ID"_"$DATE"
if [ ! -z $SUFFIX ]; then
    TAG=$TAG"_"$SUFFIX
fi

FULL_VERSION=${TAG#*:}
RUSH_IMAGE_VERSION="${RUSH_VERSION}-node${NODE_VERSION}-alpine${ALPINE_VERSION}"

echo "SCRIPT_DIR=${SCRIPT_DIR}"
echo "REPO_DIR=${REPO_DIR}"
echo
echo "RUSH_VERSION=${RUSH_VERSION}"
echo "NODE_VERSION=${NODE_VERSION}"
echo "ALPINE_VERSION=${ALPINE_VERSION}"
echo
echo "VERSION=${VERSION}"
echo "FULL_VERSION=${FULL_VERSION}"
echo

print_tag() {
    echo "$1 IMAGE TAG:"
    echo "    $2"
    echo
}

wait_confirm() {
    printf ">>> Press enter to continue"
    read _
}

ensure_node_image_exists() {
    local NODE_IMAGE="node:${NODE_VERSION}-alpine${ALPINE_VERSION}"
    echo "checking registry for ${NODE_IMAGE} ..."

    # NOTE: inspects the remote manifest w/o pulling the image
    if ! docker manifest inspect $NODE_IMAGE > /dev/null; then
        echo "ERROR: ${NODE_IMAGE} does not exist in docker registry"
        echo "       check NODE_VERSION/ALPINE_VERSION in setup-env.sh"
        exit 1
    fi
    echo "=> OK"
    echo
}

maybe_build_rush_node_alpine() {
    local HAS_IMAGE
    HAS_IMAGE=$(docker images -q "cdxoo/psydb-rush:${RUSH_IMAGE_VERSION}")
    if [ -z "$HAS_IMAGE" ]; then
        echo "could not find cdxoo/psydb-rush:${RUSH_IMAGE_VERSION}"
        echo "=> building rush-node-alpine ..."

        build_rush_node_alpine
    fi
}

build_rush_node_alpine() {
    docker build \
        --build-arg RUSH_VERSION=${RUSH_VERSION} \
        --build-arg NODE_VERSION=${NODE_VERSION} \
        --build-arg ALPINE_VERSION=${ALPINE_VERSION} \
        -t cdxoo/psydb-rush:${RUSH_IMAGE_VERSION} \
        -f $SCRIPT_DIR/Dockerfile.rush-node-alpine $REPO_DIR
}

build_buildbase_image() {
    echo "STARTING BUILD: cdxoo/psydb-buildbase:$FULL_VERSION"
    docker build \
        --build-arg RUSH_IMAGE_VERSION=${RUSH_IMAGE_VERSION} \
        -t cdxoo/psydb-buildbase:$FULL_VERSION \
        -f $SCRIPT_DIR/Dockerfile.buildbase $REPO_DIR
}

build_main_image() {
    local TAG=$1
    echo "STARTING BUILD: $TAG"
    docker build \
        --build-arg BUILDBASE_VERSION=${FULL_VERSION} \
        --build-arg NODE_VERSION=${NODE_VERSION} \
        --build-arg ALPINE_VERSION=${ALPINE_VERSION} \
        -t cdxoo/psydb:latest \
        -t $TAG \
        -f $SCRIPT_DIR/Dockerfile.main $REPO_DIR
}

remove_buildbase_image() {
    echo "REMOVING IMAGE: cdxoo/psydb-buildbase:$FULL_VERSION"
    docker rmi cdxoo/psydb-buildbase:$FULL_VERSION
}

prebuild_ui() {
    rush update
    # rush build warnings will trigger exit w/o env var
    RUSH_ALLOW_WARNINGS_IN_SUCCESSFUL_BUILD=1 rush build --only @mpieva/psydb-ui
}

# NOTE: Unlinking is not supported when using workspaces.
# Run "rush purge" to remove project node_modules folders.
purge_workspace() {
    rush purge
    rm -rf $REPO_DIR/common/temp/
}

restore_workspace() {
    rush update --purge
}
