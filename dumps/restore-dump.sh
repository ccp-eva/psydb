#!/bin/sh
SCRIPT_DIR=$(dirname "$0")
DUMP=$1

# use latest dump if arg is ommited
if [ -z $DUMP ]; then
    # sort by time
    # reverse
    # directories themselves (to retain path)
    DUMP=$(ls -trd $SCRIPT_DIR/* | tail -1)
fi

echo $DUMP
mongo --host localhost:47017 psydb --eval "printjson(db.dropDatabase())"
mongorestore --host localhost:47017 --drop -d psydb $DUMP/psydb/
