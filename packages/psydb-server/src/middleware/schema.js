'use strict';
var {
    createCollectionSchemas,
    createMessageSchemas,
} = require('@mpieva/psydb-schema');

var createSchemaMiddleware = () => async (context, next) => {
    var { db } = context;

    var customSchemaRecords = await (
        db.collection('customSchema').find().toArray()
    );

    context.schemas = {
        collections: createCollectionSchemas(customSchemaRecords),
        messages: createMessageSchemas(customSchemaRecords),
    };

    await next();
}

module.exports = createSchemaMiddleware;
