'use strict';
var { only } = require('@mpieva/psydb-core-utils');
var {
    compose,
    ApiError,
    ResponseBody,
    validateOrThrow,
    withRetracedErrors,
    aggregateOne,
    fetchRecordLabelsManual,

    findOne_RAW
} = require('@mpieva/psydb-api-lib');

var {
    ExperimentCSV,
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

    validateOrThrow({ schema: Schema(), payload: request.body });
    var { fileId, subjectType, locationType, studyId } = request.body;

    var file = await withRetracedErrors(
        findOne_RAW({ db, file: { _id: fileId }})
    );

    var study = await withRetracedErrors(
        findOne_RAW({ db, study: { _id: studyId }})
    );
    
    var pipelineOutput = await (
        ExperimentCSV.ManualOnlyParticipation.runPipeline({
            db,
            csvLines: file.blob.toString(),

            subjectType,
            locationType,
            study,
            timezone: i18n.timezone
        })
    );

    var { pipelineData, transformed } = pipelineOutput;
    
    var previewRecords = transformed.experiments.map(it => ({
        ...it.record,
        csvImportId: null,
    }));

    var relatedIds = { subject: [], location: [], personnel: [] };
    for (var it of previewRecords) {
        var {
            selectedSubjectIds,
            locationId, experimentOperatorIds
        } = it.state;
        
        relatedIds.subject.push(...selectedSubjectIds);
        relatedIds.location.push(locationId);
        relatedIds.personnel.push(...experimentOperatorIds);
    }
    var related = {
        records: await fetchRecordLabelsManual(db, relatedIds, i18n)
    };

    context.body = ResponseBody({ data: {
        pipelineData,
        previewRecords,
        related,
    }});

    await next();
}

var withCSVImportErrorHandling = () => async (context, next) => {
    try {
        await next();
    }
    catch (e) {
        if (e instanceof CSVImportError) {
            throw new ApiError(409, { apiStatus: e.name, data: {
                message: e.message
            }});
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
