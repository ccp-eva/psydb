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

var createSchema = ({ messageType } = {}) => (
    Message({
        type: messageType,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                locationId: ForeignId({
                    collection: 'location',
                }),
                experimentOperatorTeamId: ForeignId({
                    collection: 'experimentOperatorTeam',
                }),

                interval: DateTimeInterval(),
                shouldRemoveOldReservation: DefaultBool()
            },
            required: [
                'experimentId',
                'locationId',
                'interval',
                'shouldRemoveOldReservation',
            ]
        })
    })
)

module.exports = createSchema;
