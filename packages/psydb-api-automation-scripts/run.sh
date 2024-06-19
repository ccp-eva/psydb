DEBUG="*psydb:driver*" node src/run.js \
    --mongodb 'mongodb://127.0.0.1:47017/psydb' \
    $@ \
    src/scripts/humankind-structure-patch-01

#DEBUG="*psydb:driver*" node src/run.js \
#    --mongodb 'mongodb://127.0.0.1:47017/psydb' \
#    --restore-fixture 'init-minimal-with-api-key' \
#    $@ \
#    src/scripts/init-humankind-structure \
#    src/scripts/init-humankind-core-data
