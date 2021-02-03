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
                lastKnownEventId: EventId(),
                props: CustomTypeFieldDefinition(),
            },
            required: [
                'id',
                'lastKnownEventId',
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
