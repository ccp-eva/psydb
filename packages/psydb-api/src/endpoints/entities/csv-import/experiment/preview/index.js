'use strict';
var {
    ApiError,
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateOne
} = require('@mpieva/psydb-api-lib');

var {
    EVApeCognitionCSV,
    CSVImportError
} = require('@mpieva/psydb-api-lib/csv-import-utils');

var Schema = require('./schema');

var preview = async (context, next) => {
    var { db, permissions, request } = context;
    
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
        aggregateOne({ db, file: [
            { $match: { _id: fileId }},
        ]})
    );

    try {
        var parsedLines = EVApeCognition.parseLines({
            data: file.blob.toString()
        });
        var matchedData = await EVApeCognition.matchData({
            db, parsedLines
        })
        var preparedObjects = EVApeCognitionCSV.makeObjects({
            matchedData, skipEmptyValues: true
        });
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

    context.body = ResponseBody({ data: {
        preparedObjects,
    }});

    await next();
}

module.exports = preview;
