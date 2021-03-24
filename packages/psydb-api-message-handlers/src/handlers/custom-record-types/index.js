'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var CustomTypeGroup = MessageHandlerGroup([
    require('./create'),
    require('./enable-date-of-birth-field'),
    require('./add-field-definition'),
    require('./set-record-label-definition'),
    require('./commit-settings'),
]);

module.exports = CustomTypeGroup;
