PSYDB_URL=${PSYDB_URL:-'http://127.0.0.1:8080/'}

#NODE_TLS_REJECT_UNAUTHORIZED='0' \
DEBUG="*psydb:driver*" node src/run.js \
    --url "$PSYDB_URL" \
    --mongodb 'mongodb://127.0.0.1:47017/psydb' \
    --restore-fixture 'init-minimal-with-api-key' \
    $@ \
    src/scripts/cats/01_init-helper-sets-and-crts \
    src/scripts/cats/02_init-roles-and-research-groups \
    src/scripts/cats/03_init-personnel \
    src/scripts/cats/04_init-orgs-and-locations \
    src/scripts/cats/05_init-subjects

#DEBUG="*psydb:driver*" node src/run.js \
#    --url "$PSYDB_URL" \
#    --mongodb 'mongodb://127.0.0.1:47017/psydb' \
#    --restore-fixture 'init-minimal-with-api-key' \
#    $@ \
#    src/scripts/cats-small/01_init-helper-sets-and-crts \
#    src/scripts/cats-small/02_init-roles-and-research-groups \
#    src/scripts/cats-small/03_init-personnel \
#    src/scripts/cats-small/04_init-orgs-and-locations \
#    src/scripts/cats-small/05_init-subjects

#DEBUG="*psydb:driver*" node src/run.js \
#    --url "$PSYDB_URL" \
#    --mongodb 'mongodb://127.0.0.1:47017/psydb' \
#    --restore-fixture 'init-minimal-with-api-key' \
#    $@ \
#    src/scripts/cats-huge/01_init-helper-sets-and-crts \
#    src/scripts/cats-huge/02_init-roles-and-research-groups \
#    src/scripts/cats-huge/03_init-personnel \
#    src/scripts/cats-huge/04_init-orgs-and-locations \
#    src/scripts/cats-huge/05_init-subjects


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
