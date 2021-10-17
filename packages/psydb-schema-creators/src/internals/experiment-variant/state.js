'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    DefaultBool
} = require('@mpieva/psydb-schema-fields');

var ExperimentVariantState = ({} = {}) => {
    var schema = ExactObject({
        properties: {
            // rohrpost cant handle empty state
            // thats currently why this is here
            isEnabled: DefaultBool({
                const: true,
                default: true
            })
        },
        required: [
            'isEnabled',
        ]
    })

    return schema;
}

module.exports = ExperimentVariantState;

