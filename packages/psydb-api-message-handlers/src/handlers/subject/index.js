'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var SubjectGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'subject',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'subject',
        op: 'patch',
    }),

    require('./add-manual-participation'),
]);

module.exports = SubjectGroup;
