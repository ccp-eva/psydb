'use strict';
var {
    ExactObject,
    ForeignId,
    Id,
    SaneString,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `reservation/remove-awayteam-slot`,
        payload: ExactObject({
            properties: {
                props: ExactObject({
                    properties: {
                        id: Id()
                    },
                    required: [
                        'id'
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
