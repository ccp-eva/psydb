#!/bin/sh

TAG=$(\
    docker images --format "{{.Tag}} '{{.CreatedAt}}'" cdxoo/psydb \
    | grep -v latest | awk '{{print $1}}' | head -1
);

echo "saving $TAG";
docker save cdxoo/psydb:$TAG | gzip > psydb_$TAG.tar.gz
