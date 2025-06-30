#NODE_TLS_REJECT_UNAUTHORIZED='0' \
DEBUG="*psydb:driver*" node src/run.js \
    --mongodb 'mongodb://127.0.0.1:47017/psydb' \
    --restore-fixture '2025-06-30__0347' \
    $@ \
    src/scripts/migrate-duplicates/01_init-dummy-records \
    src/scripts/migrate-duplicates/02_do-migration

#NODE_TLS_REJECT_UNAUTHORIZED='0' \
#DEBUG="*psydb:driver*" node src/run.js \
#    --url 'https://127.0.0.1:50443/api/' \
#    --mongodb 'mongodb://127.0.0.1:57017/psydb' \
#    $@ \
#    src/scripts/wkprc-create-unknown-dummy-apes

#DEBUG="*psydb:driver*" node src/run.js \
#    --mongodb 'mongodb://127.0.0.1:47017/psydb' \
#    --restore-fixture 'init-minimal-with-api-key' \
#    $@ \
#    src/scripts/init-childlab-structure \
#    src/scripts/init-childlab-core-data
