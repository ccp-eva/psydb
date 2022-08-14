'use strict';
var {
    ExactObject,
    Id,
    CollectionEnum
} = require('@mpieva/psydb-schema-fields');

var ParamsSchema = () => {
    var schema = ExactObject({
        properties: {
            collectionName: CollectionEnum(),
            recordType: { type: 'string' }, // FIXME: remove, unused
            id: Id()
        },
        required: [ 'collectionName', 'id' ]
    });

    return schema;
}

module.exports = ParamsSchema;
