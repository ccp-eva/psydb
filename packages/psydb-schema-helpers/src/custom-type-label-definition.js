'use strict';
var { ExactObject } = require('@mpieva/psydb-schema-fields');

var CustomTypeLabelDefinition = () => ExactObject({
    properties: {
        format: {
            type: 'string',
            default: '',
            pattern: '^[^\\r\\n]*(?:\\$\\{\\#\\}[^\\r\\n]*)+$',
            examples: [
                '${#} ${#}'
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
        'format',
        'tokens',
    ]
})

module.exports = CustomTypeLabelDefinition;
