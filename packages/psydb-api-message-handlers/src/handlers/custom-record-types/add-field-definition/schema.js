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
                subChannelKey: {
                    type: 'string',
                    enum: [ 'scientific', 'gdpr' ]
                }, 
                props: {
                    type: 'object',
                    properties: {
                        key: IdentifierString({ minLength: 1 }),
                        type: {
                            type: 'string',
                            enum: [
                                'SaneString',
                                'Address',
                                'HelperSetItemId',
                                'HelperSetItemIdList',
                                'EmailList',
                                'PhoneWithTypeList',
                                'PhoneList',
                                'ForeignId',
                                'ForeignIdList',
                                'FullText',
                                'DateTime',
                                'DateOnlyServerSide',
                                'BiologicalGender',
                                'DefaultBool',
                                'ExtBool',
                                'GeoCoords',
                                'ListOfObjects',

                                'Integer',
                            ],
                        },
                        displayName: SaneString({ minLength: 1 })
                    },
                    required: [ 'type', 'key', 'displayName' ]
                },
            },
            required: [
                'id',
                'props',
            ]
        })
    });
}

module.exports = Schema;
