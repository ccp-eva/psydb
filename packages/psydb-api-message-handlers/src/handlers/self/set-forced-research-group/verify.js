'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');
var { ApiError } = require('@mpieva/psydb-api-lib');

var verifyAllowedAndPlausible = async (context) => {
    var { db, permissions, message } = context;

    var {
        hasRootAccess,
        availableResearchGroupIds
    } = permissions;

    var { researchGroupId } = message.payload;
   
    if (researchGroupId) {
        var hasGroup = !!availableResearchGroupIds.find(allowedId => (
            compareIds(allowedId, researchGroupId)
        ))
        if (!hasGroup && !hasRootAccess) {
            throw new ApiError(403, {
                apiStatus: 'ResearchGroupNotAllowed',
            })
        }
    }
}

module.exports = { verifyAllowedAndPlausible }
