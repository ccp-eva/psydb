'use strict';
var debug = require('debug')('psydb:api:lib:permissions');

var { compareIds } = require('@mpieva/psydb-core-utils');

var checkAllPermissionAcls = require('./check-all-permission-acls'),
    endpointAcls = require('./endpoint-acls'),
    messageTypeAcls = require('./message-type-acls');

var ResearchGroupPermissions = ({
    systemRole
}) => {
    var permissions = {
        ...systemRole.state,
    }

    return permissions;
}

var mergeFlagsMax = (union, systemRole) => {
    var clone = { ...union };
    for (var flag of Object.keys(systemRole)) {
        union[flag] = union[flag] || systemRole.state[flag];
    }
    return clone;
}

var Permissions = ({
    hasRootAccess,
    rolesByResearchGroupId,
    allowedResearchGroupIds,
    forcedResearchGroupId,
}) => {
    var permissions = {
        hasRootAccess,
        allowedResearchGroupIds,
        forcedResearchGroupId: undefined,
        projectedResearchGroupIds: allowedResearchGroupIds,
        byResearchGroupId: {},
    };

    if (forcedResearchGroupId) {
        var isForcedRGAllowed = !!allowedResearchGroupIds.find(allowed => (
            compareIds(allowed, forcedResearchGroupId)
        ))
        if (isForcedRGAllowed || hasRootAccess) {
            permissions.forcedResearchGroupId = forcedResearchGroupId;
        }

        if (permissions.forcedResearchGroupId) {
            permissions.projectedResearchGroupIds = [
                permissions.forcedResearchGroupId
            ];
        }
    }

    // merged flag is true if any systemrole sets it to true
    var unionMax = {};

    for (var gid of allowedResearchGroupIds) {
        var systemRole = rolesByResearchGroupId[gid]
        permissions.byResearchGroupId[gid] = ResearchGroupPermissions({
            systemRole, 
        });
        unionMax = mergeFlagsMax(unionMax, systemRole);
    }

    /*permissions.canUseMessageType = (type) => {
        type = type || '';
        
        var isAllowed = checkAllPermissionAcls({
            permissionAclMap: messageTypeAcls,
            permissionFlags: systemRole.state,
            isAllowed: (regex) => (
                regex.test(type)
            )
        });

        debug(`message type ${type} allowed: ${isAllowed}`);
        return isAllowed;
    };*/

    permissions.canAccessEndpoint = (endpoint) => {
        endpoint = endpoint || '';

        var isAllowed = false;

        if (hasRootAccess) {
            isAllowed = true;
        }

        // TODO
        
        /*var isAllowed = checkAllPermissionAcls({
            permissionAclMap: endpointAcls,
            permissionFlags: systemRole.state,
            isAllowed: (regex) => (
                regex.test(endpoint)
            )
        });*/

        debug(`endpoint "${endpoint}" allowed: ${isAllowed}`);
        return isAllowed;
    }

    permissions.canCreateHelperSet = () => {
        return (
            hasRootAccess
            || unionMax.hasResearchGroupAdminAccess
        );
    }

    permissions.canCreateHelperSetItem = () => {
        return (
            hasRootAccess
            || unionMax.hasResearchGroupAdminAccess
        );
    }

    //permissions.canAccessRecords = ({ collection, type, subtype }) => {
    //}

    return permissions;
}

module.exports = Permissions;

//var recordAcl = {
//    hasRootAccess: [
//        { collection: /.*/, type: /.*/, subtype: /.*/ },
//    ],
//    hasResearchGroupAdminAccess: [
//        { collection: /.*/, type: /.*/, subtype: /.*/ },
//    ],
//    canSelectSubjectsForTesting: [
//        { collection: /.*/, type: /.*/, subtype: /.*/ },
//    ],
//}
