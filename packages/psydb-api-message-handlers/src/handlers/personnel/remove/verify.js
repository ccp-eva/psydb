'use strict';
var { ApiError, compose } = require('@mpieva/psydb-api-lib');
var { composables } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyGeneralPermissions,
    verifyRecord,
    verifyRecordAccess,
    verifyNoReverseRefs,
]);

var verifyGeneralPermissions = async (context, next) => {
    var { message, permissions } = context;

    // XXX: add canRemovePersonnel flag
    if (!permissions.hasCollectionFlag('personnel', 'write')) {
        throw new ApiError(403);
    }

    await next();
}

var verifyRecord = composables.verifyOneRecord({
    collection: 'personnel', by: '/payload/_id', cache: true
});

var verifyRecordAccess = composables.verifyOneRecordAccess({
    collection: 'personnel',
    level: 'write', // XXX
    by: ({ cache }) => cache.get('personnel'),
});

var verifyNoReverseRefs = composables.verifyNoReverseRefs({
    collection: 'subject', by: '/payload/_id',
    excludedRefCollections: [],
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
