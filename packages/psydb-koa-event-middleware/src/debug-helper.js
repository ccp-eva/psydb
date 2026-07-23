'use strict';
var Debug = require('debug');
module.exports = (path) => (
    Debug(`psydb:koa-event-middleware:${path}`)
)
