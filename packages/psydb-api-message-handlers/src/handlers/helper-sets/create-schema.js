'use strict';
var {
    ExactObject,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ op }) => (
    Message({
        type: `helper-sets/${op}`,
        payload: ExactObject({
            properties: {
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
                ...(op === 'create' ? [] : [ 'id' ]),
                'props'
            ]
        })
    })
)

module.exports = createSchema;
