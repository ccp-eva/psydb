'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var HelperSetsGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'helperSet',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'helperSet',
        op: 'patch',
    }),

    require('./remove'),
]);

module.exports = HelperSetsGroup;
