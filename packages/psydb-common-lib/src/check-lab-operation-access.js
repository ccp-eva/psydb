'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var checkLabOperationAccess = (options) => {
    var {
        permissions,
        labOperationType,
        flag,
        flags,
        checkJoin = 'and',
        researchGroupId,
    } = options;

    if (['and', 'or'].includes(checkJoin)) {
        throw new Error(`unknown checkJoin value "${checkJoin}"`);
    }

    if (flag) {
        flags = [ flag ];
    }

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
        var flagsAllowed = 0;
        for (var flag of flags) {
            var allowedIds = (
                researchGroupIdsByFlag.labOperation[labOperationType][flag]
            );

            var currentFlagAllowed = !!allowedIds.find(id => {
                return compareIds(id, researchGroupId)
            });

            if (currentFlagAllowed) {
                flagsAllowed += 1;
            }
        }
        if (checkJoin === 'and') {
            isAllowed = (flagsAllowed === flags.length);
        }
        if (checkJoin === 'or') {
            isAllowed = flagsAllowed > 0
        }
    }

    return isAllowed;
}

module.exports = checkLabOperationAccess;
