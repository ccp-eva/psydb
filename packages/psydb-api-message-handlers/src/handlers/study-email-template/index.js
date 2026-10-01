'use strict';
var { MessageHandlerGroup } = require('@mpieva/psydb-koa-event-middleware');

var StudyEmailTemplateGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = StudyEmailTemplateGroup;
