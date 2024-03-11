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

    Address
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),

        'sequenceNumber': DefaultInt({ anonKeep: true }),
        'isDummy': DefaultBool({ anonKeep: true }),

        'state': ClosedObject({
            'address': Address(),
            'name': AnyString({ anonT: 'name' }),
            'shorthand': AnyString({ anonT: 'shorthand' }),
            'description': AnyString({ anonT: 'description' }),

            'locationTypes': CRTRefList(),
            'studyTypes': CRTRefList(),
            'subjectTypes':CRTRefList(),

            'helperSetIds': DefaultArray({
                items: MongoFk({
                    collection: 'helperSet', anonKeep: true 
                })
            }),

            'labMethods': DefaultArray({
                items: AnyString({ anonKeep: true })
            }),
        })
    })

    return schema;
}

var CRTRefList = () => {
    var schema = DefaultArray({
        items: ClosedObject({
            'id': MongoFk({
                collection: 'customRecordType', anonKeep: true
            }),
            'key': AnyString({ anonKeep: true })
        })
    });

    return schema;
}

module.exports = Schema;
