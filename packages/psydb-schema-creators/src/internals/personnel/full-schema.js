'use strict';
var {
    ExactObject,
} = require('@mpieva/psydb-schema-fields');

var GdprState = require('./gdpr-state');
var ScientificState = require('./scientific-state');

var FullSchema = ({ enableInternalProps } = {}) => ExactObject({
    properties: {
        gdpr: ExactObject({
            state: GdprState({ enableInternalProps }),
        }),
        scientific: ExactObject({
            state: ScientificState({ enableInternalProps })
        }),
    },
});

module.exports = FullSchema;
