'use strict';
var debug = require('debug')('psydb:api:endpoints:calendars:reception');
var enums = require('@mpieva/psydb-schema-enums');

var {
    keyBy,
    groupBy,
    unwind,
} = require('@mpieva/psydb-core-utils');

var {
    omitUnparticipatedFromExperiment
} = require('@mpieva/psydb-common-lib');

var {
    validateOrThrow,
    ResponseBody,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
    ProjectDisplayFieldsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var RequestBodySchema = require('./request-body-schema');
var fetchRedactedStudies = require('./fetch-redacted-studies');
var fetchResearchGroups = require('./fetch-research-groups');
var fetchPersonnel = require('./fetch-personnel');
var fetchExperiments = require('./fetch-experiments');
var fetchOpsTeams = require('./fetch-ops-teams');
var fetchSubjectsOfType = require('./fetch-subjects-of-type');

var receptionCalendar = async (context, next) => {
    var { db, permissions, request } = context;
    var { hasRootAccess, projectedResearchGroupIds } = permissions;
    
    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    });

    // TODO: permissions

    var { interval } = request.body;

    // fetchData(context, { interval });
    var studies = await fetchRedactedStudies(context, { interval });

    var researchGroups = await fetchResearchGroups(context, {
        onlyLabels: true,
    })

    var experiments = await fetchExperiments(context, {
        ...interval,
        studyIds: studies.map(it => it._id)
    });

    var opsTeams = await fetchOpsTeams(context, {
        opsTeamIds: experiments.records.map(it => (
            it.state.experimentOperatorTeamId
        ))
    });

    // createAugmentedExperiments()
    var studiesByResearchGroup = groupBy({
        items: unwind({
            items: studies,
            byPath: 'state.researchGroupIds'
        }),
        byPointer: '/state/researchGroupIds',
    });

    var studiesById = keyBy({
        items: studies,
        byProp: '_id'
    });

    var opsTeamsById = keyBy({
        items: opsTeams.records,
        byProp: '_id'
    });

    var augmentedExperimentRecords = [];
    for (var exp of experiments.records) {
        var { _id, state } = exp;
        var {
            interval,
            studyId,
            experimentOperatorTeamId
        } = state;


        var study = studiesById[studyId];
        var { researchGroupIds } = study.state;

        var opsTeam = opsTeamsById[experimentOperatorTeamId];
        var { personnelIds } = opsTeam.state;

        var subjectData = omitUnparticipatedFromExperiment({
            experimentRecord: exp
        });

        var augmentedSubjectData = subjectData.map(it => ({
            typeKey: it.subjectType,
            typeLabel: (
                experiments
                .related.relatedCustomRecordTypes
                .subject[it.subjectType].state.label
            ),
            recordLabel: (
                experiments
                .related.relatedRecordLabels
                .subject[it.subjectId]._recordLabel
            ),
        }));

        var subjectGroups = (
            Object.values(groupBy({
                items: augmentedSubjectData,
                byProp: 'typeKey'
            }))
            .map(group => {
                var first = group[0];
                return {
                    typeKey: first.typeKey,
                    typeLabel: first.typeLabel,
                    recordLabels: group.map(it => it.recordLabel)
                }
            })
        )

        augmentedExperimentRecords.push({
            _id,
            researchGroupIds,
            interval,
            subjectGroups,
            personnelLabels: personnelIds.map(it => (
                opsTeams
                .related.relatedRecordLabels
                .personnel[it]._recordLabel
            )),
        })
    }

    var researchGroupsById = keyBy({
        items: researchGroups.records,
        byProp: '_id',
    });

    // createResearchGroupBuckets()
    var byResearchGroups = groupBy({
        items: unwind({
            items: augmentedExperimentRecords,
            byPath: 'researchGroupIds',
        }),
        byProp: 'researchGroupIds'
    });

    var data = (
        researchGroups.records
        .map(it => ({
            _id: it._id,
            label: it._recordLabel,
            experiments: byResearchGroups[it._id] || []
        }))
        .sort((a, b) => ( a.label < b.label ? 1 : 0))
    )

    context.body = ResponseBody({ data });
    await next();
}

module.exports = receptionCalendar;
