'use strict';
var { ApiError, compose } = require('@mpieva/psydb-api-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    //verifyCollectionAccess('study', 'write'), of collection/level
    verifyGeneralPermissions,
]);

var verifyGeneralPermissions = async (context, next) => {
    var { message, permissions } = context;

    if (!permissions.hasCollectionFlag('study', 'write')) {
        throw new ApiError(403);
    }

    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
