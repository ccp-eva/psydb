'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var SubjectGroupGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
    require('./remove'),
]);

module.exports = SubjectGroupGroup;
