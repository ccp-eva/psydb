'use strict';
var {
    compose,
    ApiError,
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateOne,
    findOne_RAW
} = require('@mpieva/psydb-api-lib');

var {
    EVApeCognitionCSV,
    CSVImportError
} = require('@mpieva/psydb-api-lib/csv-import-utils');

var Schema = require('./schema');

var preview = async (context, next) => {
    var { db, permissions, request, timezone } = context;
    
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
        locationId,
        studyId,
        labOperatorIds
    } = request.body;

    var file = await withRetracedErrors(
        findOne_RAW({ db, file: { _id: fileId }})
    );

    var study = await withRetracedErrors(
        findOne_RAW({ db, study: { _id: studyId }})
    );
    
    var location = await withRetracedErrors(
        findOne_RAW({ db, location: { _id: locationId }})
    );

    var pipelineOutput = await EVApeCognitionCSV.runPipeline({
        db,
        csvLines: file.blob.toString(),

        subjectType,
        study,
        location,
        labOperators: labOperatorIds.map(it => ({ _id: it})), // FIXME
        timezone
    });

    var { matchedData, preparedObjects, transformed } = pipelineOutput;
    
    var previewRecords = transformed.experiments.map(it => ({
        ...it.record,
        csvImportId: null,
    }));

    context.body = ResponseBody({ data: {
        matchedData,
        preparedObjects,
        previewRecords,
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
