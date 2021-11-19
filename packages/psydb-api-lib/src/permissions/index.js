'use strict';
var debug = require('debug')('psydb:api:lib:permissions');

var { compareIds } = require('@mpieva/psydb-core-utils');


var Permissions = ({
    hasRootAccess,
    rolesByResearchGroupId,

    allowedResearchGroupIds,
    forcedResearchGroupId,
}) => {

    var permissions = {
        hasRootAccess,
        ...setupResearchGroupIds({
            hasRootAccess,
            available: allowedResearchGroupIds,
            forced: forcedResearchGroupId,
        }),

        byResearchGroupId: allowedResearchGroupIds.reduce((acc, gid) => ({
            ...acc,
            [gid]: ResearchGroupPermissions({
                systemRole: rolesByResearchGroupId[gid]
            })
        }), {}),
    };

    /*for (var gid of allowedResearchGroupIds) {
        var systemRole = rolesByResearchGroupId[gid]
        permissions.byResearchGroupId[gid] = ResearchGroupPermissions({
            systemRole, 
        });
    }*/

    return permissions;
}

var ResearchGroupPermissions = ({
    systemRole
}) => {
    var permissions = systemRole.state;
    return permissions;
}

var setupResearchGroupIds = (options) => {
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
        allowedResearchGroupIds: available,
        projectedResearchGroupIds: (
            forced
            ? [ forced ]
            : available
        ),
        forcedResearchGroupId: forced,
    };
}

module.exports = Permissions;
