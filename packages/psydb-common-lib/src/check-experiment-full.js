'use strict';
var countExperimentSubjects = require('./count-experiment-subjects');

var checkExperimentFull = (options) => {
    var {
        experimentRecord,
        labProcedureSettingRecord,
    } = options;

    var { subjectTypeKey, state: settingState } = labProcedureSettingRecord;
    var { subjectsPerExperiment } = settingState;

    var count = countExperimentSubjects({
        experimentRecord,
        subjectTypeKey
    });
   
    var hasOpenSlot = count < subjectsPerExperiment;
    return !hasOpenSlot;
}

module.exports = checkExperimentFull;
