'use strict';

var keyRoleFlagsByResearchGroupId = (options) => {
    var {
        availableResearchGroupIds,
        rolesByResearchGroupId
    } = options;

    return (
        availableResearchGroupIds.reduce((acc, gid) => {
            var role = rolesByResearchGroupId[gid];
            return {
                ...acc,
                [gid]: role ? role.state : {}
            }
        }, {})
    )
}

module.exports = { keyRoleFlagsByResearchGroupId };
