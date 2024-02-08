'use strict';
var {
    ClosedObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var createSchema = (context) => {
    var schema = ClosedObject({
        researchGroupId: ForeignId({
            collection: 'researchGroup',
            isNullable: true,
        }),
    });

    return schema;
}

module.exports = createSchema;
