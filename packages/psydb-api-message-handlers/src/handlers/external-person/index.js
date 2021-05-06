'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var ExternalPersonGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'externalPerson',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'externalPerson',
        op: 'patch',
    }),
]);

module.exports = ExternalPersonGroup;
