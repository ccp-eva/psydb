'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var SubjectSelectorSettingGroup = MessageHandlerGroup([
    require('./online-survey'),
    require('./online-video-call'),
    require('./inhouse'),
    require('./inhouse-group-simple'),
    require('./away-team'),
    require('./remove')
]);

module.exports = SubjectSelectorSettingGroup;
