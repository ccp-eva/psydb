'use strict';
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { ApiError, compose } = require('@mpieva/psydb-api-lib');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudyRecord,
    verifyStudyConfirmation,
]);

var verifyPermissions = async (context, next) => {
    var { db, permissions, message } = context;
    if (!permissions.isRoot()) {
        throw new ApiError(403)
    }

    await next();
}

var verifyStudyRecord = verifyOneRecord({
    collection: 'study',
    by: '/payload/studyId',
    cache: true
});

var verifyStudyConfirmation = async (context, next) => {
    var { message, cache } = context;
    var { confirmation } = message;
    var { study } = cache.get();

    if (study.state.shorthand !== confirmation) {
        throw new Error(409, 'InvalidStudyConfirmation')
    }

    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
