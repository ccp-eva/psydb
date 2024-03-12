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

        'subjectTypeKey': AnyString({ anonKeep: true }),
        'studyId': MongoFk({
            collection: 'study', anonKeep: true 
        }),

        'state': ClosedObject({
            'isEnabled': DefaultBool({ anonKeep: true }),
            'generalConditions': DefaultArray({
                anonT: 'generalConditions' // XXX
            }),
        })
    })

    return schema;
}

module.exports = Schema;
