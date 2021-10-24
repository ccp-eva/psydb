'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var AgeFrameGroup = MessageHandlerGroup([
    require('./create'),
    require('./remove'),
]);

module.exports = AgeFrameGroup;
