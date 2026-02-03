## Upgrading

How to upgrade an existing installation depends on the deployment variant.

### SystemD-Based Deployment

#### TL;DR

```sh
# stop services
sudo systemctl stop nginx
sudo systemctl stop psydb

# also stop all other related jobs e.g. from cron

cd /srv/psydb-deployment/

# create a database backup
./make-dump.sh

# update repo
git pull
git checkout 0.98.0 # or whichever version you want

# update node modules
node ./common/scripts/install-run-rush.js update

# build ui
cd ./packages/psydb-ui
npm run build

cd /srv/psydb-deployment/

sudo systemctl start psydb
sudo systemctl start nginx

# reenable related jobs

```
