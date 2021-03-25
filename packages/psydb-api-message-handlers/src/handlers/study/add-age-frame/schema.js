'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
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
                customRecordTypeId: ForeignId({
                    collection: 'customRecordType',
                    constraints: {
                        '/collection': 'subject'
                    }
                }),
                ageFrame: DaysSinceBirthInterval(),
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordTypeId',
                'ageFrame',
            ]
        })
    });
}

module.exports = Schema;
