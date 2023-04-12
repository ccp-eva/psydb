'use strict';
var debug = require('debug')('psydb:api:endpoints:metadata');
var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    //fetchCRTSettings,
} = require('@mpieva/psydb-api-lib');

var { ExactObject, Id } = require('@mpieva/psydb-schema-fields');

var ParamsSchema = () => ExactObject({
    properties: { id: Id() },
    required: [ 'id' ]
});

var getCRTSettingsById = async (context, next) => {
    var { db, params } = context;

    validateOrThrow({
        schema: ParamsSchema(),
        payload: params
    });
    
    var { id } = params;

    var data = await db.collection('customRecordType').findOne({
        _id: id,
        'state.internals.isRemoved': { $ne: true }
    });
    if (!data) {
        throw new ApiError(404, 'NotFound');
    }
    context.body = ResponseBody({ data });

    await next();
}

module.exports = getCRTSettingsById;
