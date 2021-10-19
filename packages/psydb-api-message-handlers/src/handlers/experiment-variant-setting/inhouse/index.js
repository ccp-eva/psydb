'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var EVSInhouseGroup = MessageHandlerGroup([
    require('./create'),
]);

module.exports = EVSInhouseGroup;
