'use strict';
var {
    OpenObject,
    Id,
    EventId,
    IdentifierString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var BaseSchema = () => {
    return Message({
        type: `study/update-subject-type-base-settings`,
        payload: OpenObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                customRecordType: IdentifierString(),
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordType',
            ]
        })
    });
}

module.exports = BaseSchema;
