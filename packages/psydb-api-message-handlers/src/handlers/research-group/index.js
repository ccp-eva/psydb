'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var ResearchGroupGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'researchGroup',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'researchGroup',
        op: 'patch',
    }),
]);

module.exports = ResearchGroupGroup;
