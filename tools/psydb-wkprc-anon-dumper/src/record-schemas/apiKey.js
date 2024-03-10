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

        'personnelId': MongoFk({
            collection: 'personnel', anonKeep: true
        }),
        'apiKey': AnyString({ anonT: 'apiKey' }),

        'state': ClosedObject({
            'label': AnyString({ anonT: 'label' }),
            'isEnabled': DefaultBool({ anonKeep: true }),
            'isEnable': DefaultBool({ anonKeep: true }),
            'permissions': ClosedObject({}, {
                anonT: 'permissionsObject'
            }),
        })
    })

    return schema;
}

module.exports = Schema;
