'use strict';
var fs = require('fs');
var fspath = require('path');
var userConfigPath = fspath.resolve(__dirname, '../../../config/config.js');

var defaultSideNav = require('@mpieva/psydb-common-config/default-side-nav');

var config = undefined;
console.log(userConfigPath);
if (fs.existsSync(userConfigPath) && fs.lstatSync(userConfigPath).isFile()) {
    config = require(userConfigPath);
}
else {
    console.warn('no config found using fallback');

    var common = require('@mpieva/psydb-common-config');
    config = {
        ...common,
        session: {
            key: 'koa:sess-dev'
        },
        sessionSecret: [
            '------------------------------------------',
            'DO NOT USE IN PRODUCTION GENERATE YOUR OWN',
            '------------------------------------------',
        ].join(''),
        sessionSig: {
            keys: [
                'ONLY FOR DEVELOPMENT',
                'DO NOT USE IN PRODUCTION ENV',
                'GENERATE YOUR OWN',
                'AND MAKE THHEM REALLY LONG'
            ],
            digest: 'sha256', // thats also the default
        },
        db: {
            url: 'mongodb://127.0.0.1:47017/psydb',
            dbName: 'psydb',
            useUnifiedTopology: true,
        },
        smtp: {
            senderEmail: 'psydb-noreply@example.com',
            host: '127.0.0.1',
            //port: 1025, // mailhog
            port: 3025, // greenmail
            secure: false,
        },
    }
}

if (!config.sideNav) {
    config.sideNav = defaultSideNav;
}

module.exports = config;
