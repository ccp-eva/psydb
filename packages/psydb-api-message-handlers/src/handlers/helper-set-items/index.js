'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var HelperSetItemsGroup = MessageHandlerGroup([
    require('./create'),

    GenericRecordHandler({
        collection: 'helperSetItem',
        op: 'patch',
    }),
]);

module.exports = HelperSetItemsGroup;
