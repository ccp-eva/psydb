'use strict';
var Debug = require('debug');
module.exports = (suffix) => (
    Debug(`psydb-db-anon-dumper:${suffix}`)
)
