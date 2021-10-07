'use strict';
var {
    ExactObject,
    Id,
    EventId,
    IdentifierString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/remove-field-definition`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                subChannelKey: {
                    type: 'string',
                    enum: [ 'scientific', 'gdpr' ]
                }, 
                key: IdentifierString(),
            },
            required: [
                'id',
                'lastKnownEventId',
                'key',
            ]
        })
    });
}

module.exports = Schema;
