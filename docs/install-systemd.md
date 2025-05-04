# Installation

* there are 2 variants to get psydb set up
    * via docker via docker-compose (recommended)
    * via manual systemd installation

* mongodb is used as database
* psydb itself does not handle ssl encryption instead it relies on an https
  reverse proxy such as nginx
* for sending e-mails (such as for newly created accounts)
  a smtp server needs to be provided

* relevant helpers and tools are located in the "deploy/" folder
* the docker folder contains files related to the installation via docker
* the systemd folder contains files related to the installation via systemd
* the common folder contains files that are related to both variants
    * dist configs
    * initializer dumps
    * general helpers


## System-D

### Requirements

| Platform          | Options                               |
| ----------------- | ------------------------------------- |
| Operating System  | * Ubuntu 22.04 LTS (recommended)      |
| ----------------- | ------------------------------------- |
| Runtime           | * NodeJS 18.x LTS (recommended)       |
| ----------------- | ------------------------------------- |
| Database          | * MongoDB 6.x, 5.x, 4.x               | 
| ----------------- | ------------------------------------- |
| Reverse Proxy     | * Nginx 1.25.x (recommended)          | 
| ----------------- | ------------------------------------- |

### Setup

clone this git repository
```
    git clone git@github.com:ccp-eva/psydb.git psydb-repo
```

for ubuntu an install script is located in psydb-src/deploy/systemd
on execution it will setup the deployment in /src/psydb-deployment

the script contains the following steps
    * installs mongodb and configures the default port to "47017"
    * installs nodejs
    * installs nginx and copies the nossl config from the dist folder to /etc
    * creates /src/psydb-deployment folder and copies the repo there
    * creates psydb group and user
    * copies the psydb.service file to /sur/lib/systemd/system
    * performs node package installation and ui build
    * enables psydb and nginx services in systemd and starts them
    * copies initializer dumps as well as make-dump/restore-dump scripts
      to psydb-deployment for convenience

execute the script via
```
sudo ./psydb-repo/deploy/systemd/install-ubuntu.sh
```

for further information regarding the configuration of
nginx (e.g. for ssl) or mongodb please refer to the official documentation

restore an initializer dump
```
cd /srv/psydb-deployment
./restore-dump.sh ./mongodb-dumps/init-minimal
```

this will do the most minimal initialization with only an admin account
if you want to create a testing instance that has some data in it
use 'init-childlab-with-dummy-data' instead

copy psydb dist config to target
```
    cp -v ./psydb-src/deploy/common/dist-configs/psydb/config.js \
        ./psydb-src/config.js
    sed -i 's/mongodb:27017/127.0.0.1:47017/g' ./psydb-src/config.js
```

#### TL;DR

```
    cd ~/
    git clone git@github.com:ccp-eva/psydb.git ./psydb-repo
    sudo ./psydb-repo/deploy/systemd/install-ubuntu.sh /srv/psydb-deployment
    
    cd /srv/psydb-deployment
    ./restore-dump.sh ./mongodb-dumps/init-minimal
    
    cp -v ./psydb-src/deploy/common/dist-configs/psydb/config.js \
        ./psydb-src/config.js
    sed -i 's/mongodb:27017/127.0.0.1:47017/g' ./psydb-src/config.js

    $EDITOR ./psydb-src/config.js
```

## Docker

create initial folders
```
    mkdir psydb-deployment && cd psydb-deployment
    mkdir -p ./psydb-data ./psydb-config/nginx ./psydb-config/psydb
    mkdir -p ./psydb-ssl # optional
```

download docker compose dist config and modify it as needed
```
    curl -L -O github.com/cdxOo/psydb/raw/master/deploy/docker-compose.dist.yaml
    mv -v docker-compose{.dist,}.yaml

    $EDITOR docker-compose.yaml
```

by default the dist config uses mailhog as smtp mail sink for testing
purposes you probably want to remove that
