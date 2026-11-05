'use strict';
var { ClosedObject, IdList } = require('@mpieva/psydb-schema-fields');

var BodySchema = () => {
    var schema = ClosedObject({
        'ids': IdList({ collection: 'personnel' }),
    });

    return schema;
}

module.exports = BodySchema; 
