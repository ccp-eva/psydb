'use strict';
var { compose, ApiError } = require('@mpieva/psydb-api-lib');

// NOTE: consent forms copy the template contents on creation and do not
// reference the template, so templates are never in use
var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudyConsentTemplateRecord,
]);

// NOTE: there are no system role flags for consent templates;
// create and patch are root only as well
var verifyPermissions = async (context, next) => {
    var { permissions } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }
    
    await next();
}

var verifyStudyConsentTemplateRecord = async (context, next) => {
    var { db, message } = context;
    var { studyConsentTemplateId } = message.payload;

    var record = await db.collection('studyConsentTemplate').findOne({
        '_id': studyConsentTemplateId,
    }, { projection: { _id: true }});

    if (!record) {
        throw new ApiError(404);
    }

    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
