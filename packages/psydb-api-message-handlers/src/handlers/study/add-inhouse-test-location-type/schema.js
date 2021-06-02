'use strict';
var {
    ExactObject,
    DefaultBool,
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
        type: `study/add-inhouse-test-location-type`,
        payload: ExactObject({
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

module.exports = Schema;
