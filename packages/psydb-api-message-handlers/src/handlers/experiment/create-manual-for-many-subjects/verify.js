'use strict';
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');

// FIXME: this is just because of hoisting essentailly
// NOTE: we could wrap compose in function i.e. () => compose([ .... ])
// and check in message handler for
// stage.constructor.name === 'AsyncFunction'
// ? its a stage diretly just use
// : ita wrapper function that retruns a stage call it and execute the return
// but this would be a nasty hack
var {
    verifyStudy,
    verifySubjects,
    verifyLocation,
    verifySubjectGroup,
    verifyTeamOrOperators,
} = require('./verify-sub-stages');

var verifyAllowedAndPlausible = compose([
    verifyStudy,
    verifySubjects,

    switchComposition({
        by: '/message/payload/labMethod',
        branches: {
            'apestudies-wkprc-default': [
                verifyLocation,
                verifySubjectGroup,
                verifyTeamOrOperators,
            ],
            'manual-only-participation': [
                verifyLocation,
                verifyTeamOrOperators,
            ],
            'online-survey': [],
        }
    })
]);

module.exports = { verifyAllowedAndPlausible }
