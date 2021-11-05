'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var VerifyError = require('../verify-error');
var checkSubjectInExperiment = require('../check-subject-in-experiment');

var verifySourceExperiment = require('./verify-source-experiment');

var verifySubjectMovableToExperiment = (options) => {
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
        throw new VerifyError('ExperimentTypeMismatch');
    }

    var isSameStudy = compareIds(
        sourceState.studyId,
        targetState.studyId,
    )
    if (!isSameStudy) {
        throw new VerifyError('StudiesDontMatch');
    }

    // TODO: we need to actually remove the subject from
    // the source experiment or else we can move back the subject
    var isSubjectInTarget = checkSubjectInExperiment({
        subjectId,
        experimentRecord: targetExperimentRecord
    });
    if (isSubjectInTarget) {
        throw new VerifyError('SubjectExistsInTarget');
    }
};

module.exports = verifySubjectMovableToExperiment;
