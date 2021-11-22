'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');
var { checkLabOperationAccess } = require('@mpieva/psydb-common-lib');

var ApiError = require('./api-error');

var verifyLabOperationAccess = (options) => {
    var {
        permissions,
        labOperationType,
        flag,
        flags,
        researchGroupId,
        checkJoin = 'and'
    } = options;

    if (flag) {
        flags = [ flag ];
    }

    var isAllowed = checkLabOperationAccess(options);

    if (!isAllowed) {
        throw new ApiError(403, {
            apiStatus: 'LabOperationAccessDenied',
            data: {
                flags,
                checkJoin,
                researchGroupId,
                labOperationType
            }
        })
    }
}

module.exports = verifyLabOperationAccess;
