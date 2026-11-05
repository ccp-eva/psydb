'use strict';
var { compose, ApiError } = require('@mpieva/psydb-api-lib');
var { composables }
    = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudyEmailMetaTemplateId,
    verifyRecordAccess,
    
    // verifyPlaceholders // TODO i guess
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    
    if (!permissions.hasCollectionFlag('studyEmailMetaTemplate', 'write')) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyStudyEmailMetaTemplateId = composables.verifyOneRecord({
    collection: 'studyEmailMetaTemplate',
    by: '/payload/_id',
    cache: true
});

var verifyRecordAccess = async (context, next) => {
    var { cache, permissions } = context;
    var { studyEmailMetaTemplate: record } = cache.get();

    var ok = permissions.hasRecordAccess({
        record, collection: 'studyEmailMetaTemplate', level: 'write'
    });

    if (!ok) {
        throw new ApiError(403)
    }
    
    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
