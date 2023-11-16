'use strict';
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');

var {
    explodeSubjectsToExperimentStates,
    addLocationAndOperatorState,
    addApestudiesWKPRCDefaultExtraState,
    dispatchCreates
} = require('./create-experiment-records-sub-stages');


var createExperimentRecords = compose([
    explodeSubjectsToExperimentStates,

    switchComposition({
        by: '/message/payload/labMethod',
        branches: {
            'apestudies-wkprc-default': [
                addLocationAndOperatorState,
                addApestudiesWKPRCDefaultExtraState,
            ],
            'manual-only-participation': [
                addLocationAndOperatorState,
            ],
            'online-survey': [],
        }
    }),

    dispatchCreates,
])

module.exports = createExperimentRecords;
