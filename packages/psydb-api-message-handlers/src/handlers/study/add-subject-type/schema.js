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
        type: `study/add-subject-type`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                customRecordType: IdentifierString(),
                enableOnlineTesting: DefaultBool(),
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
