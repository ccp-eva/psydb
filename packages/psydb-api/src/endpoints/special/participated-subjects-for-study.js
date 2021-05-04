'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:participatedSubjectsForStudy'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');
var createRecordLabel = require('@mpieva/psydb-api-lib/src/create-record-label');
var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');

var createSchemaForRecordType =
    require('@mpieva/psydb-api-lib/src/create-schema-for-record-type');

var fetchRelatedLabels = require('@mpieva/psydb-api-lib/src/fetch-related-labels');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');

var {
    ProjectDisplayFieldsStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var participatedSubjectsForStudy = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    var {
        studyId,
    } = params;

    // TODO: check params

    var studyRecord = await fetchRecordById({
        db,
        collectionName: 'study',
        id: studyId,
        permissions,
    });

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!studyRecord) {
        throw new ApiError(404, 'NoAccessibleStudyRecordFound');
    }

    //console.dir(studyRecord, { depth: null });

    var subjectRecordTypes = (
        studyRecord.state.selectionSettingsBySubjectType.map(it => (
            it.subjectRecordType
        ))
    );

    //console.log(subjectRecordTypes);

    var dataBySubjectType = {};
    for (var subjectType of subjectRecordTypes) {
        var data = await fetchParticipation({
            db,
            subjectType,
            studyId,
        });

        dataBySubjectType[subjectType] = data;
    }

    console.log(dataBySubjectType);

    /*context.body = ResponseBody({
        data: {
            records: experimentOperatorTeamRecords,
            relatedRecordLabels: relatedRecords,
        },
    });*/

    await next();
};

var fetchParticipation = async ({
    db,
    subjectType,
    studyId,
}) => {

    var {
        displayFields,
        availableDisplayFieldData,
    } = await gatherDisplayFieldsForRecordType({
        db,
        collectionName: 'subject',
        customRecordType: subjectType
    });

    var subjectRecords = await (
        db.collection('subject').aggregate([
            { $unwind: '$scientific.state.internals.participatedInStudies' },
            { $match: {
                'type': subjectType,
                'scientific.state.internals.participatedInStudies.studyId': studyId,
            }},
            StripEventsStage({
                subChannels: [ 'scientific', 'gdpr' ]
            }),
            ProjectDisplayFieldsStage({
                displayFields,
                additionalProjection: {
                    'scientific.state.internals.participatedInStudies': true 
                }
            }),
        ]).toArray()
    );

    //throw new Error();
    
    // FIXME: mongodb can do this
    // required for our schema inversion to work
    subjectRecords.forEach(it => {
        it.scientific.state.internals.participatedInStudies = [
            it.scientific.state.internals.participatedInStudies
        ];
    })

    var recordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'subject',
        recordType: subjectType,
        fullSchema: true
    });

    // FIXME: this is really hacky
    var resolveSchema = {
        type: 'object',
        properties: {
            records: {
                type: 'array',
                items: recordSchema,
            }
        }
    }

    var {
        relatedRecords,
        relatedHelperSetItems,
        relatedCustomRecordTypes,
    } = await fetchRelatedLabels({
        db,
        data: { records: subjectRecords },
        schema: resolveSchema,
    });

    var availableDisplayFieldDataByPointer = keyBy({
        items: availableDisplayFieldData,
        byProp: 'dataPointer'
    });

    var displayFieldData = displayFields.map(it => ({
        ...availableDisplayFieldDataByPointer[it.dataPointer],
        dataPointer: it.dataPointer,
    }))


    return ({
        records: subjectRecords,
        relatedRecordLabels: relatedRecords,
        relatedHelperSetItems: relatedHelperSetItems,
        relatedCustomRecordTypeLabels: relatedCustomRecordTypes,
        displayFieldData,
    })
}

module.exports = participatedSubjectsForStudy;
