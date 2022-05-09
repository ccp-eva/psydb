'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var ExternalOrganizationGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'externalOrganization',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'externalOrganization',
        op: 'patch',
    }),

    require('./remove'),
]);

module.exports = ExternalOrganizationGroup;
