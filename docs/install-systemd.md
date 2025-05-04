# Deployment Overview

There are two variants for setting up **PsyDB**:

1. **Docker (Recommended)**
   Uses `docker-compose` for containerized deployment.

2. **Manual SystemD Installation**
   Installs PsyDB directly onto the host system using `systemd` service files.

## Database

- **MongoDB** is used as the backend database.

## HTTPS and SSL

- PsyDB **does not handle SSL encryption** directly.
- It is designed to run **behind an HTTPS reverse proxy**, such as **Nginx**.

## Email Support

- To send emails (e.g. for new account registration), you must **provide an SMTP server**.

## Deployment Files Structure

The `deploy/` directory contains all relevant tools and helpers for setting up PsyDB.

- `docker/`: files related to **docker-based installation**
- `systemd/`: files related to **manual systemd installation**
- `common/`: files shared between both installation methods, including:
  - distribution configuration files
  - initializer data dumps
  - general helper scripts


# Installation

## SystemD-Based Deployment

### System Requirements

| Component         | Recommended Option                   |
| ----------------- | ------------------------------------ |
| Operating System  | Ubuntu 22.04 LTS                     |
| Runtime           | Node.js 18.x LTS                     |
| Database          | MongoDB 6.x / 5.x / 4.x              |
| Reverse Proxy     | Nginx 1.25.x                         |

### Setup Instructions

#### 1. Clone the Repository

```sh
git clone git@github.com:ccp-eva/psydb.git psydb-repo
```

#### 2. Run the Installation Script

For Ubuntu, an installation script is located at:

```
psydb-repo/deploy/systemd/install-ubuntu.sh
```

This script performs the following setup steps:

- installs MongoDB and sets the default port to `47017`
- installs Node.js
- installs Nginx and copies the no-SSL config from the `dist/` folder to `/etc`
- creates the `/srv/psydb-deployment` directory and copies the repository there
- creates a `psydb` system group and user
- copies `psydb.service` to `/usr/lib/systemd/system`
- installs Node.js packages and builds the UI
- enables the `psydb` and `nginx` services via `systemd`
- copies initializer dumps and helper scripts (`make-dump.sh`, `restore-dump.sh`)
- copies distribution configuration files to their appropriate locations


execute the script via
```sh
./psydb-repo/deploy/systemd/install-ubuntu.sh /srv/psydb-deployment
```

> **Note**: For further configuration (e.g., enabling SSL in Nginx or tuning MongoDB), please consult the official documentation for those components.

#### 3. Initialize the Database

To perform a minimal initialization with only an admin account:

```sh
cd /srv/psydb-deployment
./restore-dump.sh ./mongodb-dumps/init-minimal
```

To create a testing instance with dummy data:

```sh
./restore-dump.sh ./mongodb-dumps/init-childlab-with-dummy-data
```

#### 4. Configuration

Edit the configuration file:

```sh
$EDITOR ./psydb-src/config/config.js
```
> **Note**: For more information refer to the configuration section

#### 5. Start Services

After configuration, start the remaining services:

```sh
systemctl start psydb
systemctl start nginx
```

#### TL;DR

```sh
    cd ~/
    git clone git@github.com:ccp-eva/psydb.git ./psydb-repo
    ./psydb-repo/deploy/systemd/install-ubuntu.sh /srv/psydb-deployment
    
    cd /srv/psydb-deployment
    ./restore-dump.sh ./mongodb-dumps/init-minimal
    
    $EDITOR ./psydb-src/config/config.js

    # systemctl start psydb
    # systemctl start nginx
```

## Docker

create initial folders
```sh
    mkdir psydb-deployment && cd psydb-deployment
    mkdir -p ./psydb-data ./psydb-config/nginx ./psydb-config/psydb
    mkdir -p ./psydb-ssl # optional
```

download docker compose dist config and modify it as needed
```sh
    curl -L -O github.com/cdxOo/psydb/raw/master/deploy/docker-compose.dist.yaml
    mv -v docker-compose{.dist,}.yaml

    $EDITOR docker-compose.yaml
```

by default the dist config uses mailhog as smtp mail sink for testing
purposes you probably want to remove that
