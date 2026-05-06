'use strict';
var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');
var { verifyOneCRT }
    = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudyCRT,
    verifySubjectCRT,
    verifySubjectFieldPointers,
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyStudyCRT = verifyOneCRT({
    collection: 'study',
    by: '/payload/studyType',
    cache: true, as: 'studyCRT'
});

var verifySubjectCRT = verifyOneCRT({
    collection: 'subject',
    by: '/payload/subjectType',
    cache: true, as: 'subjectCRT'
});

var verifySubjectFieldPointers = async (context) => {
    var { message, cache } = context;

    // TODO
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
