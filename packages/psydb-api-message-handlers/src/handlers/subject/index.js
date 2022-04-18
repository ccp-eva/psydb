'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var SubjectGroup = MessageHandlerGroup([
    require('./create'),

    GenericRecordHandler({
        collection: 'subject',
        op: 'patch',
    }),

    require('./add-manual-participation'),
    require('./patch-manual-participation'),
    require('./remove'),
]);

module.exports = SubjectGroup;
