#!/bin/bash
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd) # works on macos w/o realpath
source $SCRIPT_DIR/setup-env.sh $SCRIPT_DIR $1

print_tag "MAIN" $TAG
wait_confirm

cd $REPO_DIR

ensure_node_image_exists
prebuild_ui
purge_workspace

maybe_build_rush_node_alpine
build_buildbase_image
build_main_image $TAG

remove_buildbase_image
restore_workspace

echo "main build finished --- $TAG"
