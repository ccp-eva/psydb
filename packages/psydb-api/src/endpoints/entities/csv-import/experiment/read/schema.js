'use strict';
var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');

// XXX: stub
var Schema = () => {
    var schema = ClosedObject({
        id: ForeignId({ collection: 'csvImport' })
    });
    return schema;
}

module.exports = Schema;
