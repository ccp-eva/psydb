'use strict'
module.exports = {
    hasRootAccess: [
        /.*/
    ],
    hasResearchGroupAdminAccess: [
        /.*/
    ],
    canSelectSubjectsForTesting: [
        /^event$/,
        /^search\-for\-testing$/,
        // TODO ...
    ],
}

