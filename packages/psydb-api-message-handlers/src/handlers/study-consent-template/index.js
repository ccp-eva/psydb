'use strict';
var { MessageHandlerGroup } = require('@mpieva/psydb-koa-event-middleware');

var StudyConsentTemplateGroup = MessageHandlerGroup([
    require('./create'),
]);

module.exports = StudyConsentTemplateGroup;
