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
        type: `reservation/reserve-awayteam-slot`,
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
                        interval: DateTimeInterval(),
                    },
                    required: [
                        'studyId',
                        'experimentOperatorTeamId',
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
