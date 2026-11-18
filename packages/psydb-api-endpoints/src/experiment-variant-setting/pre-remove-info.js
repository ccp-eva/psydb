'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentVariantSetting:preRemoveInfo'
);

var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    verifyStudyAccess,
    fetchExperimentVariantSettingPreRemoveInfo,
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
    
    var { id: settingId } = params;
    
    var settingRecord = await (
        db.collection('experimentVariantSetting').findOne({
            _id: settingId
        })
    );

    await verifyStudyAccess({
        db, permissions,
        studyId: settingRecord.studyId,
        action: 'write',
    });

    var info = await fetchExperimentVariantSettingPreRemoveInfo({
        db, settingRecord
    });

    context.body = ResponseBody({ data: info });
    await next();
}

module.exports = preRemoveInfo;
