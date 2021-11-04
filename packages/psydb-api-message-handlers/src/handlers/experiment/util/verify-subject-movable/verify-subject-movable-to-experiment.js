'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var {
    checkSubjectInExperiment,
} = require('@mpieva/psydb-common-verify-helpers');

var { ApiError } = require('@mpieva/psydb-api-lib');
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

    // TODO: we need to actually remove the subject from
    // the source experiment or else we can move back the subject
    var isSubjectInTarget = checkSubjectInExperiment({
        subjectId,
        experimentRecord: targetExperimentRecord
    });
    if (isSubjectInTarget) {
        throw new ApiError(400, 'SubjectExistsInTarget');
    }
};

module.exports = verifySubjectMovableToExperiment;
