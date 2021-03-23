'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    SaneString,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/create-from-inhouse-reservation`,
        payload: ExactObject({
            properties: {
                id: Id(),
                props: ExactObject({
                    properties: {
                        reservationId: ForeignId({
                            collection: 'reservation',
                        }),
                        lastKnownReservationEventId: EventId(),

                        subjectIds: {
                            type: 'array',
                            default: [],
                            items: ForeignId({
                                collection: 'subject',
                            }),
                        },

                        subjectGroupIds: {
                            type: 'array',
                            default: [],
                            items: ForeignId({
                                collection: 'subjectGroup',
                            }),
                        }
                    },
                    required: [
                        'reservationId',
                        'lastKnownReservationEventId',
                        'subjectGroupIds',
                        'subjectIds',
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
