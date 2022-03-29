'use strict';
var {
    ExactObject,
    Id,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/set-form-order`,
        payload: ExactObject({
            properties: {
                id: Id(),
                formOrder: {
                    type: 'array',
                    items: JsonPointer(),
                },
            },
            required: [
                'id',
                'formOrder',
            ]
        })
    });
}

module.exports = Schema;
