'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');

var verifyLabOperationAccess = (options) => {
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

    if (!hasRootAccess && !forcedResearchGroupId) {
        var allowedIds = researchGroupIdsByFlag[flag];

        var isAllowed = !!allowedIds.find(id => {
            return compareIds(id, researchGroupId)
        });

        if (!isAllowed) {
            throw new ApiError(403, {
                apiStatus: 'LabOperationAccessDenied',
                data: {
                    flag,
                    researchGroupId,
                    labOperationType
                }
            })
        }
    }
}

module.exports = verifyLabOperationAccss;
