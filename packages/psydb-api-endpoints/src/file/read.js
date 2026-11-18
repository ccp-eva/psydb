'use strict';
var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateOne
} = require('@mpieva/psydb-api-lib');

var { ClosedObject, ForeignId } = require('@mpieva/psydb-schema-fields');
var Schema = () => {
    var schema = ClosedObject({
        fileId: ForeignId({ collection: 'file' }),
    });

    return schema;
}

var read = async (context, next) => {
    var { db, permissions, request } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { fileId } = request.body;

    var record = await withRetracedErrors(
        aggregateOne({ db, file: [
            { $match: { _id: fileId }},
            { $project: { blob: false }},
            { $addFields: { blob: '__OMITTED__' }}
        ]})
    );

    context.body = ResponseBody({ data: {
        record, related: {}
    }});

    await next();
}

module.exports = read;
