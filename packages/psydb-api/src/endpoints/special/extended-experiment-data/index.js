'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedExperimentData'
);

var {
    keyBy,
    groupBy,
    compareIds,
} = require('@mpieva/psydb-core-utils');

var {
    validateOrThrow,
    ApiError,
    ResponseBody,
} = require('@mpieva/psydb-api-lib');

var fetchRecordById = require('@mpieva/psydb-api-lib/src/fetch-record-by-id');
var createSchemaForRecordType = require('@mpieva/psydb-api-lib/src/create-schema-for-record-type');
var fetchRelatedLabels = require('@mpieva/psydb-api-lib/src/fetch-related-labels');

var fetchRecordsByFilter = require('@mpieva/psydb-api-lib/src/fetch-records-by-filter');
var gatherDisplayFieldsForRecordType = require('@mpieva/psydb-api-lib/src/gather-display-fields-for-record-type');
var fetchOneCustomRecordType = require('@mpieva/psydb-api-lib/src/fetch-one-custom-record-type');
var fetchRelatedLabelsForMany = require('@mpieva/psydb-api-lib/src/fetch-related-labels-for-many');

var fetchRecordDisplayDataById = require('@mpieva/psydb-api-lib/src/fetch-record-display-data-by-id');

var fetchOneExperimentData = require('./fetch-one-experiment-data');
var fetchOneStudyData = require('./fetch-one-study-data');
var fetchOneOpsTeamData = require('./fetch-one-ops-team-data');
var fetchLabProcedureSettingData = require('./fetch-lab-procedure-setting-data');

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
    // TODO: permissions

    var experimentData = await fetchOneExperimentData({
        db,
        permissions,
        experimentType,
        experimentId,
    });

    var {
        studyId,
        locationRecordType,
        locationId,
        experimentOperatorTeamId,
        selectedSubjectIds,
    } = experimentData.record.state;

    var studyData = await fetchOneStudyData({
        db,
        _id: studyId,
    });

    var labProcedureSettingData = await fetchLabProcedureSettingData({
        db,
        match: {
            type: experimentType,
            studyId: studyId,
        }
    });

    debug('fetch location display data');
    var locationData = await fetchRecordDisplayDataById({
        db,
        collection: 'location',
        recordType: locationRecordType,
        id: locationId,
    });

    var opsTeamData = await fetchOneOpsTeamData({
        db,
        _id: experimentOperatorTeamId,
    });

    var subjectTypeKeys = labProcedureSettingData.records.map(
        it => it.state.subjectTypeKey
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
                    _id: { $in: selectedSubjectIds }
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
                record: experimentData.record,
                ...experimentData.related,
            },
            studyData: {
                record: studyData.record,
                ...studyData.related,
            },
            labProcedureSettingData: {
                records: labProcedureSettingData.records,
                ...labProcedureSettingData.related,
            },
            opsTeamData: {
                record: opsTeamData.record,
                ...opsTeamData.related,
            },
            
            locationData,
            subjectDataByType,
        },
    });

    debug('__NEXT__')
    await next();
};

module.exports = extendedExperimentData;
