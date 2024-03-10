'use strict';
var {
    ClosedObject,
    DefaultArray,
    RohrpostMetadata,

    MongoId,
    DateTime,
    DefaultBool,
    MongoFk,
    AnyString,
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schemas = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        '_rohrpostMetadata': RohrpostMetadata(),
        'scientific': ClosedObject({
            'state': ClosedObject({
                'custom': ClosedObject({
                    'name': AnyString({ anonT: 'name' })
                })
            })
        })
    })

    return schema;
}

module.exports = Schema;
