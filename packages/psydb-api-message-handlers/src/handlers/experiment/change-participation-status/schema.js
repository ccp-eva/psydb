'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    ProcessedParticipationStatus,
    DefaultBool,
} = require('@mpieva/psydb-schema-fields');

var { Message } = require('@mpieva/psydb-schema-helpers');

var createSchema = ({} = {}) => (
    Message({
        type: `experiment/change-participation-status`,
        payload: ExactObject({
            properties: {
                experimentId: ForeignId({
                    collection: 'experiment',
                }),
                subjectId: ForeignId({
                    collection: 'subject',
                }),
                participationStatus: ProcessedParticipationStatus(),
                excludeFromMoreExperimentsInStudy: DefaultBool(),
            },
            required: [
                'experimentId',
                'subjectId',
                'participationStatus'
            ]
        })
    })
)

module.exports = createSchema;
