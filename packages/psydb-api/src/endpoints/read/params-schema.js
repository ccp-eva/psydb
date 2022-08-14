'use strict';
var {
    ExactObject,
    Id,
    CollectionEnum
} = require('@mpieva/psydb-schema-fields');

var ParamsSchema = () => {
    var schema = ExactObject({
        properties: {
            //collectionName: CollectionEnum(),
            collectionName: { type: 'string' }, // FIXME helperSetItem
            recordType: { type: 'string' }, // FIXME: remove, unused
            id: Id()
        },
        required: [ 'collectionName', 'id' ]
    });

    return schema;
}

module.exports = ParamsSchema;
