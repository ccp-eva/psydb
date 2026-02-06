'use strict';
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    
    // TODO
    //verifySubjects,
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }
    //if (!permissions.hasFlag('canImportSubjects')) {
    //    throw new ApiError(403);
    //}

    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
