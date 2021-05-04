'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    IdentifierString,
    DateTime,
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
            },
            required: [
                'id',
                'lastKnownScientificEventId',
                'studyId',
                'timestamp',
            ]
        })
    });
}

module.exports = Schema;
