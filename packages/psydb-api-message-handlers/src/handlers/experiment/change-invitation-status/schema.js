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
        type: `experiment/change-invitation-status`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                subjectId: ForeignId({
                    collection: 'subject',
                }),
                invitationStatus: InvitationStatus()
            },
            required: [
                'experimentId',
                'subjectId',
                'invitationStatus'
            ]
        })
    })
)

module.exports = createSchema;
