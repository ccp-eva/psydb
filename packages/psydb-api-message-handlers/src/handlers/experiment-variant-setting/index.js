'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var ExperimentVariantSettingGroup = MessageHandlerGroup([
    require('./online-survey'),
    require('./online-video-call'),
]);

module.exports = ExperimentVariantSettingGroup;
