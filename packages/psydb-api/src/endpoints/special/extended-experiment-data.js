'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:experimentOperatorTeamsForStudy'
);

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');
var compareIds = require('@mpieva/psydb-api-lib/src/compare-ids');

var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');
var createSchemaForRecordType = require('@mpieva/psydb-api-lib/src/create-schema-for-record-type');
var fetchRelatedLabels = require('@mpieva/psydb-api-lib/src/fetch-related-labels');

var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');
var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var fetchRecordDisplayDataById = require('@mpieva/psydb-api-lib/src/fetch-record-display-data-by-id');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var groupBy = require('@mpieva/psydb-common-lib/src/group-by');

var extendedExperimentData = async (context, next) => {
    var { 
        db,
        permissions,
        params,
    } = context;

    var {
        experimentType,
        experimentId,
    } = params;

    // TODO: check params

    var experimentRecord = await fetchRecordById({
        db,
        collectionName: 'experiment',
        recordType: experimentType,
        id: experimentId,
        permissions,
    });

    // FIXME: question is should we 404 or 403 when access is denied?
    // well 404 for now and treat it as if it wasnt found kinda
    if (!experimentRecord) {
        throw new ApiError(404, 'NoAccessibleExperimentRecordFound');
    }

    var experimentRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'experiment',
        recordType: experimentType,
        fullSchema: true
    });

    var experimentRelated = await fetchRelatedLabels({
        db,
        data: experimentRecord,
        schema: experimentRecordSchema,
    });

    var studyRecord = await (
        db.collection('study').findOne({
            _id: experimentRecord.state.studyId
        }, { projection: { events: false }})
    );

    var studyRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'study',
        recordType: studyRecord.type,
        fullSchema: true
    });

    var studyRelated = await fetchRelatedLabels({
        db,
        data: studyRecord,
        schema: studyRecordSchema,
    });

    var locationData = await fetchRecordDisplayDataById({
        db,
        collection: 'location',
        recordType: experimentRecord.state.locationRecordType,
        id: experimentRecord.state.locationId,
    });

    var experimentOperatorTeamRecord = await (
        db.collection('experimentOperatorTeam').findOne({
            _id: experimentRecord.state.experimentOperatorTeamId
        }, { projection: { events: false }})
    );

    var teamRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'experimentOperatorTeam',
        recordType: experimentOperatorTeamRecord.type,
        fullSchema: true
    });

    var experimentOperatorTeamRelated = await fetchRelatedLabels({
        db,
        data: experimentOperatorTeamRecord,
        schema: teamRecordSchema,
    });

    var subjectTypeKeys = (
        studyRecord.state.selectionSettingsBySubjectType.map(it => (
            it.subjectRecordType
        ))
    );

    var subjectDataByType = {};
    for (var typeKey of subjectTypeKeys) {

        var customRecordTypeData = await fetchOneCustomRecordType({
            db,
            collection: 'subject',
            type: typeKey,
        });

        var recordLabelDefinition = (
            customRecordTypeData.state.recordLabelDefinition
        );

        var {
            displayFields,
            availableDisplayFieldData,
        } = await gatherDisplayFieldsForRecordType({
            prefetched: customRecordTypeData,
        });

        var records = await fetchRecordsByFilter({
            db,
            permissions,
            collectionName: 'subject',
            recordType: typeKey,
            displayFields,
            recordLabelDefinition,
            additionalPreprocessStages: [
                { $match: {
                    _id: { $in: experimentRecord.state.selectedSubjectIds }
                }}
            ],
            additionalProjection: {
                'scientific.state.comment': true
            }
            //offset,
            //limit
        });

        var related = await fetchRelatedLabelsForMany({
            db,
            collectionName: 'subject',
            recordType: typeKey,
            records,
        });
        
        var availableDisplayFieldDataByPointer = keyBy({
            items: availableDisplayFieldData,
            byProp: 'dataPointer'
        });

        var displayFieldData = displayFields.map(it => ({
            ...availableDisplayFieldDataByPointer[it.dataPointer],
            dataPointer: it.dataPointer,
        }))

        subjectDataByType[typeKey] = {
            records,
            displayFieldData,
            ...related
        };
    }


    context.body = ResponseBody({
        data: {
            experimentData: {
                record: experimentRecord,
                ...experimentRelated,
            },
            experimentOperatorTeamData: {
                record: experimentOperatorTeamRecord,
                ...experimentOperatorTeamRelated
            },
            studyData: {
                record: studyRecord,
                ...studyRelated,
            },
            locationData,
            subjectDataByType,
        },
    });

    await next();
};

module.exports = extendedExperimentData;
