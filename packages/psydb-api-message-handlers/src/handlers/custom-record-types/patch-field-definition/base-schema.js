'use strict';
var {
    ExactObject,
    OpenObject,
    Id,
    EventId,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var BaseSchema = () => {
    return Message({
        type: `custom-record-types/patch-field-definition`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                subChannelKey: {
                    type: 'string',
                    enum: [ 'scientific', 'gdpr' ]
                }, 
                fieldKey: IdentifierString(),
                props: {
                    type: 'object',
                    properties: {
                        displayName: SaneString({ minLength: 1 }),
                        displayNameI18N: OpenObject({
                            de: SaneString()
                        })
                    }
                },
            },
            required: [
                'id',
                'props',
            ]
        })
    });
}

module.exports = BaseSchema;
