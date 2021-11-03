'use strict';
var {
    ApiError,
    compareIds
} = require('@mpieva/psydb-api-lib');

var verifySubjectMovable = async (context, options) => {
    var { db } = context;
    var {
        subjectId,
        sourceExperimentRecord,
        targetExperimentRecord,
    } = options;

    if (targetExperimentRecord) {
        await verifySubjectMovableToExperiment(context, options);
    }
    else {
        await verifySubjectMovableToReservation(context, options);
    }

}

var checkSubjectInExperiment = (options) => {
    var {
        subjectId,
        experimentRecord,
    } = options;
    
    var subjectExists = (
        experimentRecord.state.subjectData.find(it => (
            compareIds(it.subjectId, subjectId)
        ))
    )
    
    return subjectExists;
}

var verifySourceExperiment = (options) => {
    var {
        subjectId,
        sourceExperimentRecord,
    } = options;
    
    var isSubjectInSource = checkSubjectInExperiment({
        subjectId,
        experimentRecord: sourceExperimentRecord
    })
    if (!isSubjectInSource) {
        throw new ApiError(400, 'SubjectMissingInSource');
    }
}

var verifySubjectMovableToExperiment = async () => {
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
        experimentRecord: sourceExperimentRecord
    });
    if (isSubjectInTarget) {
        throw new ApiError(400, 'SubjectExistsInTarget');
    }
};

var verifySubjectMovableToReservation = async () => {};

module.exports = verifySubjectMovable;
