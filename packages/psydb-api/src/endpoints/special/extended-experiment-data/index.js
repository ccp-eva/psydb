'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:extendedExperimentData'
);

var {
    ejson,
    keyBy,
    groupBy,
    compareIds,
    convertPointerToPath,
} = require('@mpieva/psydb-core-utils');

var {
    checkLabOperationAccess,
    convertCRTRecordToSettings,
    findCRTAgeFrameField,
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    ResponseBody,
    validateOrThrow,

    createSchemaForRecordType,
    fetchOneCustomRecordType,
    fetchRecordById,
    fetchRecordsByFilter,
    gatherDisplayFieldsForRecordType,
    fetchRelatedLabels,
    fetchRelatedLabelsForMany,
    fetchRecordDisplayDataById,
} = require('@mpieva/psydb-api-lib');

var fetchOneExperimentData = require('./fetch-one-experiment-data');
var fetchOneStudyData = require('./fetch-one-study-data');
var fetchOneOpsTeamData = require('./fetch-one-ops-team-data');
var fetchLabProcedureSettingData = require('./fetch-lab-procedure-setting-data');

var {
    ExactObject,
    Id,
    //ExperimentTypeEnum,
    LabMethodKey,
} = require('@mpieva/psydb-schema-fields');

var RequestParamsSchema = () => ExactObject({
    properties: {
        experimentType: LabMethodKey(),
        experimentId: Id(),
    },
    required: [
        'experimentType',
        'experimentId',
    ]
})

var extendedExperimentData = async (context, next) => {
    debug('__START__')
    var { 
        db,
        permissions,
        params,
        timezone,
    } = context;

    validateOrThrow({
        schema: RequestParamsSchema(),
        payload: params
    });

    var {
        experimentType,
        experimentId,
    } = params;

    var experimentData = await fetchOneExperimentData({
        db,
        timezone,
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

    ////////////////////////////////////////
    var studyRecord = await (
        db.collection('study').findOne({
            _id: studyId,
        }, { projection: { 'state.researchGroupIds': true }})
    );

    // FIXME: make this into utility
    var hasAnyAccess = false;
    for (var researchGroupId of studyRecord.state.researchGroupIds) {
        var currentAllowed = checkLabOperationAccess({
            permissions,
            researchGroupId,
            labOperationType: experimentType,
            flags: [
                'canViewExperimentCalendar',
                'canPostprocessExperiments'
            ],
            checkJoin: 'or',
        });
        if (currentAllowed) {
            hasAnyAccess = true;
            break;
        }
    }
    // FIXME: add canViewExperimentDetails flag or something
    // to above check or check the availableLabMethod for the specific
    // researchGroup
    // XXX: maybe systemRoles should be below researchGroup
    if ([
        'apestudies-wkprc-default',
        'manual-only-participation-default'
    ].includes(experimentType)) {
        if (permissions.availableLabMethods.includes(experimentType)) {
            hasAnyAccess = true;
        }
    }
    if (!hasAnyAccess) {
        throw new ApiError(403, {
            apiStatus: 'LabOperationAccessDenied',
            data: {
                researchGroupIds: studyRecord.state.researchGroupIds,
                flags: [
                    'canViewExperimentCalendar',
                    'canPostprocessExperiments'
                ],
                checkJoin: 'or',
            }
        })
    }
    //////////////////////////////////7

    var studyData = await fetchOneStudyData({
        db, timezone,
        _id: studyId,
    });

    var labProcedureSettingData = await fetchLabProcedureSettingData({
        db, timezone,
        match: {
            type: experimentType,
            studyId: studyId,
        }
    });

    if (locationId) {
        debug('fetch location display data');
        var locationData = await fetchRecordDisplayDataById({
            db,
            collection: 'location',
            recordType: locationRecordType,
            id: locationId,
            permissions,
        });
    }

    if (experimentOperatorTeamId) {
        var opsTeamData = await fetchOneOpsTeamData({
            db,
            _id: experimentOperatorTeamId,
        });
    }

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

        var crtSettings = convertCRTRecordToSettings(customRecordTypeData);
        var dobFieldPointer = findCRTAgeFrameField(crtSettings);


        var recordLabelDefinition = (
            customRecordTypeData.state.recordLabelDefinition
        );

        debug('gathering subject type display field data');
        var {
            //displayFields,
            availableDisplayFieldData,
        } = await gatherDisplayFieldsForRecordType({
            prefetched: customRecordTypeData,
            permissions,
        });

        var displayFields = [
            ...crtSettings.tableDisplayFields,
            ...(
                experimentType === 'away-team'
                ? crtSettings.awayTeamSelectionRowDisplayFields
                : crtSettings.selectionRowDisplayFields
            )
        ];

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
            },
            ...(dobFieldPointer && {
                sort: {
                    path: convertPointerToPath(dobFieldPointer),
                    direction: 'asc',
                },
            }),
            //offset,
            //limit
            disablePermissionCheck: true,
            timezone,
        });

        debug('fetching subject related labels');
        var related = await fetchRelatedLabelsForMany({
            db,
            collectionName: 'subject',
            recordType: typeKey,
            records,
            timezone,
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
            ...(opsTeamData && {
                opsTeamData: {
                    record: opsTeamData.record,
                    ...opsTeamData.related,
                },
            }),
            
            locationData,
            subjectDataByType,
        },
    });

    debug('__NEXT__')
    await next();
};

module.exports = extendedExperimentData;
