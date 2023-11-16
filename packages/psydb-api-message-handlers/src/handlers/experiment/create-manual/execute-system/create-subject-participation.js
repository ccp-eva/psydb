'use strict';
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');

var {
    createBaseParticipationItems,
    addLocationAndOperators,
    addApestudiesWKPRCDefaultExtraData,
    dispatchUpdates
} = require('./create-subject-participation-sub-stages');

var createSubjectParticipation = compose([
    createBaseParticipationItems,

    switchComposition({
        by: '/message/payload/labMethod',
        branches: {
            'inhouse': [
                addLocationAndOperators,
            ],
            'online-video-call': [
                addLocationAndOperators,
            ],
            'away-team': [
                addLocationAndOperators,
            ],
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

module.exports = createSubjectParticipation;
