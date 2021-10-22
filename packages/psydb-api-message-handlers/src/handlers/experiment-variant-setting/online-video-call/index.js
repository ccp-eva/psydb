'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var EVSOnlineVideoCallGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = EVSOnlineVideoCallGroup;
