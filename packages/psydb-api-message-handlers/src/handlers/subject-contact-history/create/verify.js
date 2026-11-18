'use strict';
var { compose, ApiError } = require('@mpieva/psydb-api-lib');
var { verifyOneRecord } = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifySubjectRecord,
    verifyPersonnelRecord,
]);

var verifyPermissions = async (context, next) => {
    var { permissions } = context;
    if (!permissions.hasCollectionFlag('subject', 'write')) {
        throw new ApiError(403);
    }

    await next();
}

var verifySubjectRecord = verifyOneRecord({
    collection: 'subject',
    by: '/payload/subjectId',
    cache: true,
});

var verifyPersonnelRecord = async (context, next) => {
    var { message } = context;
    var { contactedBy } = message.payload.props;

    if (contactedBy) {
        await _verifyPersonnelRecord(context, next);
    }
    else {
        await next();
    }
}

var _verifyPersonnelRecord = verifyOneRecord({
    collection: 'personnel',
    by: '/payload/props/contactedBy',
});

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
