'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:helperSetPreRemoveInfo'
);

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    verifyCollectionAccess,
    fetchCRTPreRemoveInfo,
} = require('@mpieva/psydb-api-lib');

var { ExactObject, Id } = require('@mpieva/psydb-schema-fields');

var RequestParamsSchema = () => ExactObject({
    properties: { id: Id() },
    required: [ 'id' ]
});

var preRemoveInfo = async (context, next) => {
    var { 
        db,
        permissions,
        params
    } = context;

    verifyCollectionAccess({
        permissions,
        collection: 'customRecordType', flag: 'remove'
    });

    validateOrThrow({
        schema: RequestParamsSchema(),
        payload: params
    });
    
    var { id: crtId } = params;
    var info = await fetchCRTPreRemoveInfo({ db, crtId })

    context.body = ResponseBody({ data: info });
    await next();
}

module.exports = preRemoveInfo;
