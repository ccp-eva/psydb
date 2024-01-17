'use strict';
var {
    compose, switchComposition,
    ApiError
} = require('@mpieva/psydb-api-lib');

var {
    verifyOneRecord
} = require('@mpieva/psydb-api-message-handler-lib');


var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudy,
    verifySubjects,
]);

var verifyPermissions = async (context, next) => {
    var { permissions } = context;

    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    await next();
}

var verifySubjects = async (context, next) => {
    var { db, message, cache } = context;
    var { subjectIds } = message.payload;

    // TODO: check allowed for online survey
    // TODO: check if that thing ha semail
    // TODO: check hidden/removed
    // TODO: check participated maybe

    await next();
}

var verifyStudy = verifyOneRecord({
    collection: 'study',
    by: '/payload/studyId',
    cache: true
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
