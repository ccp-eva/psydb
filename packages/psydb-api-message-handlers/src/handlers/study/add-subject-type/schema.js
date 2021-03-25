'use strict';
var {
    ExactObject,
    Id,
    EventId,
    ForeignId,
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
                customRecordTypeId: ForeignId({
                    collection: 'customRecordType',
                    constraints: {
                        '/collection': 'subject'
                    }
                })
            },
            required: [
                'id',
                'lastKnownEventId',
                'customRecordTypeId',
            ]
        })
    });
}

module.exports = Schema;
