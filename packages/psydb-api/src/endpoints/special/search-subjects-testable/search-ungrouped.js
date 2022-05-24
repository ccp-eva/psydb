'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsUngrouped'
);

var omit = require('@cdxoo/omit');
var datefns = require('date-fns');

var { keyBy, convertPointerToPath } = require('@mpieva/psydb-core-utils');

var {
    calculateAge,
    timeshiftAgeFrame,
    intervalUtils,

    convertCRTRecordToSettings,
    findCRTAgeFrameField,
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
   
    var subjectCRTSettings = convertCRTRecordToSettings(subjectTypeRecord);
    var dobFieldPointer = findCRTAgeFrameField(subjectCRTSettings);

    var preCountStages = [
        { $match: {
            type: subjectTypeKey,
            'isDummy': false,
            'scientific.state.internals.isRemoved': false
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
    ]

    var stages = [
        ...preCountStages,
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
        { $sort: {
            [convertPointerToPath(dobFieldPointer)]: -1
        }},
        { $skip: offset },
        { $limit: limit }
    ];
    //console.dir(stages, { depth: null });

    debug('start aggregate count');
    var countResult = await (
        db.collection('subject')
        .aggregate([
            ...preCountStages,
            { $count: 'COUNT' }
        ])
        .toArray()
    );
    var subjectRecordsCount = (
        countResult && countResult[0] ? countResult[0].COUNT : 0
    );
    debug('end aggregate count');

    debug('start aggregate result');
    var subjectRecords = await (
        db.collection('subject')
        .aggregate(stages)
        .toArray()
    );
    debug('end aggregate result');

    //var [ subjectRecords, subjectRecordsCount ] = fromFacets(result);

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
        dobFieldPointer,
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
