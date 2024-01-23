'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var SubjectSelectorSettingGroup = MessageHandlerGroup([
    require('./online-survey'),
    require('./online-video-call'),
    require('./inhouse'),
    require('./away-team'),

    require('./apestudies-wkprc-default'),
    require('./manual-only-participation'),

    require('./remove')
]);

module.exports = SubjectSelectorSettingGroup;
