'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var EVSAwayTeamGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = EVSAwayTeamGroup;
