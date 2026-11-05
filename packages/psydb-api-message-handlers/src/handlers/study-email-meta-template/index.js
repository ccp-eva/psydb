'use strict';
var { MessageHandlerGroup } = require('@mpieva/psydb-koa-event-middleware');

var StudyEmailMetaTemplateGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = StudyEmailMetaTemplateGroup;
