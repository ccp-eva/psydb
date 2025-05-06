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
branding: 'mpiccp',
disableLogoOverlay: false,
dev_enableStagingBanner: false,
dev_copyNoticeGreyscale: true,
```

- **branding**: Selected branding theme.
- **disableLogoOverlay**: Hide/show logo overlay text on login.
- **dev_enableStagingBanner**: Shows a banner to indicate staging mode.
- **dev_copyNoticeGreyscale**: Use greyscale or color copy watermark.

### Development & Experimental Flags

```js
dev_enableDangerousCRTFieldOps: false,
dev_enableCSVSubjectImport: false,
dev_enableCSVParticipationImport: false,
```

- **dev_enableDangerousCRTFieldOps**: Enables changing committed CRT field settings (use with caution).
- **dev_enableCSVSubjectImport**: Enables importing subject data from CSV files.
- **dev_enableCSVParticipationImport**: Enables importing participation data from CSV files.
