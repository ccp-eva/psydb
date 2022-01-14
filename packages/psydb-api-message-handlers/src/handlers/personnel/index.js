'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var PersonnelGroup = MessageHandlerGroup([
    require('./create'),
    GenericRecordHandler({
        collection: 'personnel',
        op: 'patch',
    }),
]);

module.exports = PersonnelGroup;
