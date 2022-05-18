'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsUngrouped'
);

var omit = require('@cdxoo/omit');
var datefns = require('date-fns');

var { keyBy } = require('@mpieva/psydb-core-utils');

var {
    calculateAge,
    timeshiftAgeFrame,
    intervalUtils,
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    Ajv,
    ResponseBody
} = require('@mpieva/psydb-api-lib');

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
var augmentSubjectTestableIntervals = require('./augment-subject-testable-intervals');

var fromFacets = require('./from-facets');

var searchUngrouped = async (context, next) => {
    var { 
        db,
        permissions,
        request,

        experimentVariant,
    } = context;

    var {
        interval,
        ageFrameFilters,
        ageFrameValueFilters,
       
        studyTypeKey,
        studyTypeRecord,
        studyIds,
        studyRecords,
        studyRecordLabelDefinition,

        subjectTypeKey,
        subjectTypeRecord,
        subjectDisplayFields,
        subjectAvailableDisplayFieldData,
        subjectRecordLabelDefinition,

        limit,
        offset,
    } = await initAndCheck({
        db,
        permissions,
        request,
        labProcedureType: experimentVariant,
    });
   
    var stages = [
        { $match: {
            type: subjectTypeKey,
            'scientific.state.internals.isRemoved': { $ne: true }
        }},
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
            interval,
            ageFrameFilters,
            ageFrameValueFilters,

            subjectTypeKey,
            subjectTypeRecord,
            studyRecords,

            // TODO: ageframe custom verrides
            // TODO: global study settings filters in stage itself
        }),
        HasAnyTestabilityStage({
            studyIds
        }),
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
    ];
    //console.dir(stages, { depth: null });

    var result = await (
        db.collection('subject')
        .aggregate(stages)
        .toArray()
    );

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

    // FIXME: maybe put this into postprocessing
    augmentSubjectTestableIntervals({
        ageFrameFilters,
        subjectRecords,
        desiredTestInterval: interval,
        dobFieldPointer: '/scientific/state/custom/dateOfBirth',
    });
    
    postprocessSubjectRecords({
        subjectRecords,
        subjectRecordType: subjectTypeKey,
        studyRecords,
        timeFrame: interval,
        upcomingBySubjectId,
        recordLabelDefinition: subjectRecordLabelDefinition,
    })

    context.body = ResponseBody({
        data: {
            studyData: {
                records: studyRecords,
                // FIXME: studyRelated?
            },
            subjectData: await combineSubjectResponseData({
                db,

                subjectRecordType: subjectTypeKey,
                subjectRecords,
                subjectRecordsCount,
                subjectAvailableDisplayFieldData,
                subjectDisplayFields,

                studyRecords,
                studyRecordLabelDefinition,
            }),
            subjectExperimentMetadata: {
                ...omit('upcomingForIds', upcomingSubjectExperimentData),
            },
        }
    });
    
    await next();
}

module.exports = searchUngrouped;
