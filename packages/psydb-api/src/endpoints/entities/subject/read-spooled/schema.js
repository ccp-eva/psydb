'use strict';
var { ExactObject, Id } = require('@mpieva/psydb-schema-fields');

var Schema = () => {
    var schema = ExactObject({
        properties: {
            id: Id({ collection: 'subject' }),
        },
        required: [ 'id' ]
    });

    return schema;
}

module.exports = Schema;
