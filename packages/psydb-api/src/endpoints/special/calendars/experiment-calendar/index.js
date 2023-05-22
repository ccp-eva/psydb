'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:inhouseExperimentCalendar'
);

var datefns = require('date-fns');
var enums = require('@mpieva/psydb-schema-enums');

var {
    keyBy,
    groupBy,
    compareIds,
} = require('@mpieva/psydb-core-utils');

var {
    convertCRTRecordToSettings
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    ResponseBody,
    
    validateOrThrow,
    verifyLabOperationAccess,

    convertPointerToPath,

    fetchAllCRTSettings,
    fetchOneCustomRecordType,
    gatherDisplayFieldsForRecordType,
    fetchRelatedLabelsForMany,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalAroundStage,
    MatchIntervalOverlapStage,
    StripEventsStage,
    ProjectDisplayFieldsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var RequestBodySchema = require('./request-body-schema');
var fetchStudyRecords = require('./fetch-study-records');
var getFilteredStudyIds = require('./get-filtered-study-ids');
var fetchExperimentRecords = require('./fetch-experiment-records');

var experimentCalendar = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    });

    var {
        interval,

        experimentTypes,
        subjectRecordType,
        studyId,
        researchGroupId,
        locationId,

        experimentOperatorTeamIds,
        showPast,
    } = request.body;

    if (!permissions.isRoot()) {
        showPast = false;
    }

    var { start, end } = interval;

    verifyLabOperationAccess({
        researchGroupId,
        labOperationTypes: experimentTypes,
        flag: 'canViewExperimentCalendar',
        permissions,
        
        matchTypes: 'some',
        matchFlags: 'every',
    });

    var allowedExperimentTypes = permissions.getAllowedLabOpsForFlags({
        onlyTypes: experimentTypes,
        flags: [ 'canViewExperimentCalendar' ],
        researchGroupId
    });

    // FIXME:root should have all available research groups in permissions
    var isRoot = permissions.isRoot();
    var allowedResearchGroupIds = permissions.getResearchGroupIds(
        researchGroupId ? [ researchGroupId ] : undefined
    );
    if (isRoot && researchGroupId) {
        allowedResearchGroupIds = [ researchGroupId ];
    }

    var studyRecords = await fetchStudyRecords({
        db, isRoot, allowedResearchGroupIds, studyId, start, end
    });

    // XXX: why are ids filtered but records arent??
    var filteredStudyIds = await getFilteredStudyIds({
        db, studyRecords, allowedExperimentTypes
    });
    
    var studiesById = keyBy({
        items: studyRecords,
        byProp: '_id'
    });

    var experimentRecords = await fetchExperimentRecords({
        db,
        start, end, showPast,
        allowedExperimentTypes,
        studyIds: filteredStudyIds,
        locationId,
        experimentOperatorTeamIds,
    });
 
    var experimentStudyIds = (
        experimentRecords.map(it => it.state.studyId)
    );

    var subjectIds = [];
    for (var it of experimentRecords) {
        subjectIds = [
            ...subjectIds, // XXX
            ...(
                it.state.subjectData
                .filter(it => (
                    !enums.unparticipationStatus.keys.includes(
                        it.participationStatus
                    )
                ))
                .map(it => it.subjectId)
            )
        ]
    }

    //console.log(subjectIds);

    var allCRTSettings = await fetchAllCRTSettings(db, [
        {
            collection: 'subject',
            ...(subjectRecordType && { recordType: subjectRecordType })
        },
    ], { wrap: true });

    var availableDisplayFieldsByCRT = {};
    var shownDisplayFieldsByCRT = {};
    var allSubjectRecords = [];
    for (var crtSettings of Object.values(allCRTSettings.subject)) {
        var type = crtSettings.getType();
        
        var availableDisplayFields
            = availableDisplayFieldsByCRT[type]
            = crtSettings.availableDisplayFields();

        var shownDisplayFields = shownDisplayFieldsByCRT[type] = [
            ...crtSettings.augmentedDisplayFields('table'),
            ...crtSettings.augmentedDisplayFields('selectionRow'),
        ];
        
        //console.log(availableDisplayFieldsByCRT[type]);
        //console.log(shownDisplayFields);
        
        var subjectRecords = await (
            db.collection('subject').aggregate([
                { $match: {
                    _id: { $in: subjectIds }
                }},
                StripEventsStage({ subChannels: ['gdpr', 'scientific' ]}),

                ProjectDisplayFieldsStage({
                    displayFields: shownDisplayFields,
                    additionalProjection: {
                        type: true,
                    }
                }),
            ]).toArray()
        );

        // FIXME: perf difference?
        allSubjectRecords.push(...subjectRecords);
        //allSubjectRecords = [ ...allSubjectRecords, ...subjectRecords ];
    }

    var subjectRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'subject',
        records: subjectRecords
    })

    var experimentRelated = await fetchRelatedLabelsForMany({
        db,
        collectionName: 'experiment',
        records: experimentRecords
    })

    //console.dir(subjectRelated, { depth: null });

    //console.log(experimentRecords);

    var experimentOperatorTeamRecords = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                studyId: { $in: filteredStudyIds },
                $or: [
                    { 'state.hidden': false },
                    { studyId: { $in: experimentStudyIds }},
                ]
            }},
            //{ $match: {
            //    _id: { $in: experimentRecords.map(it => (
            //        it.state.experimentOperatorTeamId
            //    ))},
            //}},
            StripEventsStage(),
        ]).toArray()
    );

    var _upcomingLabTeamExperimentCounts = await (
        fetchUpcomingLabTeamExperimentCounts({
            db,
            experimentTypes: allowedExperimentTypes,
            labTeamIds: experimentOperatorTeamRecords.map(it => it._id)
        })
    );

    for (var it of experimentOperatorTeamRecords) {
        it._upcomingExperimentCount = (
            _upcomingLabTeamExperimentCounts[it._id]
        );
    }

    var subjectRecordsById = keyBy({
        items: allSubjectRecords,
        byProp: '_id'
    })
    
    context.body = ResponseBody({
        data: {
            studyRecords,
            experimentRecords: experimentRecords.map(it => ({
                ...it,
                _canFollowUp: studiesById[it.state.studyId].state.enableFollowUpExperiments
            })),
            experimentOperatorTeamRecords,
            experimentRelated,
            subjectRecordsById,
            subjectRelated,
            subjectDisplayFieldData: (
                subjectRecordType
                ? shownDisplayFieldsByCRT[subjectRecordType]
                : shownDisplayFieldsByCRT
            ),
        },
    });

    await next();
}

var fetchUpcomingLabTeamExperimentCounts = async (bag) => {
    var { db, experimentTypes, labTeamIds } = bag;
    var now = new Date();
    var start = datefns.startOfDay(now);

    var upcoming = await (
        db.collection('experiment').aggregate([
            { $match: {
                type: { $in: experimentTypes },
                'state.isCanceled': false,
                'state.interval.start': { $gte: start }
            }},
            { $project: {
                _id: true,
                'state.experimentOperatorTeamId': true
            }}
        ]).toArray()
    );

    var upcomingForLabTeamId = groupBy({
        items: upcoming,
        byPointer: '/state/experimentOperatorTeamId'
    });

    for (var key of Object.keys(upcomingForLabTeamId)) {
        upcomingForLabTeamId[key] = upcomingForLabTeamId[key].length
    }

    return upcomingForLabTeamId;
}

module.exports = experimentCalendar;
