'use strict';
var { compareIds } = require('@mpieva/psydb-core-utils');
var { checkLabOperationAccess } = require('@mpieva/psydb-common-lib');

var ApiError = require('./api-error');

var verifyLabOperationAccess = (options) => {
    var {
        permissions,
        labOperationType,
        labOperationTypes,
        flag,
        flags,
        researchGroupId,
        checkJoin = 'and',
        matchTypes,
        matchFlags,
    } = options;

    if (labOperationType) {
        labOperationTypes = [ labOperationType ];
    }

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
                matchTypes,
                matchFlags,
                researchGroupId,
                labOperationTypes
            }
        })
    }
}

module.exports = verifyLabOperationAccess;
