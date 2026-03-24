'use strict';
var { compose, ApiError } = require('@mpieva/psydb-api-lib');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyGeneralPermissions,
    verifyStudy,
    verifyRecordPermissions,
]);

var verifyStudy = verifyOneRecord({
    collection: 'study',
    by: '/payload/_id',
    cache: true
});

var verifyGeneralPermissions = async (context, next) => {
    var { db, permissions, cache } = context;
    var { study } = cache.get();
    
    if (!permissions.hasFlag('canWriteStudies')) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyRecordPermissions = async (context, next) => {
    var { db, cache, permissions } = context;
    var { study: record } = cache.get();

    var { systemPermissions } = record.scientific.state;
    var { accessRightsByResearchGroup } = systemPermissions;;

    var grantedForSelf = (
        permissions.getFlagIds('canWriteStudies')
    )
    var allowedByRecord = (
        accessRightsByResearchGroup
        .filter(it => it.permission = 'write')
        .map(it => it.researchGroupId)
    );

    var matching = intersect(allowedByRecord, grantedForSelf, {
        compare: compareIds
    });
    if (!permissions.isRoot() && matching.length < 1) {
        throw new ApiError(403)
    }
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
