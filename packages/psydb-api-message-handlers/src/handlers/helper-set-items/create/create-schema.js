'use strict';
var {
    ExactObject,
    Id,
    ForeignId,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ op }) => (
    Message({
        type: `helperSetItem/${op}`,
        payload: ExactObject({
            properties: {
                id: Id(),
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
