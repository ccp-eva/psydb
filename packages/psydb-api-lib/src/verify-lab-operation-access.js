'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');
var { checkLabOperationAccess } = require('@mpieva/psydb-common-lib');

var verifyLabOperationAccess = (options) => {
    var {
        permissions,
        labOperationType,
        flag,
        researchGroupId,
    } = options;

    var isAllowed = checkLabOperationAccess(options);

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

module.exports = verifyLabOperationAccess;
