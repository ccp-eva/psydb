'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var checkLabOperationAccess = (options) => {
    var {
        permissions,
        labOperationType,
        flag,
        researchGroupId,
    } = options;

    var {
        hasRootAccess,
        forcedResearchGroupId,
        researchGroupIdsByFlag
    } = permissions;

    var isAllowed = false;
    if (hasRootAccess && !forcedResearchGroupId) {
        isAllowed = true;
    }
    else if (!hasRootAccess || hasRootAccess && forcedResearchGroupId) {
        var allowedIds = (
            researchGroupIdsByFlag.labOperation[labOperationType][flag]
        );

        var isAllowed = !!allowedIds.find(id => {
            return compareIds(id, researchGroupId)
        });
    }

    return isAllowed;
}

module.exports = checkLabOperationAccess;
