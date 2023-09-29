'use strict';
var {
    ExactObject,
    OpenObject,
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
                        displayNameI18N: OpenObject({
                            de: SaneString()
                        }),
                    },
                    required: [
                        'label',
                        'displayNameI18N',
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
