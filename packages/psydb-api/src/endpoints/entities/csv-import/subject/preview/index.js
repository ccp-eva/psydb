'use strict';
var { only } = require('@mpieva/psydb-core-utils');
var { sift, fixRelated } = require('@mpieva/psydb-common-lib');
var {
    compose,
    ApiError,
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateOne,
    fetchCRTSettings,
    fetchRelatedLabelsForMany,

    findOne_RAW
} = require('@mpieva/psydb-api-lib');

var {
    SubjectDefaultCSV,
    CSVImportError
} = require('@mpieva/psydb-api-lib/csv-import-utils');

var Schema = require('./schema');

var preview = async (context, next) => {
    var { db, permissions, request } = context;
    
    var i18n = only({ from: context, keys: [
        'language', 'locale', 'timezone'
    ]});
    
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    validateOrThrow({
        schema: Schema(),
        payload: request.body
    });
    
    var {
        csvImporter = 'wkprc-evapecognition', 
        fileId,
        subjectType,
        researchGroupId,
    } = request.body;

    var file = await withRetracedErrors(
        findOne_RAW({ db, file: { _id: fileId }})
    );

    var researchGroup = await withRetracedErrors(
        findOne_RAW({ db, researchGroup: { _id: researchGroupId }})
    );

    var subjectCRT = await fetchCRTSettings({
        db, collectionName: 'subject', recordType: subjectType,
        wrap: true
    });
    
    var pipelineOutput = await SubjectDefaultCSV.runPipeline({
        db,
        csvLines: file.blob.toString(),

        subjectCRT,
        researchGroup,
        timezone: i18n.timezone
    });

    var { matchedData, preparedObjects, transformed } = pipelineOutput;
    
    var previewRecords = transformed.subjects.map(it => ({
        ...it.record,
        csvImportId: null,
    }));

    var related = fixRelated(
        await fetchRelatedLabelsForMany({
            db, collectionName: 'subject', records: previewRecords,
            ...i18n
        })
    );

    context.body = ResponseBody({ data: {
        matchedData,
        preparedObjects,
        previewRecords,
        related,
        displayFields: (
            subjectCRT.augmentedDisplayFields('table').filter(sift({
                key: { $nin: [ '_id', '_sequenceNumber', '_onlineId' ]}
            }))
        ),
    }});

    await next();
}

var withCSVImportErrorHandling = () => async (context, next) => {
    try {
        await next();
    }
    catch (e) {
        if (e instanceof CSVImportError) {
            // TODO
            console.log(e);
            console.log(e.getInfo())
            throw new ApiError(409, 'cannot parse csv contents');
        }
        else {
            throw e
        }
    }
}

module.exports = compose([
    withCSVImportErrorHandling(),
    preview
]);
