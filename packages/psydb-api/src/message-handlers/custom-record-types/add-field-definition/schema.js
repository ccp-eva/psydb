'use strict';
var {
    ExactObject,
    Id,
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
                props: CustomTypeFieldDefinition(),
            },
            required: [
                'id',
                'props',
            ]
        })
    });
}

module.exports = Schema;
