'use strict';
var {
    ExactObject,
    ForeignId,
    DefaultBool,
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
                shouldRemoveOldReservation: DefaultBool()
            },
            required: [
                'experimentId',
                'experimentOperatorTeamId',
                'shouldRemoveOldReservation'
            ]
        })
    })
)

module.exports = createSchema;
