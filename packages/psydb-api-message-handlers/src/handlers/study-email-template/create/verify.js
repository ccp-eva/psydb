'use strict';
var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');
var { composables }
    = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudyId,
    verifySubjectCRTKey,

    // verifyPlaceholders // TODO i guess
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyStudyId = composables.verifyOneRecord({
    collection: 'study',
    by: '/payload/studyId',
    cache: true,
});

var verifySubjectCRTKey = composables.verifyOneCRT({
    collection: 'subject',
    by: '/payload/subjectType',
    cache: true, as: 'subjectCRT'
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
