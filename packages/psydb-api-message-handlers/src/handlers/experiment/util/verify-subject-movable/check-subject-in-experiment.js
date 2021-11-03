'use strict';
var { compareIds } = require('@mpieva/psydb-api-lib');

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
