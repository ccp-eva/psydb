'use strict';
var inline = require('@cdxoo/inline-text');

var {
    ExactObject,
    CustomRecordTypeKey,
    Integer,
    DefaultArray,
    JsonPointer,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var ApestudiesWKPRCDefaultState = () => {
    return ExactObject({
        properties: {
            subjectTypeKey: CustomRecordTypeKey({
                title: 'Proband:innentyp',
                collection: 'subject',
            }),
            locationTypeKeys: DefaultArray({
                title: 'Locations',
                items: CustomRecordTypeKey({
                    collection: 'location',
                }),
                minItems: 1,
            })
        },
        required: [
            'subjectTypeKey',
            'locationTypeKeys',
        ]
    });
}

module.exports = ApestudiesWKPRCDefaultState;
