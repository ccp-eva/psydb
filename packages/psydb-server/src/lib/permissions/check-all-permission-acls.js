'use strict';
var checkAllPermissionAcls = ({
    permissionAclMap,
    permissionFlags,
    isAllowed
}) => {
    for (var key of Object.keys(permissionFlags)) {
        var enabled = permissionFlags[key],
            permissionAcl = permissionAclMap[key];

        if (enabled && permissionAcl) {
            for (var it of permissionAcl) {
                if (isAllowed(it)) {
                    return true;
                }
            }
        }
    }

    return false;
}

module.exports = checkAllPermissionAcls;
