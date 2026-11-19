'use strict';
var {
    ExactObject,
    IdList,
    SimpleMongodbProjection
} = require('@mpieva/psydb-schema-fields');

var Schema = () => {
    var schema = ExactObject({
        properties: {
            ids: IdList({ collection: 'subject' }),
            projection: SimpleMongodbProjection(),
        },
        required: [ 'ids' ]
    });

    return schema;
}

module.exports = Schema;
