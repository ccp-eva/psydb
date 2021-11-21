'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var ExperimentOperatorTeamGroup = MessageHandlerGroup([
    // TODO: permissions
    GenericRecordHandler({
        collection: 'experimentOperatorTeam',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'experimentOperatorTeam',
        op: 'patch',
    }),
]);

module.exports = ExperimentOperatorTeamGroup;
