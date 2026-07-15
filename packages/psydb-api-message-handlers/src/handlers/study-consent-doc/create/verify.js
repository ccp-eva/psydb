'use strict';
var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');
var { verifyOneRecord, verifyOneCRT }
    = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    //verifyPermissions,
    verifyStudyConsentFormRecord,
    verifySubjectRecord,
    verifyElementValues,
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

var verifyStudyConsentFormRecord = verifyOneRecord({
    collection: 'studyConsentForm',
    by: '/payload/studyConsentFormId',
    cache: true
});

var verifySubjectRecord = verifyOneRecord({
    collection: 'subject',
    by: '/payload/subjectId',
    cache: true
});

// TODO: verify labOperatorIds

var verifyElementValues = async (context) => {
    var { message, cache } = context;

    // TODO
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
