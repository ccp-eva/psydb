
# PsyDB

EVA-CCP web application to support the organizational workflow of studies.


## Deployment Overview

There are two variants for setting up **PsyDB**:

1. **Docker (Recommended)**
   Uses `docker-compose` for containerized deployment.

2. **Manual SystemD Installation**
   Installs PsyDB directly onto the host system using `systemd` service files.

### Database

- **MongoDB** is used as the backend database.

### HTTPS and SSL

- PsyDB **does not handle SSL encryption** directly.
- It is designed to run **behind an HTTPS reverse proxy**, such as **Nginx**.

### Email Support

- To send emails (e.g. for new account registration), you must **provide an SMTP server**.

### Deployment Files Structure

The `deploy/` directory contains all relevant tools and helpers for setting up PsyDB.

- `docker/`: files related to **docker-based installation**
- `systemd/`: files related to **manual systemd installation**
- `common/`: files shared between both installation methods, including:
  - distribution configuration files
  - initializer data dumps
  - general helper scripts


## Installation

### SystemD-Based Deployment

#### System Requirements

| Component         | Recommended Option                   |
| ----------------- | ------------------------------------ |
| Operating System  | Ubuntu 22.04 LTS                     |
| Runtime           | Node.js 18.x LTS                     |
| Database          | MongoDB 6.x / 5.x / 4.x              |
| Reverse Proxy     | Nginx 1.27.x                         |

#### Setup Instructions

##### 1. Clone the Repository

```sh
git clone https://github.com/ccp-eva/psydb.git ./psydb-repo
```

##### 2. Run the Installation Script

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

##### 3. Initialize the Database

To perform a minimal initialization with only an admin account:

```sh
cd /srv/psydb-deployment
./restore-dump.sh ./mongodb-dumps/init-minimal
```

To create a testing instance with dummy data:

```sh
./restore-dump.sh ./mongodb-dumps/init-childlab-with-dummy-data
```

##### 4. Configuration

Edit the configuration file:

```sh
$EDITOR ./psydb-src/config/config.js
```
> **Note**: For more information refer to the configuration section

##### 5. Start Services

After configuration, start the remaining services:

```sh
sudo systemctl start psydb
sudo systemctl start nginx
```

##### TL;DR

```sh
    cd ~/
    git clone https://github.com/ccp-eva/psydb.git ./psydb-repo
    ./psydb-repo/deploy/systemd/install-ubuntu.sh /srv/psydb-deployment
    
    cd /srv/psydb-deployment
    ./restore-dump.sh ./mongodb-dumps/init-minimal
    
    $EDITOR ./psydb-src/config/config.js

    # sudo systemctl start psydb
    # sudo systemctl start nginx
```

### Docker

**TODO**
## Configuration

- The default configuration is located at:  
  `deploy/common/dist-configs/psydb/config.js`
- This is a JavaScript file that exports an object, similar in structure to JSON.
- Use it as a template for your own environment-specific configurations.

> **Security Note:** Always replace placeholder secrets and keys with strong, environment-specific values before deploying to production.

### Database Configuration (`db`)

```js
db: {
    url: 'mongodb://mongodb:27017/psydb',
    dbName: 'psydb',
    useUnifiedTopology: true,
}
```

- **url**: MongoDB connection URI.  
- **dbName**: Database name to use.
- **useUnifiedTopology**: Enables unified topology in MongoDB driver.

> See [MongoDB connection docs](https://www.mongodb.com/docs/drivers/node/v3.6/fundamentals/connection/connect/) form more options.
> Currently using Node.js MongoDB driver version **3.6**.

### Session Configuration (`session`, `sessionSecret`, `sessionSig`)

```js
session: {
    key: 'koa:sess-dist',
}
```

- **key**: Cookie key used by Koa session middleware.

> See [koa-session](https://www.npmjs.com/package/koa-session) for more options.
> The value of `signed` will be determined automatically by default and uses `sessionSig.keys`

```js
sessionSecret: `...`
```

- **sessionSecret**: A strong secret string for encrypting session cookies.

```js
sessionSig: {
    keys: [...],
    digest: 'sha256'
}
```

- **keys**: List of keys used for signing cookies.
- **digest**: Signature digest algorithm.

> See [Koa Documentation](https://github.com/koajs/koa/blob/master/docs/api/index.md#appkeys) for more information.

Keys/Secrets can be generated with:

```bash
dd if=/dev/urandom bs=1M count=1 status=none | sha512sum -b | awk '{print $1}'
```

### SMTP Configuration (`smtp`)

```js
smtp: {
    senderEmail: 'psydb-noreply@example.com',
    host: 'mailhog',
    port: 1025,
    secure: false,
    // auth: { user, pass }
}
```

- **senderEmail**: E-Mail address used as sender in the envelope.
- Other config options are passed directly to [Nodemailer](https://nodemailer.com/smtp/).
- Defaults target [MailHog](https://github.com/mailhog/MailHog) for development.
- Uncomment and configure `auth` for production environments using authenticated SMTP.

### API Key Authentication (`apiKeyAuth`)

```js
apiKeyAuth: {
    isEnabled: true,
    allowedIps: ['::/0']
}
```

- **isEnabled**: Enables or disables API key-based auth.
- **allowedIps**: Trusted IP ranges.

> API keys are managed in the database and can be enabled/disabled via the UI.

### Two-Factor Authentication (`twoFactorAuth`)

```js
twoFactorAuth: {
    isEnabled: true
}
```

- **isEnabled**: Enables two-factor authentication (2FA).

### Internationalization (`i18n`)

```js
i18n: {
    enableI18NSelect: true,
    defaultLanguage: 'en',
    defaultLocaleCode: 'en-US',
}
```

- Enables language and locale selection by users.
- Supported languages: `'en'`, `'de'`
- Supported locales: `'en-US'`, `'en-GB'`, `'de-DE'`

### Lab Methods (`enabledLabMethods`)

```js
enabledLabMethods: [
    'inhouse',
    'away-team',
    // 'online-video-call',
    // 'online-survey',
    // 'apestudies-wkprc-default',
    // 'manual-only-participation'
]
```

- List of enabled lab methods. Comment/uncomment to modify.
- `'manual-only-participation'` refers to the field-site workflow.

### Branding and UI Options

```js
branding: { /* a branding object */ },
disableLogoOverlay: false,
dev_enableStagingBanner: false,
dev_copyNoticeGreyscale: true,
dev_enableForeignIdRefLinkInForms: false,
```

- **branding**: An object containing branding information, see `psydb-common-config/psydb-default-branding/index.js`
- **disableLogoOverlay**: Hide/show logo overlay text on login.
- **dev_enableStagingBanner**: Shows a banner to indicate staging mode.
- **dev_copyNoticeGreyscale**: Use greyscale or color copy watermark.
- **dev_enableForeignIdRefLinkInForms**: Wether links to referenced records should be shown in record edit forms, only the details shows links.

### Development & Experimental Flags

```js
dev_enableDangerousCRTFieldOps: false,
dev_enableCSVSubjectImport: false,
dev_enableCSVParticipationImport: false,
```

- **dev_enableDangerousCRTFieldOps**: Enables changing committed CRT field settings (use with caution).
- **dev_enableCSVSubjectImport**: Enables importing subject data from CSV files.
- **dev_enableCSVParticipationImport**: Enables importing participation data from CSV files.
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
