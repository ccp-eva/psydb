'use strict';
var {
    ExactObject,
    Id,
    EventId,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = () => (
    Message({
        type: `helperSetItem/patch`,
        payload: ExactObject({
            properties: {
                id: Id(),
                //lastKnownEventId: EventId(),
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
                'id',
                //'lastKnownEventId',
                'props'
            ]
        })
    })
)

module.exports = createSchema;
