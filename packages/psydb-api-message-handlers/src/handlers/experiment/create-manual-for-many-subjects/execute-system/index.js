'use strict';
var { createId } = require('@mpieva/psydb-api-lib');

var createExperimentRecords = require('./create-experiment-records');
var createSubjectParticipations = require('./create-subject-participations');

var executeSystemEvents = async (context) => {
    var { labMethod } = context.message.payload;

    await createExperimentRecords(context);
    await createSubjectParticipations(context);
}

module.exports = { executeSystemEvents }
