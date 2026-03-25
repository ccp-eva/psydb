'use strict';
var { OpenObject, ForeignId } = require('@mpieva/psydb-schema-fields');

var SchemaCore = () => {
    var schema = OpenObject({
        '_id': ForeignId({ collection: 'study' }),
    });
    
    return schema;
}

module.exports = SchemaCore;
