'use strict';
var {
    MessageHandlerGroup
} = require('@mpieva/psydb-koa-event-middleware');

var GenericRecordHandler = require('../../lib/generic-record-handler');

var ExperimentVariantGroup = MessageHandlerGroup([
    GenericRecordHandler({
        collection: 'experimentVariant',
        op: 'create',
    }),
    require('./remove'),
]);

module.exports = ExperimentVariantGroup;
