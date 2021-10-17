'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var ExperimentVariantSettingGroup = MessageHandlerGroup([
    require('./online-survey'),
]);

module.exports = ExperimentVariantSettingGroup;
