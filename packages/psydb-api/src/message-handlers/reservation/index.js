'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var ReservationGroup = MessageHandlerGroup([
    require('./reserve-away-slot'),
]);

module.exports = ReservationGroup;
