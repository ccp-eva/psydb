'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var setupInternalResearchGroupIds = (options) => {
    var {
        hasRootAccess,
        availableResearchGroupIds: available,
        forcedResearchGroupId: forced,
    } = options;
    
    if (forced) {
        var isForcedRGAllowed = !!available.find(availableId => (
            compareIds(availableId, forced)
        ))
        if (!isForcedRGAllowed) {
            forced = undefined;
        }
    }

    return {
        actualIds: (
            forced
            ? [ forced ]
            : available
        ),
        actuallyForcedId: forced,
    };
}

module.exports = { setupInternalResearchGroupIds };
