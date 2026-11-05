'use strict';
var { MinObject, ForeignId, IdentifierString }
    = require('@mpieva/psydb-schema-fields');

var CoreSchema = () => {
    var schema = MinObject({
        'id': ForeignId({ collection: 'customRecordType' }),
        'key': IdentifierString(),
    });

    return schema;
}

module.exports = CoreSchema;
