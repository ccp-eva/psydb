'use strict';
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { ResponseBody, validateOrThrow } = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');

var relatedStudyConsentFormsEndpoint = async (context, next) => {
    var { db, request, permissions } = context;

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
