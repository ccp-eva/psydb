'use strict';
var {
    ClosedObject,

    MongoId,
    MongoFk,
    DateTime,
    AnyString,
} = require('@mpieva/psydb-anon-dumper-core').schemafields;

var Schema = () => {
    var schema = ClosedObject({
        '_id': MongoId({ anonKeep: true }),
        'setAt': DateTime({ anonKeep: true }),
        'setBy': MongoFk({ collection: 'personnel', anonKeep: true }),
        'passwordHash': AnyString({ anonT: 'passwordHash' }),
    });

    return schema;
}

module.exports = Schema;
