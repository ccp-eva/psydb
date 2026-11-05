'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var { Study } = require('@mpieva/psydb-schema-creators');

var Schema = async (context) => {
    var schema = ClosedObject({
        '_id': ForeignId({ collection: 'study' }),
        'props': Study.State(),
    });
    
    return schema;
}

module.exports = Schema;
