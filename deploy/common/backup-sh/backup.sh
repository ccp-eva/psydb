#!/bin/sh
SCRIPT_DIR=$(dirname "$0")

if [ -z $MONGO_HOST ]; then
    MONGODB_HOST="localhost:47017"
fi

BAK_DIR=$SCRIPT_DIR/mongodb-dumps

CURRENT_YEAR=$(date +%Y)
CURRENT_MONTH=$(date +%m)
PREV_MONTH=$(printf "%02d" $(($CURRENT_MONTH - 1)))

for i in $(ls -r $BAK_DIR); do
    #echo $i
    if [[ "$i" =~ ^"${CURRENT_YEAR}-${CURRENT_MONTH}" ]]; then
        #echo "keep recent" $i
        true
    elif [[ "$i" =~ ^"${CURRENT_YEAR}-${PREV_MONTH}" ]]; then
        #echo "keep prev" $i
        true
    elif [[ "$i" =~ ^[[:digit:]]+-[[:digit:]]+-01 ]]; then
        #echo "keep old" $i
        true
    else
        #echo "rem" $i
        rm -rf $BAK_DIR/$i;
    fi
done

mongodump --gzip --host $MONGODB_HOST -d psydb -o \
    $SCRIPT_DIR/mongodb-dumps/$(date +%Y-%m-%d__%H%M)
