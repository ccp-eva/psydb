'use strict';
var {
    ExactObject,
    ForeignId,
    IdentifierString,
    SaneString,
    DateTimeInterval,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `reservation/reserve-awayteam-slot`,
        payload: ExactObject({
            properties: {
                id: IdentifierString(),
                props: ExactObject({
                    properties: {
                        experimentOperatorTeamId: ForeignId({
                            collection: 'experimentOperatorTeam',
                            custom: true
                        }),
                        interval: DateTimeInterval(),
                    },
                    required: [
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
