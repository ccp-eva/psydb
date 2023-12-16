groupadd psydb
useradd -m -d /srv/psydb-deployment -s /sbin/nologin psydb -g psydb

cd /srv/psydb-deployment
git clone --depth 1 git@github.com:cdxOo/psydb.git ./psydb-src

cp ./psydb-src/deploy/systemd/psydb-api.sh ./
cp ./psydb-src/deploy/systemd/psydb-ui.sh ./

cp ./psydb-src/deploy/systemd/psydb-api.service /usr/lib/systemd/system/
cp ./psydb-src/deploy/systemd/psydb-ui.service /usr/lib/systemd/system/

