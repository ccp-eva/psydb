'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var CustomTypeGroup = MessageHandlerGroup([
    require('./create'),
    require('./set-general-data'),
    require('./add-field-definition'),
    require('./patch-field-definition'),
    require('./remove-field-definition'),
    require('./restore-field-definition'),
    require('./set-record-label-definition'),
    require('./set-display-fields'),
    require('./set-form-order'),
    require('./set-duplicate-check-settings'),
    require('./commit-settings'),
    require('./remove'),
]);

module.exports = CustomTypeGroup;
