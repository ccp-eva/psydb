#!/bin/bash
# git clone git@github.com:cdxOo/psydb.git psydb-src

SCRIPT_DIR=$(dirname "$0")

### mongodb
### https://www.mongodb.com/docs/v6.0/tutorial/install-mongodb-on-ubuntu/
apt install -y gnupg curl

curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" \
    | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

apt update
apt install -y mongodb-org

sed -i -e 's/27017/47017/g' /etc/mongod.conf

systemctl enable --now mongod


### nodejs
### https://github.com/nodesource/distributions#installation-instructions
apt install -y ca-certificates curl gnupg
mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | gpg -o /etc/apt/keyrings/nodesource.gpg  --dearmor

NODE_MAJOR=18
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" \
    | tee /etc/apt/sources.list.d/nodesource.list

apt update
apt install -y nodejs


### nginx
### https://nginx.org/en/linux_packages.html#Ubuntu
apt install curl gnupg2 ca-certificates lsb-release ubuntu-keyring
curl -fsSL https://nginx.org/keys/nginx_signing.key \
    | gpg -o /usr/share/keyrings/nginx-archive-keyring.gpg --dearmor

echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/mainline/ubuntu $(lsb_release -cs) nginx" \
    | tee /etc/apt/sources.list.d/nginx.list

echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | tee /etc/apt/preferences.d/99nginx

apt update
apt install -y nginx

cp -v $SCRIPT_DIR/../dist-configs/nginx/default.nossl-conf \
    /etc/nginx/conf.d/default.conf

sed -i -e 's/psydb:8080/127.0.0.1:8080/g'

### psydb
###
groupadd psydb
mkdir /srv/psydb-deployment
useradd -M -d /srv/psydb-deployment -s /sbin/nologin psydb -g psydb

cd /srv/psydb-deployment
cp -a $SCRIPT_DIR/../../ ./psydb-src

cp ./psydb-src/deploy/systemd/psydb.service /usr/lib/systemd/system/

