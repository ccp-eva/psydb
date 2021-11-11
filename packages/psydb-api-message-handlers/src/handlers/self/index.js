'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var SelfGroup = MessageHandlerGroup([
    require('./set-forced-research-group')
]);

module.exports = SelfGroup;
