#!/bin/sh
SCRIPT_DIR=$(dirname "$0")
DUMP=$1

echo Want to restore $1 to localhost:47017?
printf ">>> Press enter to continue"
read _

# use latest dump if arg is ommited
if [ -z $DUMP ]; then
    # sort by time
    # reverse
    # directories themselves (to retain path)
    DUMP=$(ls -trd $SCRIPT_DIR/mongodb-dumps/* | tail -1)
fi

echo $DUMP
DID_DROP=0
if [ -z "$(which mongo)" ]; then
    mongosh --host localhost:47017 \
        --eval "db.getSiblingDB('psydb').dropDatabase()" \
        && DID_DROP=1
else
    mongo --host localhost:47017 psydb \
        --eval "printjson(db.dropDatabase())" \
        && DID_DROP=1
fi

if [ "$DID_DROP" -eq 0 ]; then
    echo "could not drop db, exiting"
    exit 1;
else
    mongorestore --gzip --host localhost:47017 --drop -d psydb $DUMP/psydb/
fi
