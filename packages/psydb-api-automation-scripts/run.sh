DEBUG="*psydb:driver*" node src/run.js \
    --mongodb 'mongodb://127.0.0.1:47017/psydb' \
    $@ \
    src/scripts/wkprc-structure \
    src/scripts/wkprc-dummy-data
