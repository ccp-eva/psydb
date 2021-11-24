'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var StudyTopicGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = StudyTopicGroup;
