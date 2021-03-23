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
                type: IdentifierString(),

                props: ExactObject({
                    properties: {
                        label: SaneString(),
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
