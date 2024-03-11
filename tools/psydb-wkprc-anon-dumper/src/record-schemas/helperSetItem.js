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

        'setId': MongoFk({ collection: 'helperSet', anonKeep: true }),
        'state': ClosedObject({
            'label': AnyString({ anonT: 'label' }),
        })
    })

    return schema;
}

module.exports = Schema;
