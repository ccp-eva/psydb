'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var {
    GenericRecordHandler,

    GenericHideRecordHandler,
    GenericUnhideRecordHandler
} = require('../../lib');

var LocationGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'location',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'location',
        op: 'patch',
    }),
    
    GenericHideRecordHandler({ collection: 'location' }),
    GenericUnhideRecordHandler({ collection: 'location' }),
]);

module.exports = LocationGroup;
