'use strict';
var { intersect, compareIds } = require('@mpieva/psydb-core-utils');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');
var { ApiError, compose, switchComposition }
    = require('@mpieva/psydb-api-lib');


var compose_verifyAllowedAndPlausible = () => compose([
    verifyGeneralPermissions,
    verifyRecord,
    verifyRecordPermissions,
]);

var verifyGeneralPermissions = async (context, next) => {
    var { message, permissions } = context;

    // XXX: add canRemovePersonnel flag
    if (!permissions.hasCollectionFlag('personnel', 'write')) {
        throw new ApiError(403);
    }

    await next();
}

var verifyRecord = verifyOneRecord({
    collection: 'personnel',
    by: '/payload/_id',
    cache: true
});

var verifyRecordPermissions = async (context, next) => {
    var { db, cache, permissions } = context;
    var { personnel: record } = cache.get();

    var { systemPermissions } = record.scientific.state;
    var { accessRightsByResearchGroup } = systemPermissions;;

    var grantedForSelf = (
        permissions.getCollectionFlagIds('personnel', 'write') // XXX
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
