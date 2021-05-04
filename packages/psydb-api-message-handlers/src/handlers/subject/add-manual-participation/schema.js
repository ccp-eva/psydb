'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    IdentifierString,
    DateTime,
    ParticipationStatus,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `subject/add-manual-participation`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownScientificEventId: EventId(),
                studyId: ForeignId({
                    collection: 'study',
                }),
                timestamp: DateTime(),
                status: ParticipationStatus(),
            },
            required: [
                'id',
                'lastKnownScientificEventId',
                'studyId',
                'timestamp',
                'status',
            ]
        })
    });
}

module.exports = Schema;
