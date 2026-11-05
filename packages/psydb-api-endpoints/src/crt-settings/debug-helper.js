'use strict';
var Debug = require('debug');
module.exports = (str) => (
    Debug('psydb:api:endpoints:crtSettings:' + str)
)
