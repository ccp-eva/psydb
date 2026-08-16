'use strict';
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { validateMessageOrThrow, fetchCRTSettings }
    = require('@mpieva/psydb-api-lib');

var CoreSchema = require('./core-schema');
var FullSchema = require('./full-schema');

var validateMessage = async (context) => {
    var { db, handler, message } = context;

    var coreload = validateMessageOrThrow({
        handler, message, schema: CoreSchema(),
        performClone: true,
    });

    var { studyConsentFormId } = coreload;
    var studyConsentForm = await aggregateOne({ db, studyConsentForm: [
        { $match: { '_id': studyConsentFormId }}
    ]});

    var { subjectType } = studyConsentForm;
    var subjectCRT = await fetchCRTSettings({
        db, collectionName: 'subject', recordType: subjectType, wrap: true
    });

    validateMessageOrThrow({
        handler, message,
        schema: FullSchema({ studyConsentForm, subjectCRT }),
    });
}

module.exports = { validateMessage }
