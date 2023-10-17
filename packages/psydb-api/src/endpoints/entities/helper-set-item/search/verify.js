'use strict';
var { ApiError } = require('@mpieva/psydb-api-lib');

var verifyAllowedAndPlausible = async (context) => {
    var { permissions } = context;

    //if (!permissions.hasCollectionFlag('helperSetItem', 'read')) {
    //    throw new ApiError(403);
    //}
}

module.exports = verifyAllowedAndPlausible;
