'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentVariant:preRemoveInfo'
);

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    verifyStudyAccess,
    fetchExperimentVariantPreRemoveInfo,
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

    validateOrThrow({
        schema: RequestParamsSchema(),
        payload: params
    });
    
    var { id: variantId } = params;
    
    var variantRecord = await (
        db.collection('experimentVariant').findOne({
            _id: variantId
        })
    );

    await verifyStudyAccess({
        db, permissions,
        studyId: variantRecord.studyId,
        action: 'write',
    });

    var info = await fetchExperimentVariantPreRemoveInfo({
        db, variantRecord
    });

    context.body = ResponseBody({ data: info });
    await next();
}

module.exports = preRemoveInfo;
