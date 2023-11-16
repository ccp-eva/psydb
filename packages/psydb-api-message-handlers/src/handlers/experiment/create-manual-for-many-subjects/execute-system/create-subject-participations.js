'use strict';
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');

var {
    createBaseParticipationItems,
    addLocationAndOperators,
    addApestudiesWKPRCDefaultExtraData,
    dispatchUpdates
} = require('./create-subject-participations-sub-stages');

var createSubjectParticipations = compose([
    createBaseParticipationItems,

    switchComposition({
        by: '/message/payload/labMethod',
        branches: {
            'apestudies-wkprc-default': [
                addLocationAndOperators,
                addApestudiesWKPRCDefaultExtraData,
            ],
            'manual-only-participation': [
                addLocationAndOperators,
            ],
            'online-survey': [],
        },
    }),

    dispatchUpdates
])

module.exports = createSubjectParticipations;
