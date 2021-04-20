'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
    IdentifierString,
    DaysSinceBirthInterval,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `study/add-age-frame`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                customRecordType: IdentifierString(),
                ageFrame: DaysSinceBirthInterval(),
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordType',
                'ageFrame',
            ]
        })
    });
}

module.exports = Schema;
