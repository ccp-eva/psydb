'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');
var {
    checkSubjectInExperiment
} = require('@mpieva/psydb-common-verify-helpers');


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
