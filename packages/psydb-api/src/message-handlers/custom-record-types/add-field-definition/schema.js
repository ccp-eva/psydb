'use strict';
var {
    ExactObject,
    Id,
    EventId,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/add-field-definition`,
        payload: ExactObject({
            properties: {
                id: Id(),
                //subChannel: IdentifierString(), 
                subChannelKey: {
                    type: 'string',
                    enum: [ 'scientific', 'gdpr' ]
                }, 
                //lastKnownEventId: EventId(),
                props: CustomTypeFieldDefinition(),
            },
            required: [
                'id',
                //'lastKnownEventId',
                'props',
            ]
        })
    });
}

var CustomTypeFieldDefinition = () => ({
    oneOf: [
        SimpleFieldDefinition()
    ]
});

var SimpleFieldDefinition = () => ExactObject({
    properties: {
        key: IdentifierString(),
        type: {
            type: 'string',
            enum: [
                'SaneString',
                'Address',
            ]
        }
    }
});

module.exports = Schema;
