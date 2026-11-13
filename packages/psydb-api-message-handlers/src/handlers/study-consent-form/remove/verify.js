'use strict';
var { compose, ApiError } = require('@mpieva/psydb-api-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudyConsentFormRecord,
    verifyIsUnused,
]);

var verifyPermissions = async (context, next) => {
    var { permissions } = context;
    
    if (!permissions.hasCollectionFlag('studyConsentForm', 'remove')) {
        throw new ApiError(403);
    }
    
    await next();
}

var verifyStudyConsentFormRecord = async (context, next) => {
    var { db, message } = context;
    var { studyConsentFormId } = message.payload;

    var record = await db.collection('studyConsentForm').findOne({
        '_id': studyConsentFormId,
    }, { projection: { _id: true }});

    if (!record) {
        throw new ApiError(404);
    }

    await next();
}

var verifyIsUnused = async (context, next) => {
    var { db, message } = context;
    var { studyConsentFormId } = message.payload;

    var studyConsentDocCount = await (
        db.collection('studyConsentDoc')
        .countDocuments({ 'studyConsentFormId': studyConsentFormId })
    );
    if (studyConsentDocCount > 0) {
        throw new ApiError(409, {
            apiStatus: 'StudyConsentFormIsUsed',
            data: { studyConsentDocCount }
        });
    }

    await next();
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
