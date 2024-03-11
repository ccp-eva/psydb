'use strict';
var {
    ClosedObject,
    DefaultArray,
    RohrpostMetadata,

    MongoId,
    MongoFk,
    DateTime,
    DefaultBool,
    DefaultInt,
    AnyString,
    NullValue,
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),
        'sequenceNumber': DefaultInt(),
        
        'type': AnyString({ anonKeep: true }),
        'studyId': MongoFk({ collection: 'study', anonKeep: true }),
        'experimentVariantId': MongoFk({
            collection: 'study', anonKeep: true
        }),

        'state': ClosedObject({
            'subjectTypeKey': AnyString({ anonKeep: true }),
            'subjectsPerExperiment': DefaultInt(),
            'subjectLocationFieldPointer': AnyString({ anonKeep: true }),

            'locationTypeKeys': DefaultArray({
                items: AnyString({ anonKeep: true })
            }),
            'locations': DefaultArray({
                items: ClosedObject({
                    'customRecordTypeKey': AnyString({ anonKeep: true }),
                    'locationId': MongoFk({
                        collection: 'location', anonKeep: true
                    }),
                })
            }),

            'subjectFieldRequirements': DefaultArray({
            }, { anonT: 'subjectFieldRequirements' })
        })
    })

    return schema;
}

module.exports = Schema;
