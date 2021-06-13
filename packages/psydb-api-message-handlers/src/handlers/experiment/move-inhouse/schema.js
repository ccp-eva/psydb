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
        type: `experiment/move-inhouse`,
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
            },
            required: [
                'experimentId',
                'locationId',
                'interval',
            ]
        })
    })
)

module.exports = createSchema;
