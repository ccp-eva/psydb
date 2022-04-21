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
                isVisible: DefaultBool(),
            },
            required: [
                'experimentOperatorTeamId',
                'isVisible'
            ]
        })
    })
)

module.exports = createSchema;
