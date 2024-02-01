'use strict';
var {
    ExactObject,
    OpenObject,
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
                                'SaneStringList',
                                'URLString',
                                'URLStringList',
                                'Address',
                                'HelperSetItemId',
                                'HelperSetItemIdList',
                                'EmailList',
                                'Email',
                                'PhoneWithTypeList',
                                'PhoneList',
                                'Phone',
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
                                'Lambda',
                            ],
                        },
                        displayName: SaneString({ minLength: 1 }),
                        displayNameI18N: OpenObject({
                            de: SaneString()
                        })
                    },
                    required: [
                        'type',
                        'key',
                        'displayName',
                        'displayNameI18N'
                    ]
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
