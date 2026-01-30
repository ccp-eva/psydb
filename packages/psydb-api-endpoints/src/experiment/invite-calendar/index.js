'use strict';
var debug = require('../debug-helper')('inviteCalendar');

var enums = require('@mpieva/psydb-schema-enums');
var { keyBy, forcePush, merge } = require('@mpieva/psydb-core-utils');
var { aggregateToArray } = require('@mpieva/psydb-mongo-adapter');
var { fetchRelated } = require('@mpieva/psydb-api-endpoint-lib');
var {
    ApiError, ResponseBody,
    validateOrThrow, verifyLabOperationAccess, fetchRelatedLabelsForMany
} = require('@mpieva/psydb-api-lib');

var BodySchema = require('./body-schema');
var verifyCalendarAccess = require('./verify-calendar-access');
var fetchStudyRecords = require('./fetch-study-records');
var fetchExperimentRecords = require('./fetch-experiment-records');
var fetchLabTeamRecords = require('./fetch-lab-team-records');
var lookupSubjects = require('./lookup-subjects');

var experimentCalendar = async (context, next) => {
    var { db, permissions, request, i18n } = context;
    
    validateOrThrow({
        schema: BodySchema(),
        payload: request.body
    });

    var {
        interval,

        experimentTypes = undefined,
        subjectRecordType = undefined,
        studyId = undefined,
        researchGroupId = undefined,
        locationId = undefined,

        experimentOperatorTeamIds = undefined,
        showPast = false,
    } = request.body;
    
    verifyCalendarAccess({
        permissions, researchGroupId, labMethods: experimentTypes
    });

    if (!permissions.isRoot()) {
        showPast = false;
    }

    var { start, end } = interval;


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
        db, studyId, interval,
        researchGroupIds: allowedResearchGroupIds,
        labMethods: allowedExperimentTypes,
    });
    var studyIds = studyRecords.map(it => it._id);
    var studiesById = keyBy({ items: studyRecords, byProp: '_id' });

    var filteredStudyIds = studyIds;

    var experimentRecords = await fetchExperimentRecords({
        db,
        start, end, showPast,
        allowedExperimentTypes,
        studyIds: filteredStudyIds,
        locationId,
        experimentOperatorTeamIds,
    });
 
    var labTeams = await fetchLabTeamRecords({
        db,
        studyIds: filteredStudyIds,
        labMethods: allowedExperimentTypes,
        labTeamIds: experimentRecords.map(it => (
            it.state.experimentOperatorTeamId
        )),
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

    var experimentRelated = await fetchRelatedLabelsForMany({
        db, ...i18n,
        collectionName: 'experiment',
        records: experimentRecords
    });

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
            experimentOperatorTeamRecords: labTeams,
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

module.exports = experimentCalendar;
