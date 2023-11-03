'use strict';
var patchExperimentRecord = require('./patch-experiment-record');
var patchSubjectParticipation = require('./patch-subject-participation');

var executeSystemEvents = async (context) => {
    await patchExperimentRecord(context);
    await patchSubjectParticipation(context);
}

module.exports = { executeSystemEvents }
