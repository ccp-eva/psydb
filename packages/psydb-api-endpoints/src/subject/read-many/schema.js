'use strict';
var { ExactObject, IdList } = require('@mpieva/psydb-schema-fields');

var Schema = () => {
    var schema = ExactObject({
        properties: {
            'ids': IdList({ collection: 'subject' }),
        },
        required: [ 'ids' ]
    });

    return schema;
}

module.exports = Schema; 
