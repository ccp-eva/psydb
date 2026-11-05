'use strict';
var debug = require('../debug-helper')('read-by-experiment-and-subject');

var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { ResponseBody, validateOrThrow, fetchCRTSettings }
    = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');


var endpoint = async (context, next) => {
    var { db, request, permissions } = context;
    
    // TODO: check headers with ajv
    var { language = 'en', locale, timezone } = request.headers;
    var i18n = { language, locale, timezone };

    validateOrThrow({
        schema: BodySchema(),
        payload: request.body,
    });
    
    var { experimentId, subjectId } = request.body;
    
    var record = await aggregateOne({ db, studyConsentDoc: {
        'experimentId': experimentId,
        'subjectId': subjectId,
    }});

    var subjectCRT = undefined;
    if (record) {
        subjectCRT = await fetchCRTSettings({
            db, collectionName: 'subject', recordType: record.subjectType
        });
    }

    context.body = ResponseBody({
        data: {
            record, related: {},
            subjectCRT,
        },
    });
}

module.exports = endpoint;
