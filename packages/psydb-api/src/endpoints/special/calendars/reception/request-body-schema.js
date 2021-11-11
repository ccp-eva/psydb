'use strict';
var {
    ExactObject,
    DateTimeInterval,
    ExperimentTypeEnum,
} = require('@mpieva/psydb-schema-fields');

var RequestBodySchema = () => ExactObject({
    properties: {
        interval: DateTimeInterval(),
    },
    required: [
        'interval',
    ]
})

module.exports = RequestBodySchema;
