'use strict';
var compareIds = require('./compare-ids');

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
