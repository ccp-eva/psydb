'use strict';
var debug = (scope) => (
    require('debug')(`psydb:api-endpoint-lib:${scope}`)
);

module.exports = debug;
