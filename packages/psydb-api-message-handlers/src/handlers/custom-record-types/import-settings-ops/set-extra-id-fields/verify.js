'use strict';
var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyCRTRecord,
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyCRTRecord = verifyOneRecord({
    collection: 'customRecordType',
    by: '/payload/_id',
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
