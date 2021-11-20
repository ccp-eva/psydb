'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var setupInternalResearchGroupIds = (options) => {
    var { hasRootAccess, available, forced } = options;
    
    if (forced) {
        var isForcedRGAllowed = !!available.find(availableId => (
            compareIds(availableId, forced)
        ))
        if (!(isForcedRGAllowed || hasRootAccess)) {
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
