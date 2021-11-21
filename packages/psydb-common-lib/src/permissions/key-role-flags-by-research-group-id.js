'use strict';

var keyRoleFlagsByResearchGroupId = (options) => {
    var {
        availableResearchGroupIds,
        rolesByResearchGroupId
    } = options;

    return (
        availableResearchGroupIds.reduce((acc, gid) => ({
            ...acc,
            [gid]: rolesByResearchGroupId[gid].state
        }), {})
    )
}

module.exports = { keyRoleFlagsByResearchGroupId };
