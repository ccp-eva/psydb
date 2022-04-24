'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var SubjectGroupGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'subjectGroup',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'subjectGroup',
        op: 'patch',
    }),
]);

module.exports = SubjectGroupGroup;
