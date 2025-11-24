'use strict';
var debug = require('../debug-helper')('list');

var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { ResponseBody, validateOrThrow, fetchCRTSettings }
    = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');


var readEndpoint = async (context, next) => {
    var { db, request, permissions } = context;
    
    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    validateOrThrow({
        schema: BodySchema(),
        payload: request.body,
    });
    
    var { studyConsentDocId } = request.body;
    
    var record = await aggregateOne({ db, studyConsentDoc: {
        '_id': studyConsentDocId
    }});

    var subjectCRT = await fetchCRTSettings({
        db, collectionName: 'subject', recordType: record.subjectType
    });

    context.body = ResponseBody({
        data: {
            record, related: {},
            subjectCRT,
        },
    });
}

module.exports = readEndpoint;
