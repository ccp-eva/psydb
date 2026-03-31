'use strict';
var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    //verifyPermissions,
    verifyStudyConsentDocRecord,
]);

// XXX
//var verifyPermissions = async (context, next) => {
//    var { db, permissions, message } = context;
//    
//    if (!permissions.isRoot()) {
//        throw new ApiError(403)
//    }
//    
//    await next();
//}

var verifyStudyConsentDocRecord = verifyOneRecord({
    collection: 'studyConsentDoc',
    by: '/payload/_id',
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
