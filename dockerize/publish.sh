#!/bin/sh

TAG=$(\
    docker images --format "{{.Tag}} '{{.CreatedAt}}'" cdxoo/psydb \
    | grep -v latest | awk '{{print $1}}' | head -1
);

echo "publishing $TAG";
docker push cdxoo/psydb:$TAG
