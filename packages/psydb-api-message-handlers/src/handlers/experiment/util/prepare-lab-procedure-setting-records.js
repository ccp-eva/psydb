'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');

var prepareLabProcedureSettingRecords = async (context, options) => {
    var {
        db,
        cache,
    } = context;

    var {
        studyId,
        labProcedureTypeKey,
        subjectTypeKey,
        shouldVerify = true,
    } = options;

    var settingRecords = await (
        db.collection('experimentVariantSetting').aggregate([
            { $match: {
                type: labProcedureTypeKey,
                studyId,
                'state.subjectTypeKey': subjectTypeKey,
            }},
            //StripEventsStage()
        ]).toArray()
    );

    if (shouldVerify) {
        if (settingRecords.length < 1) {
            throw new ApiError(400, {
                apiStatus: 'InvalidLabProcedureTypeKey'
            })
        }
    }

    cache.labProcedureSettingRecords = settingRecords
}

module.exports = prepareLabProcedureSettingRecords;
