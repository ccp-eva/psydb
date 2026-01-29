'use strict';
var debug = require('../debug-helper')('inviteCalendar');

var datefns = require('date-fns');
var enums = require('@mpieva/psydb-schema-enums');

var {
    ejson,
    keyBy,
    groupBy,
    compareIds,
    forcePush,
    merge,
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

var { fetchRelated } = require('@mpieva/psydb-api-endpoint-lib');
var lookupSubjects = require('./lookup-subjects');

var experimentCalendar = async (context, next) => {
    var { 
        db,
        permissions,
        request,
        
        timezone,
        language,
        locale,

        i18n,
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

    // can view any calendar
    verifyLabOperationAccess({
        researchGroupId,
        labOperationTypes: experimentTypes,
        flag: 'canViewExperimentCalendar',
        permissions,
        
        matchTypes: 'some',
        matchFlags: 'every',
    });

    // what types of calendars
    var allowedExperimentTypes = permissions.getAllowedLabOpsForFlags({
        onlyTypes: experimentTypes,
        flags: [ 'canViewExperimentCalendar' ],
        researchGroupId
    });

    // FIXME:root should have all available research groups in permissions
    var allowedResearchGroupIds = permissions.getResearchGroupIds(
        researchGroupId ? [ researchGroupId ] : undefined
    );

    var studyRecords = await fetchStudyRecords({
        db, allowedResearchGroupIds, studyId, start, end
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
    var subjectTypes = [];
    var subjectIdsByCRT = {};
    for (var exp of experimentRecords) {
        for (var sd of exp.state.subjectData) {
            
            if (enums.unparticipationStatus.keys.includes(
                sd.participationStatus
            )) {
                continue;
            }
            
            subjectIds.push(sd.subjectId);
            subjectTypes.push(sd.subjectType);

            forcePush({
                into: subjectIdsByCRT,
                pointer: `/${sd.subjectType}`,
                values: [ sd.subjectId ]
            });
        }
    }

    //var foo = await gatherSubjectDisplayFields({ subjectTypes });


    var shownDisplayFieldsByCRT = {};
    var allSubjectRecords = [];
    var __subjectRelated = {};
    for (var it of subjectTypes) {
        var lookup = await lookupSubjects.onlyDisplayFields({
            db, subjectType: it, subjectIds: subjectIdsByCRT[it]
        });

        var { records, definitions } = lookup;
        var related = await fetchRelated({ db, records, definitions, i18n });

        shownDisplayFieldsByCRT[it] = definitions;
        allSubjectRecords.push(...records);

        __subjectRelated = merge(__subjectRelated, related);
    }

    // XXX
    __subjectRelated.relatedRecords = __subjectRelated.relatedRecordLabels;
    __subjectRelated.relatedCustomRecordTypes = {};

    //var allCRTSettings = await fetchAllCRTSettings(db, [
    //    {
    //        collection: 'subject',
    //        ...(subjectRecordType && { recordTypes: [subjectRecordType] })
    //    },
    //], { wrap: true });

    //var shownDisplayFieldsByCRT = {};
    //var allSubjectRecords = [];
    //for (var crtSettings of Object.values(allCRTSettings.subject)) {
    //    var type = crtSettings.getType();
    //    
    //    var availableDisplayFields
    //        = availableDisplayFieldsByCRT[type]
    //        = crtSettings.availableDisplayFields();

    //    var shownDisplayFields = shownDisplayFieldsByCRT[type] = [
    //        ...crtSettings.augmentedDisplayFields('table'),
    //        ...crtSettings.augmentedDisplayFields('selectionRow'),
    //    ];
    //  
    //    console.log('SSSSSSSSSSSSSSSSSSSSSSSSSs')
    //    console.log(type);
    //    console.log(shownDisplayFields);
    //    
    //    var subjectRecords = await (
    //        db.collection('subject').aggregate([
    //            { $match: {
    //                _id: { $in: subjectIds }
    //            }},

    //            ProjectDisplayFieldsStage({
    //                displayFields: shownDisplayFields,
    //                additionalProjection: {
    //                    type: true,
    //                }
    //            }),
    //        ]).toArray()
    //    );

    //    // FIXME: perf difference?
    //    allSubjectRecords.push(...subjectRecords);
    //    //allSubjectRecords = [ ...allSubjectRecords, ...subjectRecords ];
    //}

    //console.dir(ejson({ subjectRecords }), { depth: null });
    //var subjectRelated = await fetchRelatedLabelsForMany({
    //    db, 
    //    timezone, language, locale,
    //    collectionName: 'subject',
    //    records: allSubjectRecords,
    //})

    var experimentRelated = await fetchRelatedLabelsForMany({
        db, ...i18n,
        collectionName: 'experiment',
        records: experimentRecords
    })

    //console.dir(subjectRelated, { depth: null });

    //console.log(experimentRecords);

    var experimentOperatorTeamRecords = await (
        db.collection('experimentOperatorTeam').aggregate([
            { $match: {
                //'studyId': { $in: filteredStudyIds },
                $or: [
                    { 'state.hidden': false },
                    { '_id': { $in: experimentRecords.map(it => (
                        it.state.experimentOperatorTeamId
                    ))}},
                ]
            }},
            StripEventsStage(),
        ]).toArray()
    );

    var _upcomingLabTeamExperimentCounts = await (
        fetchUpcomingLabTeamExperimentCounts({
            db,
            studyIds: filteredStudyIds,
            experimentTypes: allowedExperimentTypes,
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
            subjectRelated: __subjectRelated,
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
    var { db, experimentTypes, studyIds } = bag;
    var now = new Date();
    var start = datefns.startOfDay(now);

    var upcoming = await (
        db.collection('experiment').aggregate([
            { $match: {
                //'studyId': { $in: studyIds },
                'type': { $in: experimentTypes },
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
