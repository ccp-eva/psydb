'use strict';
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');

var {
    setupBaseExperimentState,
    addSubjectState,
    addLocationAndOperatorState,
    addApestudiesWKPRCDefaultExtraState,
    dispatchCreate
} = require('./create-experiment-record-sub-stages');


var createExperimentRecord = compose([
    setupBaseExperimentState,
    addSubjectState,

    switchComposition({
        by: '/message/payload/labMethod',
        branches: {
            'inhouse': [ 
                addLocationAndOperatorState,
            ],
            'online-video-call': [ 
                addLocationAndOperatorState,
            ],
            'away-team': [
                addLocationAndOperatorState,
            ],
            'apestudies-wkprc-default': [
                addLocationAndOperatorState,
                addApestudiesWKPRCDefaultExtraState,
            ],
            'manual-only-participation': [
                addLocationAndOperatorState,
            ],
            'online-survey': []
        }
    }),

    dispatchCreate
])

module.exports = createExperimentRecord;
