'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var HelperSetsGroup = MessageHandlerGroup([
    require('./create'),
    
    GenericRecordHandler({
        collection: 'helperSet',
        op: 'patch',
    }),

    require('./remove'),
]);

module.exports = HelperSetsGroup;
