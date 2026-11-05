'use strict';
var { MinObject, CustomRecordTypeKey }
    = require('@mpieva/psydb-schema-fields');

var SchemaCore = (bag) => {
    var schema = MinObject({
        'type': CustomRecordTypeKey({ collection: 'study' }),
    });
    
    return schema;
}

module.exports = SchemaCore;
