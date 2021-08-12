'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedExperimentData'
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
    debug('__START__')
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

    debug('fetch experiment record');
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
        debug('=> 404');
        throw new ApiError(404, 'NoAccessibleExperimentRecordFound');
    }

    debug('fetch experiment record schema');
    var experimentRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'experiment',
        recordType: experimentType,
        fullSchema: true
    });

    debug('fetch experiment related labels');
    var experimentRelated = await fetchRelatedLabels({
        db,
        data: experimentRecord,
        schema: experimentRecordSchema,
    });

    debug('fetch study record');
    var studyRecord = await (
        db.collection('study').findOne({
            _id: experimentRecord.state.studyId
        }, { projection: { events: false }})
    );

    debug('fetch study record schema');
    var studyRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'study',
        recordType: studyRecord.type,
        fullSchema: true
    });

    debug('fetch study related labels');
    var studyRelated = await fetchRelatedLabels({
        db,
        data: studyRecord,
        schema: studyRecordSchema,
    });

    debug('fetch location display data');
    var locationData = await fetchRecordDisplayDataById({
        db,
        collection: 'location',
        recordType: experimentRecord.state.locationRecordType,
        id: experimentRecord.state.locationId,
    });

    debug('fetch operator team record');
    var experimentOperatorTeamRecord = await (
        db.collection('experimentOperatorTeam').findOne({
            _id: experimentRecord.state.experimentOperatorTeamId
        }, { projection: { events: false }})
    );

    debug('fetch operator team record schema');
    var teamRecordSchema = await createSchemaForRecordType({
        db,
        collectionName: 'experimentOperatorTeam',
        recordType: experimentOperatorTeamRecord.type,
        fullSchema: true
    });

    debug('fetch operator team record related labels');
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

    debug('iterating contained subject types...');
    var subjectDataByType = {};
    for (var typeKey of subjectTypeKeys) {
        debug('subject type key:', typeKey);

        debug('fetch subject type record');
        var customRecordTypeData = await fetchOneCustomRecordType({
            db,
            collection: 'subject',
            type: typeKey,
        });

        var recordLabelDefinition = (
            customRecordTypeData.state.recordLabelDefinition
        );

        debug('gathering subject type display field data');
        var {
            displayFields,
            availableDisplayFieldData,
        } = await gatherDisplayFieldsForRecordType({
            prefetched: customRecordTypeData,
        });

        debug('fetching subject records');
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
                'scientific.state.comment': true,
                'scientific.state.internals.participatedInStudies': true,
            }
            //offset,
            //limit
        });

        debug('fetching subject related labels');
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
    debug('...done iterating contained subject types');


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

    debug('__NEXT__')
    await next();
};

module.exports = extendedExperimentData;
