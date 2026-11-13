'use strict';
var { compose, switchComposition, ApiError }
    = require('@mpieva/psydb-api-lib');
var { verifyOneRecord, verifyOneCRT }
    = require('@mpieva/psydb-api-message-handler-lib');

var compose_verifyAllowedAndPlausible = () => compose([
    verifyPermissions,
    verifyStudyConsentFormRecord,
    verifyStudyConsentFormIsEnabled,
    verifySubjectRecord,
    verifyConsentObtainedByRecord,
    verifyElementValues,
]);

var verifyPermissions = async (context, next) => {
    var { permissions } = context;
    
    if (!permissions.hasLabOperationFlag('inhouse', 'canObtainConsent')) {
        throw new ApiError(403)
    }
    
    await next();
}

var verifyStudyConsentFormRecord = verifyOneRecord({
    collection: 'studyConsentForm',
    by: '/payload/studyConsentFormId',
    cache: true
});

var verifyStudyConsentFormIsEnabled = async (context, next) => {
    var { cache } = context;
    var { studyConsentForm } = cache.get();

    if (!studyConsentForm.state.isEnabled) {
        throw new ApiError(409, 'StudyConsentFormIsDisabled');
    }

    await next();
}

var verifySubjectRecord = verifyOneRecord({
    collection: 'subject',
    by: '/payload/subjectId',
    cache: true
});

var verifyConsentObtainedByRecord = verifyOneRecord({
    collection: 'personnel',
    by: '/payload/consentObtainedBy',
});

// TODO: verify labOperatorIds

var verifyElementValues = async (context) => {
    var { message, cache } = context;

    // TODO
}

module.exports = {
    verifyAllowedAndPlausible: compose_verifyAllowedAndPlausible()
}
