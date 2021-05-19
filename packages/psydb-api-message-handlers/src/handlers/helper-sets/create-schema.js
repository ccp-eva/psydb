'use strict';
var {
    ExactObject,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ op }) => (
    Message({
        type: `helper-sets/${op}`,
        payload: ExactObject({
            properties: {
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
                'props'
            ]
        })
    })
)

module.exports = createSchema;
