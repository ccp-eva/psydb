'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsUngrouped'
);

var datefns = require('date-fns');

var keyBy = require('@mpieva/psydb-common-lib/src/key-by');
var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv'),
    ResponseBody = require('@mpieva/psydb-api-lib/src/response-body');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
    AddSubjectTestabilityFieldsStage,
    HasAnyTestabilityStage,
    SeperateRecordLabelDefinitionFieldsStage,
    ProjectDisplayFieldsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');


var initAndCheck = require('./init-and-check');
var postprocessSubjectRecords = require('./postprocess-subject-records');
var combineSubjectResponseData = require('./combine-subject-response-data');
var fetchUpcomingExperimentData = require('./fetch-upcoming-experiment-data');

var fromFacets = require('./from-facets');

var searchUngrouped = async (context, next) => {
    var { 
        db,
        permissions,
        request,

        experimentVariant,
    } = context;

    var {
        timeFrameStart,
        timeFrameEnd,
        
        studyIds,
        studyRecords,
        studyRecordLabelDefinition,

        subjectRecordType,
        subjectRecordTypeRecord,
        subjectDisplayFields,
        subjectAvailableDisplayFieldData,
        subjectRecordLabelDefinition,

        enabledAgeFrames,
        enabledValues,

        limit,
        offset,
    } = await initAndCheck({
        db,
        permissions,
        request,
    });
    
    var result = await db.collection('subject').aggregate([
        { $match: { type: subjectRecordType }},
        // TODO: quicksearch
        /*...QuickSearchStages({
            queryFields,
            fieldTypeConversions,
        }),*/
        // TODO: optimization
        // first match children that ar in any of the timeshifted
        // age frames; this should reduce the size enough most of the time
        AddSubjectTestabilityFieldsStage({
            experimentVariant,

            timeFrameStart,
            timeFrameEnd,
            subjectRecordTypeRecord,
            studyRecords,

            enabledAgeFrames,
            enabledValues,
            // TODO: ageframe custom verrides
            // TODO: global study settings filters in stage itself
        }),
        HasAnyTestabilityStage({
            studyIds
        }),
        StripEventsStage({ subChannels: ['gdpr', 'scientific']}),
        SeperateRecordLabelDefinitionFieldsStage({
            recordLabelDefinition: subjectRecordLabelDefinition
        }),
        ProjectDisplayFieldsStage({
            displayFields: subjectDisplayFields,
            additionalProjection: {
                '_recordLabelDefinitionFields': true,
                '_ageFrameField': true,
                'scientific.state.internals.participatedInStudies': true,
                ...( studyIds.reduce((acc, id) => ({
                    ...acc, [`_testableIn_${id}`]: true,
                }), {}))
            }
        }),
        { $facet: {
            records: [{ $skip: offset }, { $limit: limit }],
            recordsCount: [{ $count: 'COUNT' }]
        }}
    ]).toArray();

    var [ subjectRecords, subjectRecordsCount ] = fromFacets(result);
    
    var now = new Date();
    var subjectIds = subjectRecords.map(it => it._id);
    var upcomingSubjectExperimentData = await fetchUpcomingExperimentData({
        db,
        subjectIds: subjectIds,
        after: now,
    });

    var upcomingBySubjectId = keyBy({
        items: upcomingSubjectExperimentData.upcomingForIds,
        byProp: '_id',
    })

    postprocessSubjectRecords({
        subjectRecords,
        subjectRecordType,
        studyRecords,
        timeFrame: {
            start: timeFrameStart,
            end: timeFrameEnd
        },
        upcomingBySubjectId,
        recordLabelDefinition: subjectRecordLabelDefinition,
    })

    context.body = ResponseBody({
        data: await combineSubjectResponseData({
            db,

            subjectRecordType,
            subjectRecords,
            subjectRecordsCount,
            subjectAvailableDisplayFieldData,
            subjectDisplayFields,

            studyRecords,
            studyRecordLabelDefinition,
        }),
    });
    
    await next();
}

module.exports = searchUngrouped;
