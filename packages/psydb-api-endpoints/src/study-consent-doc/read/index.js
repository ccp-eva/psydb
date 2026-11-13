'use strict';
var debug = require('../debug-helper')('read');

var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var { fetchRecordLabelsManual } = require('@mpieva/psydb-db-utils');
var { ApiError, ResponseBody, validateOrThrow, fetchCRTSettings }
    = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');


var readEndpoint = async (context, next) => {
    var { db, request, permissions, i18n } = context;

    var canReadConsentDoc = (
        permissions.hasCollectionFlag('studyConsentDoc', 'read')
        || permissions.hasLabOperationFlag('inhouse', 'canObtainConsent')
        || permissions.hasLabOperationFlag(
            'inhouse', 'canPostprocessExperiments'
        )
    );
    if (!canReadConsentDoc) {
        throw new ApiError(403);
    }
    
    // TODO: check headers with ajv
    //var { language = 'en', locale, timezone } = request.headers;
    //var i18n = { language, locale, timezone };

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

    var related = await fetchRecordLabelsManual(db, {
        'subject': [ record.subjectId ],
        'personnel': [
            ...record.labOperatorIds, record.personnelId,
            // NOTE: older docs dont have that field
            ...(record.consentObtainedBy ? [ record.consentObtainedBy ] : []),
        ],
        ...(record.experimentId && {
            'experiment': [ record.experimentId ],
        }),
    }, { ...i18n })

    context.body = ResponseBody({
        data: {
            record, related,
            subjectCRT,
        },
    });
}

module.exports = readEndpoint;
