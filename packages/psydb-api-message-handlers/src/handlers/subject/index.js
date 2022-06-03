'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var {
    GenericRecordHandler,

    GenericHideRecordHandler,
    GenericUnhideRecordHandler
} = require('../../lib');

var SubjectGroup = MessageHandlerGroup([
    require('./create'),

    GenericRecordHandler({
        collection: 'subject',
        op: 'patch',
    }),
    GenericHideRecordHandler({ collection: 'subject' }),
    GenericUnhideRecordHandler({ collection: 'subject' }),

    require('./add-manual-participation'),
    require('./patch-manual-participation'),
    require('./remove-participation'),
    require('./remove'),
]);

module.exports = SubjectGroup;
