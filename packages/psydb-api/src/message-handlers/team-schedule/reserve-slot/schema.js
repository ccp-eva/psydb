'use strict';
var {
    ExactObject,
    ForeignId,
    IdentifierString,
    SaneString,
    DateTime,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `team-schedule/reserve-slot`,
        payload: ExactObject({
            properties: {
                id: IdentifierString(),
                props: ExactObject({
                    properties: {
                        experimentOperatorTeamId: ForeignId({
                            collection: 'experimentOperatorTeam',
                            custom: true
                        }),
                        start: DateTime(),
                        end: DateTime(),
                    },
                    required: [
                        'experimentOperatorTeamId',
                        'start',
                        'end'
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
