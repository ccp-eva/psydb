'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var HelperSetsGroup = MessageHandlerGroup([
    require('./create'),
]);

module.exports = HelperSetsGroup;
