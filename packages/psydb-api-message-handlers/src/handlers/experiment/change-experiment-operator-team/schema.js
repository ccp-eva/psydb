'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    InvitationStatus
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/change-experiment-operator-team`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                experimentOperatorTeamId: ForeignId({
                    collection: 'experimentOperatorTeam',
                }),
            },
            required: [
                'experimentId',
                'experimentOperatorTeamId',
            ]
        })
    })
)

module.exports = createSchema;
