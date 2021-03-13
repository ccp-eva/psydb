'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var TeamScheduleGroup = MessageHandlerGroup([
    require('./reserve-slot'),
]);

module.exports = TeamScheduleGroup;
