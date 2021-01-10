'use strict';
var { ExactObject } = require('@mpieva/psydb-schema-fields');

var CustomTypeLabelDefinition = () => ExactObject({
    properties: {
        format: {
            type: 'string',
            default: '',
            pattern: '^[^\\r\\n]*(?:\\$\\{\\d+\\}[^\\r\\n]*)+$',
            examples: [
                '${1} ${2}'
            ]
        },
        tokens: {
            type: 'array',
            default: [],
            minItems: 1,
            items: {
                type: 'string',
                format: 'json-pointer'
            }
        }
    },
    required: [
        'label',
        'tokens',
    ]
})

module.exports = CustomTypeLabelDefinition;
