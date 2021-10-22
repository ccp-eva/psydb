'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var EVSInhouseGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = EVSInhouseGroup;
