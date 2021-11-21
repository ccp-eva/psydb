'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');
var {
    setupInternalResearchGroupIds,
    keyRoleFlagsByResearchGroupId,
    gatherResearchGroupIdsForCollections,
    gatherResearchGroupIdsForFlags,
} = require('./utils');

var Permissions = ({
    hasRootAccess,
    rolesByResearchGroupId,

    researchGroupIds: availableResearchGroupIds,
    forcedResearchGroupId,
}) => {

    var internal = setupInternalResearchGroupIds({
        hasRootAccess,
        availableResearchGroupIds,
        forcedResearchGroupId,
    });

    var flagsByResearchGroupId = keyRoleFlagsByResearchGroupId({
        availableResearchGroupIds,
        rolesByResearchGroupId
    });

    var researchGroupIdsByCollection = (
        gatherResearchGroupIdsForCollections({
            researchGroupIds: internal.actualIds,
            flagsByResearchGroupId,
        })
    );

    var researchGroupIdsByFlag = (
        gatherResearchGroupIdsForFlags({
            researchGroupIds: internal.actualIds,
            flagsByResearchGroupId,
        })
    )

    var permissions = {
        hasRootAccess,
        
        availableResearchGroupIds,
        researchGroupIds: internal.actualIds,
        forcedResearchGroupId: internal.actuallyForcedId,

        flagsByResearchGroupId,
        researchGroupIdsByCollection,
        researchGroupIdsByFlag,
    };

    return permissions;
}

module.exports = Permissions;
