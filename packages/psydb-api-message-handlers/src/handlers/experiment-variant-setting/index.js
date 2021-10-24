'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var SubjectSelectorSettingGroup = MessageHandlerGroup([
    require('./online-survey'),
    require('./online-video-call'),
    require('./inhouse'),
    require('./away-team'),
    require('./remove')
]);

module.exports = SubjectSelectorSettingGroup;
