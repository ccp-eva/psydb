'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var Schema = async (context) => {
    var schema = ClosedObject({
        '_id': ForeignId({ collection: 'personnel' }),
    });
    return schema;
}

module.exports = Schema;
