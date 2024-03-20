'use strict';
var fs = require('fs');
var fspath = require('path');
var userConfigPath = fspath.resolve(__dirname, '../../../config/config.js');

var config = undefined;
console.log(userConfigPath);
if (fs.existsSync(userConfigPath) && fs.lstatSync(userConfigPath).isFile()) {
    config = require('../../../config/config.js');
    console.log(config);
}
else {
    console.warn('no config found using fallback');

    var common = require('@mpieva/psydb-common-config');
    config = {
        ...common,
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

module.exports = config;
