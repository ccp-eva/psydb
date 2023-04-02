'use strict';
var {
    ExactObject,
    Id,
    IdentifierString,
    SaneString,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
    CustomTypeLabelDefinition,
    CustomTypeRecordCollection
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/create`,
        payload: ExactObject({
            properties: {
                id: Id(),
                
                collection: CustomTypeRecordCollection(),
                type: IdentifierString({ minLength: 1 }),

                props: ExactObject({
                    properties: {
                        label: SaneString({ minLength: 1 }),
                    },
                    required: [
                        'label',
                    ]
                })
            },
            required: [
                'collection',
                'type',
                'props',
            ]
        })
    });
}

module.exports = Schema;
