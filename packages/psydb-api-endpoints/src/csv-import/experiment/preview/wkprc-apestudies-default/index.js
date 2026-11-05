'use strict';
var { aggregateOne } = require('@mpieva/psydb-mongo-adapter');
var {
    compose,
    ApiError,
    ResponseBody,
    validateOrThrow,
    fetchRecordLabelsManual,
    fetchCRTSettings
} = require('@mpieva/psydb-api-lib');

var {
    ExperimentCSV,
    CSVImportError
} = require('@mpieva/psydb-api-lib/csv-import-utils');

var Schema = require('./schema');

var preview = async (context, next) => {
    var { db, permissions, request, i18n } = context;
    
    if (!permissions.isRoot()) {
        throw new ApiError(403);
    }

    validateOrThrow({ schema: Schema(), payload: request.body });
    var {
        fileId, subjectType, studyId,
        skipPossibleDuplicates = false,
    } = request.body;

    var file = await aggregateOne({ db, file: { _id: fileId }});
    var study = await aggregateOne({ db, study: { _id: studyId }});
    
    var subjectCRT = await fetchCRTSettings({
        db, subject: subjectType, wrap: true
    });

    var pipelineOutput = await (
        ExperimentCSV.WKPRCApestudiesDefault.runPipeline({
            db,
            csvLines: file.blob.toString(),
            skipPossibleDuplicates,

            subjectCRT,
            study,
            i18n,
        })
    );

    var { pipelineData, todo, possibleDuplicates } = pipelineOutput;
    
    var previewRecords = todo.experiments.map(it => ({
        ...it.record,
        csvImportId: null,
    }));

    var relatedIds = {
        subject: [],
        subjectGroup: [],
        location: [],
        personnel: [],
    };
    for (var it of previewRecords) {
        var {
            subjectGroupId, selectedSubjectIds,
            locationId, experimentOperatorIds
        } = it.state;
        
        relatedIds.subject.push(...selectedSubjectIds);
        relatedIds.subjectGroup.push(subjectGroupId);
        relatedIds.location.push(locationId);
        relatedIds.personnel.push(...experimentOperatorIds);
    }
    var related = {
        records: await fetchRecordLabelsManual(db, relatedIds, i18n)
    };

    context.body = ResponseBody({ data: {
        pipelineData,
        previewRecords,
        possibleDuplicatesCount: possibleDuplicates.experiments.length,
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
