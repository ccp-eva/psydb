'use strict';
var {
    ExactObject,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ op }) => (
    Message({
        type: `helper-set-items/${op}`,
        payload: ExactObject({
            properties: {
                set: IdentifierString(),
                id: IdentifierString(),
                props: ExactObject({
                    properties: {
                        label: SaneString(),
                    },
                    required: [
                        'label'
                    ]
                })
            },
            required: [
                'set',
                ...(op === 'create' ? [] : [ 'id' ]),
                'props'
            ]
        })
    })
)

module.exports = createSchema;
