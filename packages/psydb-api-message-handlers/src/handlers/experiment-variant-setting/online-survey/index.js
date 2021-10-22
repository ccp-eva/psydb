'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var EVSOnlineSurveyGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = EVSOnlineSurveyGroup;
