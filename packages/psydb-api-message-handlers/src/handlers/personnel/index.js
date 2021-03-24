'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var PersonnelGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'personnel',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'personnel',
        op: 'patch',
    }),
]);

module.exports = PersonnelGroup;
