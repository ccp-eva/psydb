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
    verifyExperimentState,
    verifySubjects,
    verifyLocation,
    verifySubjectGroup,
    verifyLabOperators,
} = require('./verify-sub-stages');

var verifyAllowedAndPlausible = compose([
    verifyExperimentState,
    verifySubjects,

    switchComposition({
        // XXX does cache work with switchComposition?
        // => no; see ticket
        by: '/cache/_internal/labMethod',
        branches: {
            'inhouse': [
                verifyLocation,
                verifyLabOperators,
            ],
            'online-video-call': [
                verifyLocation,
                verifyLabOperators,
            ],
            'away-team': [
                //verifyLocation,
                verifyLabOperators,
            ],
            'apestudies-wkprc-default': [
                verifyLocation,
                verifySubjectGroup,
                verifyLabOperators,
            ],
            'manual-only-participation': [
                verifyLocation,
                verifyLabOperators,
            ],
            'online-survey': []
        }
    })
]);

module.exports = { verifyAllowedAndPlausible }
