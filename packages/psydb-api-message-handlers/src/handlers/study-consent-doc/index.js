'use strict';
var { MessageHandlerGroup } = require('@mpieva/psydb-koa-event-middleware');

var StudyConsentDocGroup = MessageHandlerGroup([
    require('./create'),
    require('./flag-and-comment'),
]);

module.exports = StudyConsentDocGroup;
