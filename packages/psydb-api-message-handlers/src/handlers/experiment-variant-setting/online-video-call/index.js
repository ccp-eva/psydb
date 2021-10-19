'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var EVSOnlineVideoCallGroup = MessageHandlerGroup([
    require('./create'),
]);

module.exports = EVSOnlineVideoCallGroup;
