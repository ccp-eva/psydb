'use strict';
var {
    ExactObject,
    ForeignId,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ op }) => (
    Message({
        type: `helper-set-items/${op}`,
        payload: ExactObject({
            properties: {
                setId: ForeignId({
                    collection: 'helperSet'
                }),
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
                'setId',
                'props'
            ]
        })
    })
)

module.exports = createSchema;
