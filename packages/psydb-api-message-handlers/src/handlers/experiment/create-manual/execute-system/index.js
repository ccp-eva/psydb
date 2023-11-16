'use strict';
var { createId } = require('@mpieva/psydb-api-lib');

var createExperimentRecord = require('./create-experiment-record');
var createSubjectParticipation = require('./create-subject-participation');

var executeSystemEvents = async (context) => {
    var { labMethod } = context.message.payload;

    await createExperimentRecord(context);
    await createSubjectParticipation(context);
}

module.exports = { executeSystemEvents }
