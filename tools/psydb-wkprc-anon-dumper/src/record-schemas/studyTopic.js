'use strict';
var {
    ClosedObject,
    DefaultArray,
    RohrpostMetadata,

    MongoId,
    MongoFk,
    MongoFkList,
    DateTime,
    DefaultBool,
    DefaultInt,
    AnyString,
    AnyStringList,
    NullValue,
    
    Address,
    SystemPermissions
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),

        'sequenceNumber': DefaultInt(),
        'isDummy': DefaultBool({ anonKeep: true }),
        'type': AnyString({ anonKeep: true }),

        'state': ClosedObject({
            'name': AnyString({ anonT: 'name' }),
            'parentId': MongoFk({
                collection: 'studyTopic', anonKeep: true 
            })
        })
    })

    return schema;
}

module.exports = Schema;
