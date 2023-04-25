'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var ApiKeyGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
    require('./remove'),
]);

module.exports = ApiKeyGroup;
