#!/bin/bash
SCRIPT_DIR=$(realpath $(dirname "$0"))

cd $SCRIPT_DIR/../../ # in psydb-src now
git pull

node ./common/scripts/install-run-rush.js update

cd ./packages/psydb-ui
npm run build

sudo systemctl restart psydb
