'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var {
    GenericRecordHandler,

    GenericHideRecordHandler,
    GenericUnhideRecordHandler
} = require('../../lib');

var ExternalOrganizationGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'externalOrganization',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'externalOrganization',
        op: 'patch',
    }),

    GenericHideRecordHandler({ collection: 'externalOrganization' }),
    GenericUnhideRecordHandler({ collection: 'externalOrganization' }),

    require('./remove'),
]);

module.exports = ExternalOrganizationGroup;
