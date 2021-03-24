'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var LocationGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'location',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'location',
        op: 'patch',
    }),
]);

module.exports = LocationGroup;
