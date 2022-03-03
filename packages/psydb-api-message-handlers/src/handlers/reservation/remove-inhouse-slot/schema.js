'use strict';
var {
    ExactObject,
    Id,
    ForeignId,
    IdentifierString,
    SaneString,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `reservation/remove-inhouse-slot`,
        payload: ExactObject({
            properties: {
                id: Id(),
                props: ExactObject({
                    properties: {
                        studyId: ForeignId({
                            collection: 'study',
                            custom: true
                        }),
                        experimentOperatorTeamId: ForeignId({
                            collection: 'experimentOperatorTeam',
                            custom: true
                        }),
                        locationId: ForeignId({
                            collection: 'location',
                            custom: true
                        }),
                        interval: DateTimeInterval(),
                    },
                    required: [
                        'studyId',
                        'experimentOperatorTeamId',
                        'locationId',
                        'interval'
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
