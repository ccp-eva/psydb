'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var HelperSetItemsGroup = MessageHandlerGroup([
    require('./create'),
]);

module.exports = HelperSetItemsGroup;
