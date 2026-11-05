'use strict';
var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');
var { composables }
    = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudyEmailTemplateId,
    
    // verifyPlaceholders // TODO i guess
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyStudyEmailTemplateId = composables.verifyOneRecord({
    collection: 'studyEmailTemplate',
    by: '/payload/_id',
    cache: true
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
