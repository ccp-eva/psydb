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
    
    Address,
    SystemPermissions
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),

        //'sequenceNumber': DefaultInt(), // FIXME
        'subjectType': AnyString({ anonKeep: true }),

        'state': ClosedObject({
            'name': AnyString({ anonT: 'name' }),

            'locationType': AnyString({ anonKeep: true }),
            'locationId': MongoFk({
                collection: 'location', anonKeep: true 
            }),

            'internals': ClosedObject({}, { anonT: 'internals' }),
            'comment': AnyString({ anonT: 'comment' }),
            'systemPermissions': SystemPermissions(),
        })
    })

    return schema;
}

module.exports = Schema;
