'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    SaneString,
    DateTimeInterval,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/move-away-team`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                experimentOperatorTeamId: ForeignId({
                    collection: 'experimentOperatorTeam',
                }),

                interval: DateTimeInterval(),
                shouldRemoveOldReservation: DefaultBool(),
            },
            required: [
                'experimentId',
                'experimentOperatorTeamId',
                'interval',
                'shouldRemoveOldReservation',
            ]
        })
    })
)

module.exports = createSchema;
