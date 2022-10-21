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
    require('./change-comment'),
    
    require('./hide-record'),
    GenericUnhideRecordHandler({ collection: 'location' }),
    
    require('./remove'),
]);

module.exports = LocationGroup;
