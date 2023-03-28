'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var {
    GenericRecordHandler,

    GenericHideRecordHandler,
    GenericUnhideRecordHandler
} = require('../../lib');

var ExternalPersonGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'externalPerson',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'externalPerson',
        op: 'patch',
    }),
    
    GenericHideRecordHandler({ collection: 'externalPerson' }),
    GenericUnhideRecordHandler({ collection: 'externalPerson' }),
    
    require('./remove'),
]);

module.exports = ExternalPersonGroup;
