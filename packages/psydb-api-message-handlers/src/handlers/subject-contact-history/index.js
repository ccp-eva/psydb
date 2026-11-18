'use strict';
var { MessageHandlerGroup } = require('@mpieva/psydb-koa-event-middleware');

var SubjectContactHistoryGroup = MessageHandlerGroup([
    require('./create'),
]);

module.exports = SubjectContactHistoryGroup;
