'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var EVSInhouseGroupSimpleGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = EVSInhouseGroupSimpleGroup;
