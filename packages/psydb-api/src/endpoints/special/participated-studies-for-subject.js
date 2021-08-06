'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:participatedStudiesForSubject'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var groupBy = require('@mpieva/psydb-common-lib/src/group-by');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var createSchemaForRecordType =
    require('@mpieva/psydb-api-lib/src/create-schema-for-record-type');

var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');
var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');
var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');

var createRecordLabel = require('@mpieva/psydb-api-lib/src/create-record-label');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');

var {
    ProjectDisplayFieldsStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var participatedStudiesForSubject = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    var {
        subjectId,
    } = params;

    // TODO: check params

    var subjectData = await fetchSubjectData({
        db,
        subjectId,
        permissions,
    });

    //console.log(dataBySubjectType);

    var { participatedInStudies } = (
        subjectData.record.scientific.state.internals
    );

    var {
        studyTypes,
        studyIdsByType
    } = await gatherStudyTypeGroups({
        db,
        studyIds: participatedInStudies.map(it => it.studyId),
    });

    var participationByStudyType = {};
    for (var type of studyTypes) {
        var studyData = await fetchStudyDataForType({
            db,
            studyType: type,
            studyIds: studyIdsByType[type],
        });
        
        var {
            records: studyRecords,
            ...studyTypeMetadata
        } = studyData;

        participationByStudyType[type] = {
            participation: participatedInStudies.filter(
                it => studyIdsByType[type].includes(it.studyId)
            ),
            studyRecordsById: keyBy({
                items: studyRecords,
                byProp: '_id'
            }),
            ...studyTypeMetadata,
        }
    }

    context.body = ResponseBody({
        data: {
            subjectData,
            participationByStudyType
        },
    });

    await next();
};



var gatherStudyTypeGroups = async ({ db, studyIds }) => {
    var studyShorts = await db.collection('study').aggregate([
        { $match: {
            _id: { $in: studyIds }
        }},
        { $project: { _id: true, type: true }}
    ]).toArray();

    var studyIdsByType = groupBy({
        items: studyShorts,
        byProp: 'type'
    });

    var studyTypes = Object.keys(studyIdsByType);
    for (var type of studyTypes) {
        studyIdsByType[type] = studyIdsByType[type].map(it => it._id);
    }

    return {
        studyTypes,
        studyIdsByType
    }
};

var fetchSubjectData = async ({
    db,
    subjectId,
    permissions
}) => {

    var subjectRecord = await fetchRecordById({
        db,
        collectionName: 'subject',
        id: subjectId,
        permissions,
    });

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!subjectRecord) {
        throw new ApiError(404, 'NoAccessibleStudyRecordFound');
    }

    console.dir(subjectRecord, { depth: null });

    var {
        mergedDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: 'subject',
        customRecordType: subjectRecord.type
    });

    var {
        relatedRecords,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
    } = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'subject',
        recordType: subjectRecord.type,
        records: [ subjectRecord ],
    });

    return {
        record: subjectRecord,
        relatedRecordLabels: relatedRecords,
        relatedHelperSetItems: relatedHelperSetItems,
        relatedCustomRecordTypeLabels: relatedCustomRecordTypes,
        displayFieldData: mergedDisplayFieldData,
    }
}

var fetchStudyDataForType = async ({
    db,
    studyType,
    studyIds,
}) => {

    var {
        displayFields,
        availableDisplayFieldData,
        mergedDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: 'study',
        customRecordType: studyType
    });

    var studyRecords = await fetchRecordsByFilter({
        db,
        collectionName: 'study',
        recordType: studyType,
        displayFields,
        additionalPreprocessStages: [
            { $match: {
                _id: { $in: studyIds }
            }}
        ],
        disablePermissionCheck: true,
    });

    var related = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'study',
        recordType: studyType,
        records: studyRecords,
    });

    return ({
        records: studyRecords,
        ...related,
        displayFieldData: mergedDisplayFieldData,
    })
}

module.exports = participatedStudiesForSubject;
