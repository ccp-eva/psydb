#!/bin/bash
# git clone git@github.com:ccp-eva/psydb.git psydb-src

SCRIPT_DIR=$(realpath $(dirname "$0"))
TARGET=$1

if [ -z "$TARGET" ]; then
    echo "provide target folder"
fi

### mongodb
### https://www.mongodb.com/docs/v6.0/tutorial/install-mongodb-on-ubuntu/
sudo apt install -y gnupg curl

curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" \
    | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

sudo apt update
sudo apt install -y mongodb-org

sudo sed -i -e 's/27017/47017/g' /etc/mongod.conf

sudo systemctl enable --now mongod


### nodejs
### https://github.com/nodesource/distributions#installation-instructions
sudo apt install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
    | sudo gpg -o /etc/apt/keyrings/nodesource.gpg  --dearmor

NODE_MAJOR=18
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" \
    | sudo tee /etc/apt/sources.list.d/nodesource.list

sudo apt update
sudo apt install -y nodejs


### nginx
### https://nginx.org/en/linux_packages.html#Ubuntu
sudo apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring
curl -fsSL https://nginx.org/keys/nginx_signing.key \
    | sudo gpg -o /usr/share/keyrings/nginx-archive-keyring.gpg --dearmor

echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/mainline/ubuntu $(lsb_release -cs) nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list

sudo cat > /etc/apt/preferences.d/99nginx <<EOF
Package: *
Pin: origin nginx.org
Pin: release o=nginx
Pin-Priority: 900
EOF

sudo apt update
sudo apt install -y nginx

# FIXME: there is an issue when not waiting here a little
sleep 2

sudo cp -v $SCRIPT_DIR/../common/dist-configs/nginx/default.nossl-conf \
    /etc/nginx/conf.d/default.conf

sudo sed -i -e 's/psydb:8080/127.0.0.1:8080/g' /etc/nginx/conf.d/default.conf

### psydb
###
sudo groupadd psydb
sudo mkdir -p $TARGET
sudo useradd -M -d $TARGET -s /sbin/nologin psydb -g psydb

cd $TARGET
sudo cp -a $SCRIPT_DIR/../../ ./psydb-src

sudo cp -v ./psydb-src/deploy/systemd/psydb.service /usr/lib/systemd/system/

cd ./psydb-src
#npm install -g @microsoft/rush
#rush update
node ./common/scripts/install-run-rush.js update

cd ./packages/psydb-ui
npm run build

cd $TARGET

sudo systemctl enable psydb
sudo systemctl enable nginx

sudo cp -av ./psydb-src/deploy/common/mongodb-initializer-dumps/ \
    ./mongodb-dumps
sudo cp -av ./psydb-src/deploy/common/helpers/make-dump.sh ./
sudo cp -av ./psydb-src/deploy/common/helpers/restore-dump.sh ./

cp -av ./psydb-src/deploy/common/dist-configs/psydb/config.js \
    ./psydb-src/config/

sed -i -e 's/mongodb:27017/127.0.0.1:47017/g' ./psydb-src/config/config.js

