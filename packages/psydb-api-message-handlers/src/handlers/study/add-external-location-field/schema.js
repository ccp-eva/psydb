'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    IdentifierString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `study/add-external-location-field`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                subjectType: IdentifierString(),
                locationFieldKey: IdentifierString(),
            },
            required: [
                'id',
                'lastKnownEventId',
                'subjectType',
                'locationFieldKey',
            ]
        })
    });
}

module.exports = Schema;
