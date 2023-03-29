'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:helperSetPreRemoveInfo'
);

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    verifyCollectionAccess,
    fetchHelperSetPreRemoveInfo,
} = require('@mpieva/psydb-api-lib');

var { ExactObject, Id } = require('@mpieva/psydb-schema-fields');

var RequestParamsSchema = () => ExactObject({
    properties: { id: Id() },
    required: [ 'id' ]
});

var helperSetPreRemoveInfo = async (context, next) => {
    var { 
        db,
        permissions,
        params,
        request,
    } = context;

    verifyCollectionAccess({
        permissions,
        collection: 'helperSet', flag: 'remove'
    });

    validateOrThrow({
        schema: RequestParamsSchema(),
        payload: params
    });
    
    var { id: setId } = params;
    var info = await fetchHelperSetPreRemoveInfo({ db, setId })

    context.body = ResponseBody({ data: info });
    await next();
}

module.exports = helperSetPreRemoveInfo;
