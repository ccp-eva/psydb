'use strict';
var { MessageHandlerGroup } = require('@mpieva/psydb-koa-event-middleware');

var StudyConsentFormGroup = MessageHandlerGroup([
    require('./create'),
    require('./patch'),
]);

module.exports = StudyConsentFormGroup;
