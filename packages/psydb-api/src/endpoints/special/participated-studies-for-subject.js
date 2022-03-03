'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:participatedStudiesForSubject'
);

var {
    groupBy,
    keyBy,
    compareIds
} = require('@mpieva/psydb-core-utils');

var {
    ApiError,
    ResponseBody,

    validateOrThrow,
    verifySubjectAccess,

    createSchemaForRecordType,
    fetchRelatedLabelsForMany,
    fetchOneCustomRecordType,
    createRecordLabel,
    gatherDisplayFieldsForRecordType,
    fetchRecordById,
    fetchRecordsByFilter
} = require('@mpieva/psydb-api-lib');

var {
    ProjectDisplayFieldsStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var {
    ExactObject,
    ForeignId,
} = require('@mpieva/psydb-schema-fields');

var RequestParamsSchema = () => ExactObject({
    properties: {
        subjectId: ForeignId({ collection: 'subject' }),
    },
    required: [
        'subjectId',
    ]
});

var participatedStudiesForSubject = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    validateOrThrow({
        schema: RequestParamsSchema(),
        payload: params
    })

    var {
        subjectId,
    } = params;


    await verifySubjectAccess({
        db,
        permissions,
        subjectId,
        action: 'read',
        additionalFlags: [ 'canReadParticipation' ]
    });

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

    //console.dir(subjectRecord, { depth: null });

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

    var crt = await fetchOneCustomRecordType({
        db,
        collection: 'study',
        type: studyType,
    });

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
        recordLabelDefinition: crt.state.recordLabelDefinition,
        displayFields,
        additionalPreprocessStages: [
            { $match: {
                _id: { $in: studyIds }
            }}
        ],
        additionalProjection: {
            'type': true,
        },
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
