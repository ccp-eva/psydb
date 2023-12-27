SCRIPT_DIR=$(dirname "$0")
NPM=$(whereis npm)

cd $SCRIPT_DIR/psydb-src/packages/psydb-api/
$NPM start
