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
                        'extra-description', // FIXME: only study
                        'selection-summary', // FIXME: only subject
                        'invite-confirm-summary', // FIXME: only subject
                        'invite-selection-list', // FIXME: only subject
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
