'use strict';
var asCommanderOpts = require('../as-commander-opts');

var opts = () => asCommanderOpts([
    {
        long: 'mongodb-url',
        arg: 'mongodbConnectString',
        description: 'mongodb connect string',
        defaults: 'mongodb://127.0.0.1:47017/psydb',
    }
]);

module.exports = opts;
