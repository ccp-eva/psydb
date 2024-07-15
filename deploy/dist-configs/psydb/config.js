module.exports = {
    // uses node mongodb driver version 3
    db: {
        // see https://www.mongodb.com/docs/drivers/node/v3.6/fundamentals/connection/connect/
        // for more information on connection string
        url: 'mongodb://mongodb:27017/psydb',
        dbName: 'psydb',
        
        // see https://mongodb.github.io/node-mongodb-native/3.6/api/global.html#MongoClientOptions
        // for other available options
        useUnifiedTopology: true,
    },
    // uses nodemailer under the hood
    // see https://nodemailer.com/smtp/
    // for other available options
    // (configured for mailhog container by default)
    smtp: {
        senderEmail: 'psydb-noreply@example.com',
        host: 'mailhog',
        port: 1025,
        secure: false,
        //auth: {
        //    user: 'my_user', // smtp user
        //    pass: 'my_pass', // smtp password
        //},
    },

    // session options
    // see https://www.npmjs.com/package/koa-session for options
    // 'signed' value will be determined automatically by default
    session: {
        key: 'koa:sess-dist',
    },
    // secret for session encryption; should be a secure string
    sessionSecret: `
        ------------------------------------------
        GENERATE YOUR OWN AND MAKE IT REALLY LONG
        ------------------------------------------
    `,
    // configuration for session signature, uses keygrip under the hood
    // see https://koajs.com and https://www.npmjs.com/package/keygrip
    sessionSig: { keys: [
        '----------------------------',
        'A LIST OF SIGNATURE KEYS',
        'GENERATE YOUR OWN',
        'MAKE THEM LONG ENOUGH',
        '----------------------------',
    ], digest: 'sha256' },
    
    // options for internationalization
    i18n: {
        enableI18NSelect: true,
        defaultLanguage: 'en',
        defaultLocaleCode: 'en-US',
    },

    // options for twoFactorAuth, currently only has 'isEnabled'
    twoFactorAuth: {
        isEnabled: true
    },

    // options for apiKeyAuth, IPs must be ipv6
    apiKeyAuth: {
        isEnabled: true,
        allowedIps: [ '::/0' ]
    }
}
