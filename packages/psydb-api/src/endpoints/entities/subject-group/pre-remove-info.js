'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:subjectGroup:preRemoveInfo'
);

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    verifyRecordAccess,
    fetchSubjectGroupPreRemoveInfo,
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
    
    var { id: subjectGroupId } = params;
    
    var subjectGroupRecord = await (
        db.collection('subjectGroup').findOne({
            _id: subjectGroupId
        })
    );

    await verifyRecordAccess({
        db, permissions,
        collection: 'subjectGroup',
        recordId: subjectGroupId,
        action: 'write',
    });

    var info = await fetchSubjectGroupPreRemoveInfo({
        db, subjectGroupRecord
    });

    context.body = ResponseBody({ data: info });
    await next();
}

module.exports = { preRemoveInfo };
