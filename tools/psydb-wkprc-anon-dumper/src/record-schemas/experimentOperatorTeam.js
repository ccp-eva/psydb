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

        'studyId': MongoFk({ collection: 'study', anonKeep: true }),
        'state': ClosedObject({
            'color': AnyString({ anonKeep: true }),
            'hidden': DefaultBool({ anonKeep: true }),
            'name': AnyString({ anonT: 'name' }),

            'personnelIds': DefaultArray({
                items: MongoFk({
                    collection: 'personnel', anonKeep: true
                })
            }),
        })
    })

    return schema;
}

module.exports = Schema;
