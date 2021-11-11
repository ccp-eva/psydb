'use strict';
var debug = require('debug')('psydb:api:endpoints:calendars:reception');
var enums = require('@mpieva/psydb-schema-enums');

var {
    keyBy,
    groupBy
} = require('@mpieva/psydb-core-utils');

var {
    omitUnparticipatedFromExperiment
} = require('@mpieva/psydb-common-lib');

var {
    ResponseBody,
    validateOrThrow,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
    ProjectDisplayFieldsStage,
    SystemPermissionStages,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var RequestBodySchema = require('./request-body-schema');
var fetchRedactedStudies = require('./fetch-redacted-studies');
var fetchPersonnel = require('./fetch-personnel');
var fetchExperiments = require('./fetch-experiments');
var fetchOpsTeams = require('./fetch-ops-teams');
var fetchSubjectsOfType = require('./fetch-subjects-of-type');

var receptionCalendar = async (context, next) => {
    var { db, permissions, request } = context;
    
    if (!permissions.hasRootAccess) {
        throw new ApiError(403)
    }

    validateOrThrow({
        schema: RequestBodySchema(),
        payload: request.body
    });

    var { interval } = request.body;

    var studies = await fetchRedactedStudies(context);
    
    // didnt need that
    /*var scientists = await fetchPersonnel(context, {
        onlyLabels: true,
        personnelIds: studies.reduce((acc, it) => ([
            ...acc,
            ...it.state.scientistIds
        ]), []),
    })*/
    
    var experiments = await fetchExperiments(context, {
        ...interval,
        studyIds: studies.map(it => it._id)
    });

    var opsTeams = await fetchOpsTeams(context, {
        opsTeamIds: experiments.records.map(it => (
            it.state.experimentOperatorTeamId
        ))
    });

    var experimentSubjectData = omitUnparticipatedFromExperiment({
        experimentRecords: experiments.records
    });

    var experimentSubjectDataByType = groupBy({
        items: experimentSubjectData,
        byProp: 'subjectType',
    });

    /*var fetchedSubjectData = [];
    for (var key of Object.keys(experimentSubjectDataByType)) {
        var group = experimentSubjectDataByType[key];

        var subjectsOfType = await fetchSubjectsOfType(context, {
            subjectTypeKey: key,
            subjectIds: group.map(it => it.subjectId),

            fetchRelated: false,
        });

        fetchedSubjectData.push({
            subjectTypeKey: key,
            ...subjectsOfType
        });
    }

    console.dir({ fetchedSubjectData }, { depth: null });*/

    /*var subjectsByTypeAndId = keyBy({
        items: subjects,
        creakeKey: (it) => `${it.type}_${it._id}`
    });*/

    
    //console.log(subjectIds);

    context.body = ResponseBody({
        data: {
            experiments,
            studiesById: keyBy({ items: studies, byProp: '_id' }),
            //scientistsById: keyBy({ items: scientists.records, byProp: '_id' }),
            opsTeams,

            /*experimentRecords,
            experimentOperatorTeamRecords,
            experimentRelated,
            subjectRecordsById,
            subjectRelated,
            subjectDisplayFieldData: displayFieldData,
            phoneListField,*/
        },
    });

    await next();
}

module.exports = receptionCalendar;
