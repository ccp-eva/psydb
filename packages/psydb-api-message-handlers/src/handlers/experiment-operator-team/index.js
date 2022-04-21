'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var ExperimentOperatorTeamGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
    require('./change-hidden-state'),
]);

module.exports = ExperimentOperatorTeamGroup;
