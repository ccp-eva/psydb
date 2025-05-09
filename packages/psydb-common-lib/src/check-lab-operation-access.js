'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var checkLabOperationAccess = (options) => {
    var {
        permissions,
        labOperationType,
        labOperationTypes,
        flag,
        flags,

        matchTypes = 'every',
        matchFlags = 'every',

        checkJoin = 'and',
        researchGroupId,
    } = options;

    if (!['and', 'or'].includes(checkJoin)) {
        throw new Error(`unknown checkJoin value "${checkJoin}"`);
    }

    if (labOperationType) {
        labOperationTypes = [ labOperationType ];
    }

    if (flag) {
        flags = [ flag ];
    }

    var x = permissions.hasLabOpsFlags({
        types: labOperationTypes,
        flags,
        matchTypes: matchTypes || checkJoin === 'or' ? 'some' : 'every',
        matchFlags: matchFlags || checkJoin === 'or' ? 'some' : 'every',
        // XXX: shouldnt researchGroupId be passed here??
    })

    //console.log({ x });

    return x;

    // TODO: remove fter verifying identical behavior
    //var {
    //    hasRootAccess,
    //    forcedResearchGroupId,
    //    researchGroupIdsByFlag
    //} = permissions;

    //var isAllowed = false;
    //if (hasRootAccess && !forcedResearchGroupId) {
    //    isAllowed = true;
    //}
    //else if (!hasRootAccess || hasRootAccess && forcedResearchGroupId) {
    //    var flagsAllowed = 0;
    //    for (var flag of flags) {
    //        var allowedIds = (
    //            researchGroupIdsByFlag.labOperation &&
    //            researchGroupIdsByFlag.labOperation[labOperationType] &&
    //            researchGroupIdsByFlag.labOperation[labOperationType][flag]
    //        );
    //        if (allowedIds) {
    //            var currentFlagAllowed = !!allowedIds.find(id => {
    //                return compareIds(id, researchGroupId)
    //            });

    //            if (currentFlagAllowed) {
    //                flagsAllowed += 1;
    //            }
    //        }
    //    }
    //    if (checkJoin === 'and') {
    //        isAllowed = (flagsAllowed === flags.length);
    //    }
    //    if (checkJoin === 'or') {
    //        isAllowed = flagsAllowed > 0
    //    }
    //}

    //return isAllowed;
}

module.exports = checkLabOperationAccess;
