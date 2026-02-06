'use strict';
var { ClosedObject, Id } = require('@mpieva/psydb-schema-fields');

var Schema = () => {
    var schema = ClosedObject({
        'id': Id({ collection: 'subject' }),
    });

    return schema;
}

module.exports = Schema;
