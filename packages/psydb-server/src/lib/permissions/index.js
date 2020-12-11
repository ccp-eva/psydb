'use strict';
var debug = require('debug')('psydb:api:lib:permissions');

var checkAllPermissionAcls = require('./check-all-permission-acls'),
    endpointAcls = require('./endpoint-acls'),
    messageTypeAcls = require('./message-type-acls');

var Permissions = ({
    systemRole,
    researchGroupIds,
}) => {
    var permissions = {
        ...systemRole.state,
        allowedResearchGroupIds: researchGroupIds,
    };

    permissions.canUseMessageType = (type) => {
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
    };

    permissions.canAccessEndpoint = (endpoint) => {
        endpoint = endpoint || '';
        
        var isAllowed = checkAllPermissionAcls({
            permissionAclMap: endpointAcls,
            permissionFlags: systemRole.state,
            isAllowed: (regex) => (
                regex.test(endpoint)
            )
        });

        debug(`endpoint ${endpoint} allowed: ${isAllowed}`);
        return isAllowed;
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
