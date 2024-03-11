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
        'isDummy': DefaultBool({ anonKeep: true }),
        'studyId': MongoFk({ collection: 'study', anonKeep: true }),

        'state': ClosedObject({
            'isEnabled': DefaultBool({ anonKeep: true }),
        })
    })

    return schema;
}

module.exports = Schema;
