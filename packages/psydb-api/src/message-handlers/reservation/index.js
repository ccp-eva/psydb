'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var ReservationGroup = MessageHandlerGroup([
    require('./reserve-away-slot'),
    require('./reserve-inhouse-slot'),
]);

module.exports = ReservationGroup;
