'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var {
    GenericRecordHandler,

    GenericHideRecordHandler,
    GenericUnhideRecordHandler
} = require('../../lib');

var PersonnelGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
    
    GenericHideRecordHandler({ collection: 'personnel' }),
    GenericUnhideRecordHandler({ collection: 'personnel' }),
    
    require('./remove'),
]);

module.exports = PersonnelGroup;
