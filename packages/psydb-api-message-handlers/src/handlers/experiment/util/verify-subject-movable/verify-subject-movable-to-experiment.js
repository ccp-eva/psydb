'use strict';
var {
    ApiError,
    compareIds
} = require('@mpieva/psydb-api-lib');

var checkSubjectInExperiment = require('./check-subject-in-experiment');
var verifySourceExperiment = require('./verify-source-experiment');

var verifySubjectMovableToExperiment = async (context, options) => {
    var { db } = context;
    var {
        subjectId,
        sourceExperimentRecord,
        targetExperimentRecord,
    } = options;
    
    var {
        type: sourceType,
        state: sourceState,
    } = sourceExperimentRecord;

    var {
        type: targetType,
        state: targetState,
    } = targetExperimentRecord;
   
    verifySourceExperiment(options);

    if (sourceType !== targetType) {
        throw new ApiError(400, 'ExperimentTypeMismatch');
    }

    var isSameStudy = compareIds(
        sourceState.studyId,
        targetState.studyId,
    )
    if (!isSameStudy) {
        throw new ApiError(400, 'StudiesDontMatch');
    }

    var isSubjectInTarget = checkSubjectInExperiment({
        subjectId,
        experimentRecord: targetExperimentRecord
    });
    if (isSubjectInTarget) {
        throw new ApiError(400, 'SubjectExistsInTarget');
    }
};

module.exports = verifySubjectMovableToExperiment;
