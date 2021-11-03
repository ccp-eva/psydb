'use strict';
var Debug = require('debug');
module.exports = (path) => (
    Debug(`psydb:api:message-handlers:experiments:${path}`)
);
