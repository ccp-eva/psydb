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
        type: `custom-record-types/set-duplicate-check-settings`,
        payload: ExactObject({
            properties: {
                id: Id(),
                fieldSettings: {
                    type: 'array',
                    items: ExactObject({
                        properties: {
                            pointer: JsonPointer(),
                            props: { type: 'object' }
                        },
                        required: [ 'pointer', 'props' ]
                    }),
                },
            },
            required: [
                'id',
                'fieldSettings',
            ]
        })
    });
}

module.exports = Schema;
