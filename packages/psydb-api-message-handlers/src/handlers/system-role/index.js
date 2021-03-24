'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var SystemRoleGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'systemRole',
        op: 'create',
    }),
    GenericRecordHandler({
        collection: 'systemRole',
        op: 'patch',
    }),
]);

module.exports = SystemRoleGroup;
