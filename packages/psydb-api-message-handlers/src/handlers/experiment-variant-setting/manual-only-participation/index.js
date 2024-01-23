'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var EVSManualOnlyParticipationGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = EVSManualOnlyParticipationGroup;
