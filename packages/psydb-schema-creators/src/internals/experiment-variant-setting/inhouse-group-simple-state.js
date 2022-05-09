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

var InhouseGroupSimpleState = () => {
    return ExactObject({
        properties: {
            subjectTypeKey: CustomRecordTypeKey({
                title: 'Proband:innentyp',
                collection: 'subject',
            }),
            locations: DefaultArray({
                title: 'Räumlichkeiten',
                items: ExactObject({
                    systemType: 'TypedInhouseLocationId',
                    properties: {
                        // FIXME: InhouseLocationTypeKey
                        customRecordTypeKey: CustomRecordTypeKey({
                            title: 'Typ',
                            collection: 'location',
                        }),
                        locationId: ForeignId({
                            title: 'Raum',
                            collection: 'location',
                            // TODO: record type $data ??
                        })
                    },
                    required: [
                        'customRecordTypeKey',
                        'locationId',
                    ]
                })
            })
        },
        required: [
            'subjectTypeKey',
            'locations',
        ]
    });
}

module.exports = InhouseGroupSimpleState;
