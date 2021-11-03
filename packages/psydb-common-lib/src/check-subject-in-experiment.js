'use strict';
var compareIds = require('./compare-ids');

// FIXME: should we use haystack needle
// aka checkExperimentHasSubject??
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

module.exports = checkSubjectInExperiment;
