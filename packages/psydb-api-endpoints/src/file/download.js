'use strict';
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var {
    ApiError,
    validateOrThrow,
} = require('@mpieva/psydb-api-lib');

var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var Schema = () => {
    var schema = ClosedObject({
        fileId: ForeignId({ collection: 'file' }),
    });

    return schema;
}

var download = async (context, next) => {
    var { db, permissions, request, response } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    validateOrThrow({
        schema: Schema(),
        payload: request.query
    });

    var { fileId } = request.query;

    var record = await aggregateOne({ db, file: [
        { $match: { _id: fileId }},
        { $project: { mimetype: true, blob: true }},
    ]});

    response.type = record.mimetype;
    response.body = record.blob.buffer;

    await next();
}

module.exports = download;
