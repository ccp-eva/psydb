'use strict';
var {
    MinObject, IdentifierString
} = require('@mpieva/psydb-schema-fields');

var CoreBodySchema = () => {
    var schema = MinObject({
        'recordType': IdentifierString(), // FIXME: enum
    });

    return schema;
}

module.exports = CoreBodySchema;
