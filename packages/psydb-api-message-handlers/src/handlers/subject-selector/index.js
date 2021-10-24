'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var SubjectSelectorGroup = MessageHandlerGroup([
    require('./create'),
    require('./remove'),
]);

module.exports = SubjectSelectorGroup;
