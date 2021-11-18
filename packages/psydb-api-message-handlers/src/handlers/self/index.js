'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var SelfGroup = MessageHandlerGroup([
    require('./set-forced-research-group'),
    require('./set-password'),
]);

module.exports = SelfGroup;
