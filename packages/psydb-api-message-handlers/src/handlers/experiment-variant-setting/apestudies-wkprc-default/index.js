'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var EVSApestudiesWKPRCDefaultGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = EVSApestudiesWKPRCDefaultGroup;
