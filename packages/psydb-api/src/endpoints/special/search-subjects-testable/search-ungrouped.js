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

    //var excludeStages = [
    //    { $match: {
    //        type: subjectTypeKey,
    //        isDummy: false,
    //        'scientific.state.systemPermissions.isHidden': { $ne: true },
    //        'scientific.state.internals.isRemoved': { $ne: true }
    //    }},
    //    { $match: {
    //        
    //    }}
    //];

    //debug('start exclude query');
    //var excludedSubjects = await (
    //    db.collection('subject')
    //    .aggregate(excludeStages)
    //    .toArray()
    //);
    //debug('end exclude query');

    var preCountStages = [
        { $match: {
            type: subjectTypeKey,
            isDummy: false,
            'scientific.state.systemPermissions.isHidden': { $ne: true },
            'scientific.state.internals.isRemoved': { $ne: true }
        }},
        // NOTE: prefiltering possbile age frames to make index use easier
        // and get better performance
        { $match: { $or: (
            ageFrameFilters.map(it => {
                var p = convertPointerToPath(dobFieldPointer);
                var shifted = timeshiftAgeFrame({
                    targetInterval: interval,
                    ageFrame: it.interval
                });
                    
                return { $and: [
                    { [p]: { $gte: shifted.start }},
                    { [p]: { $lt: shifted.end }},
                ]}
            })
        )}},
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
    ];

    var stages = [
        ...preCountStages,
        { $facet: {
            records: [
                { $sort: {
                    [convertPointerToPath(dobFieldPointer)]: 1
                }},
                { $skip: offset },
                { $limit: limit },
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
            ],
            recordsCount: [{ $count: 'COUNT' }]
        }}
    ];
    //console.dir(stages, { depth: null });

    await db.collection('subject').ensureIndex({
        [convertPointerToPath(dobFieldPointer)]: 1
    }, {
        name: 'ageFrameIndex'
    });

    debug('start aggregate');
    var result = await (
        db.collection('subject')
        .aggregate(stages, {
            hint: 'ageFrameIndex',
            allowDiskUse: true,
        })
        .toArray()
    );
    debug('end aggregate');

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
