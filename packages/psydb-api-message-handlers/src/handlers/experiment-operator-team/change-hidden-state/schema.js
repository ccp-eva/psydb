'use strict';

var {
    ExactObject,
    Id,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({ messageType }) => (
    Message({
        type: messageType,
        payload: ExactObject({
            properties: {
                experimentOperatorTeamId: Id({
                    collection: 'experimentOperatorTeam',
                }),
                isHidden: DefaultBool(),
            },
            required: [
                'experimentOperatorTeamId',
                'isHidden'
            ]
        })
    })
)

module.exports = createSchema;
