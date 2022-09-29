'use strict';
var {
    ExactObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/change-study`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                studyId: ForeignId({
                    collection: 'study',
                }),
                labTeamId: ForeignId({
                    collection: 'experimentOperatorTeam',
                }),
            },
            required: [
                'experimentId',
                'studyId',
                'labTeamId'
            ]
        })
    })
)

module.exports = createSchema;
