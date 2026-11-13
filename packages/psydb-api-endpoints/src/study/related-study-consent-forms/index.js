'use strict';
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { ApiError, ResponseBody, validateOrThrow } = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');

var relatedStudyConsentFormsEndpoint = async (context, next) => {
    var { db, request, permissions } = context;

    var canReadConsentForm = (
        permissions.hasCollectionFlag('studyConsentForm', 'read')
        || permissions.hasLabOperationFlag('inhouse', 'canObtainConsent')
    );
    if (!canReadConsentForm) {
        throw new ApiError(403);
    }

    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    validateOrThrow({
        schema: BodySchema(),
        payload: request.body,
    });

    var { studyId, subjectType = undefined } = request.body;

    var records = await aggregateToArray({ db, studyConsentForm: [
        { $match: {
            'studyId': studyId,
            'state.isEnabled': true,
            ...(subjectType && { subjectType })
        }},
        { $project: {
            'studyId': true,
            'subjectType': true,
            'state.internalName': true,
            'state.title': true,
        }}
    ]});

    context.body = ResponseBody({
        data: { records }
    });

    await next();
}

module.exports = relatedStudyConsentFormsEndpoint;
