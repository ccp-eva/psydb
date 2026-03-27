'use strict';
var { ApiError, compose } = require('@mpieva/psydb-api-lib');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyGeneralPermissions,
    verifyStudy,
    verifyRecordAccess,
]);

var verifyStudy = verifyOneRecord({
    collection: 'study',
    by: '/payload/_id',
    cache: true
});

var verifyGeneralPermissions = async (context, next) => {
    var { db, permissions } = context;
    
    if (!permissions.hasCollectionFlag('study', 'write')) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyRecordAccess = async (context, next) => {
    var { db, cache, permissions } = context;
    var { study: record } = cache.get();

    var ok = permissions.hasRecordAccess({
        record, collection: 'study', level: 'write'
    });

    if (!ok) {
        throw new ApiError(403)
    }
    
    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
