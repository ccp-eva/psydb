'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var RecordGroup = MessageHandlerGroup([
    GenericRecordHandler({
        op: 'create',
        // collection
    }),
    GenericRecordHandler({
        op: 'patch',
        // collection
    }),
]);

module.exports = RecordGroup;
