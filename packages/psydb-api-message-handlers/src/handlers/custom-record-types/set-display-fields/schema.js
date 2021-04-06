'use strict';
var {
    ExactObject,
    Id,
    EventId,
    IdentifierString,
    SaneString,
    JsonPointer,
} = require('@mpieva/psydb-schema-fields');

var {
    Message,
} = require('@mpieva/psydb-schema-helpers');

var Schema = () => {
    return Message({
        type: `custom-record-types/set-display-fields`,
        payload: ExactObject({
            properties: {
                id: Id(),
                lastKnownEventId: EventId(),
                target: {
                    type: 'string',
                    enum: [
                        'table',
                        'optionlist',
                    ]
                },
                fields: {
                    type: 'array',
                    items: {
                        oneOf: [
                            ExactObject({
                                properties: {
                                    type: { const: 'custom' },
                                    subChannelKey: {
                                        type: 'string',
                                        enum: [ 'scientific', 'gdpr' ]
                                    },
                                    fieldKey: IdentifierString(),
                                },
                                required: [
                                    'type',
                                    'fieldKey',
                                ]
                            }),
                            ExactObject({
                                properties: {
                                    type: { const: 'fixed' },
                                    dataPointer: JsonPointer(),
                                },
                                required: [
                                    'type',
                                    'fieldKey'
                                ]
                            }),
                            // TODO: static fields?
                        ]
                    },
                },
            },
            required: [
                'id',
                'lastKnownEventId',
                'target',
                'fields',
            ]
        })
    });
}

module.exports = Schema;
