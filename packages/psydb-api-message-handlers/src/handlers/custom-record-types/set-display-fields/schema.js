'use strict';
var {
    ExactObject,
    Id,
    EventId,
    IdentifierString,
    SaneString,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/set-display-fields`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                target: {
                    type: 'string',
                    enum: [
                        'table',
                        'optionlist',
                    ]
                },
                fieldPointers: {
                    type: 'array',
                    items: JsonPointer(),
                },
            },
            required: [
                'id',
                'lastKnownEventId',
                'target',
                'fieldPointers',
            ]
        })
    });
}

module.exports = Schema;
