'use strict';
var VerifyError = require('../verify-error');
var checkSubjectInExperiment = require('../check-subject-in-experiment');


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
        throw new VerifyError('SubjectMissingInSource');
    }
}

module.exports = verifySourceExperiment;
