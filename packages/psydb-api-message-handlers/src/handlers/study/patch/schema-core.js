'use strict';
var { MinObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var SchemaCore = () => {
    var schema = MinObject({
        '_id': ForeignId({ collection: 'study' }),
    });
    
    return schema;
}

module.exports = SchemaCore;
