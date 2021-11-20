'use strict';

var keyRoleFlagsByResearchGroupId = (options) => {
    var {
        availableResearchGroupIds,
        rolesByResearchGroupId
    } = options;

    return (
        researchGroupIds.reduce((acc, gid) => ({
            ...acc,
            [gid]: rolesByResearchGroupId[gid].state
        }), {})
    )
}

module.exports = { keyRoleFlagsByResearchGroupId };
