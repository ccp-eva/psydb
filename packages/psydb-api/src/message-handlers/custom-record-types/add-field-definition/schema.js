'use strict';
var {
    ExactObject,
    Id,
    MessageId,
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
                lastKnownMessageId: MessageId(),
                props: CustomTypeFieldDefinition(),
            },
            required: [
                'id',
                'lastKnownMessageId',
                'props',
            ]
        })
    });
}

var CustomTypeFieldDefinition = () => ExactObject({
    properties: {},
    required: [],
})

module.exports = Schema;
