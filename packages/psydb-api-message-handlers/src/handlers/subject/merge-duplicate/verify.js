'use strict';
var { compose, switchComposition } = require('@mpieva/psydb-api-lib');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    
    verifySourceSubject,
    verifyTargetSubject,
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

var verifySourceSubject = verifyOneRecord({
    collection: 'subject',
    by: '/payload/sourceSubjectId',
    cache: true, as: 'sourceSubject'
});

var verifyTargetSubject = verifyOneRecord({
    collection: 'subject',
    by: '/payload/targetSubjectId',
    cache: true, as: 'targetSubject'
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
