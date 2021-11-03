'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');
var checkSubjectInExperiment = require('./check-subject-in-experiment');

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

module.exports = verifySourceExperiment;
