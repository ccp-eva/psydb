'use strict';
var {
    ApiError,
    ResponseBody,
    withRetracedErrors,
    validateOrThrow
} = require('@mpieva/psydb-api-lib');

var Schema = require('./schema');


var read = async (context, next) => {
    var { db, request, permissions } = context;

    // TODO: permissions
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });

    var { id } = request.body;

    var record = await withRetracedErrors(
        db.collection('subject').findOne(
            { _id: id },
            // XXX
            { projection: { 'type': true }}
        )
    );
    if (!record) {
        throw new ApiError(404)
    }

    context.body = ResponseBody({
        data: { record }
    });

    await next();
}

module.exports = read;
