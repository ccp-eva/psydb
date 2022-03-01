'use strict';
var {
    ExactObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var State = require('./state');

var FullSchema = ({ enableInternalProps } = {}) => ExactObject({
    properties: {
        state: State({ enableInternalProps })
    },
    required: [
        'state',
    ]
});

module.exports = FullSchema;
