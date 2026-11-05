'use strict';
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');
var { ApiError, compose } = require('@mpieva/psydb-api-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyGeneralPermissions,
    verifyRecord,
    verifyRecordAccess,
]);

var verifyGeneralPermissions = async (context, next) => {
    var { message, permissions } = context;

    if (!permissions.hasCollectionFlag('subject', 'remove')) {
        throw new ApiError(403);
    }

    await next();
}

var verifyRecord = verifyOneRecord({
    collection: 'subject',
    by: '/payload/_id',
    cache: true
});

var verifyRecordAccess = async (context, next) => {
    var { db, cache, permissions } = context;
    var { subject: record } = cache.get();

    var ok = permissions.hasRecordAccess({
        record, collection: 'subject', level: 'remove'
    });

    if (!ok) {
        throw new ApiError(403)
    }
    
    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
