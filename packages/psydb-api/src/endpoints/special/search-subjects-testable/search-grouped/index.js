'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsGrouped'
);

var inline = require('@cdxoo/inline-text');
var omit = require('@cdxoo/omit');
var datefns = require('date-fns');

var {
    keyBy, merge, convertPointerToPath
} = require('@mpieva/psydb-core-utils');

var {
    timeshiftAgeFrame,
    convertCRTRecordToSettings,
    findCRTAgeFrameField,
} = require('@mpieva/psydb-common-lib');

var {
    ApiError,
    Ajv,
    ResponseBody,

    fromFacets,
} = require('@mpieva/psydb-api-lib');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
    AddSubjectTestabilityFieldsStage,
    HasAnyTestabilityStage,
    SeperateRecordLabelDefinitionFieldsStage,
    ProjectDisplayFieldsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');


var initAndCheck = require('../init-and-check');
var postprocessSubjectRecords = require('../postprocess-subject-records');
var combineSubjectResponseData = require('../combine-subject-response-data');
var fetchParentDataForGroups = require('../fetch-parent-data-for-groups');
var fetchUpcomingExperimentData = require('../fetch-upcoming-experiment-data');

var prepareGroupByField = require('./prepare-group-by-field');
var fetchExcludedLocationIds = require('./fetch-excluded-location-ids');
var {
    isRecordType,
    isNotOmitted,
    hasField,
    prefilterAgeFrames
} = require('./local-stages');

var searchGrouped = async (context, next) => {
    var { 
        db,
        permissions,
        request,

        experimentVariant,
    } = context;

    var now = new Date();

    var {
        interval,
        labProcedureSettingRecords,
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

    var groupByField = prepareGroupByField({
        labProcedureSettingRecords,
        subjectTypeRecord
    });
    var groupByFieldPath = convertPointerToPath(groupByField.pointer);

    var subjectCRTSettings = convertCRTRecordToSettings(subjectTypeRecord);
    var dobFieldPointer = findCRTAgeFrameField(subjectCRTSettings);

    debug('start find excluded locations');
    var excludedLocationIds = await fetchExcludedLocationIds({
        db, locationType: groupByField.props.recordType,
    });
    debug('end find excluded locations');

    var dobFieldPath = convertPointerToPath(dobFieldPointer);
    await db.collection('subject').ensureIndex({
        [dobFieldPath]: 1
    }, {
        name: 'ageFrameIndex'
    });

    //console.log(groupByFieldPath);
    var stages = [
        { $sort: { [dobFieldPath]: 1 }},
        isRecordType({ type: subjectTypeKey }),
        isNotOmitted(),
        hasField({
            path: groupByFieldPath,
            excludedValues: excludedLocationIds
        }),

        // NOTE: prefiltering possbile age frames to make index use easier
        // and get better performance
        prefilterAgeFrames({
            targetInterval: interval,
            ageFrameFilters,
            dobFieldPath: convertPointerToPath(dobFieldPointer),
        }),

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
        { $addFields: {
            _groupByField: '$' + groupByFieldPath
        }},
        StripEventsStage({ subChannels: ['gdpr', 'scientific']}),
        SeperateRecordLabelDefinitionFieldsStage({
            recordLabelDefinition: subjectRecordLabelDefinition
        }),
        ProjectDisplayFieldsStage({
            displayFields: subjectDisplayFields,
            additionalProjection: {
                '_recordLabelDefinitionFields': true,
                '_ageFrameField': true,
                '_groupByField': true,
                // XXX: or else fetchRelated will try to get experiment labels
                'scientific.state.internals.participatedInStudies.studyId': true,
                'scientific.state.comment': true,
                ...( studyIds.reduce((acc, id) => ({
                    ...acc, [`_testableIn_${id}`]: true,
                }), {}))
            }
        }),
        // FIXME: i bet this is not the way to do that counting
        // i have double group stage id like to avoid that
        { $facet: {
            groupedSubjectRecords: [
                { $group: {
                    _id: '$_groupByField',
                    items: { $push: '$$ROOT' }
                }},
                { $sort: { '_id': 1 }},
                { $skip: offset },
                { $limit: limit }
            ],
            locationCount: [
                { $group: {
                    _id: '$_groupByField',
                    items: { $push: '$$ROOT' }
                }},
                { $count: 'COUNT' }
            ],
            subjectCount: [{ $count: 'COUNT' }]
        }}
    ]

    debug('start aggregate sbjects');
    var result = await (
        db.collection('subject')
        .aggregate(stages, {
            hint: 'ageFrameIndex',
            allowDiskUse: true,
        })
        .toArray()
    );
    debug('end aggregate subjects');

    var { groupedSubjectRecords, subjectCount, locationCount } = result[0];
    //console.log(groupedSubjectRecords);

    subjectCount = (
        subjectCount.length
        ? subjectCount[0].COUNT
        : 0
    );

    locationCount = (
        locationCount.length
        ? locationCount[0].COUNT
        : 0
    );

    var flatSubjects = groupedSubjectRecords.reduce((acc, it) => ([
        ...acc, ...it.items
    ]), []);

    var subjectIds = flatSubjects.map(it => it._id);
    debug('start fetch upcoming subject experiments');
    var upcomingSubjectExperimentData = await fetchUpcomingExperimentData({
        db,
        subjectIds: subjectIds,
        after: now,
    });
    debug('end fetch upcoming subject experiments');

    var upcomingBySubjectId = keyBy({
        items: upcomingSubjectExperimentData.upcomingForIds,
        byProp: '_id',
    })

    debug('postprocessing subjects');
    postprocessSubjectRecords({
        subjectRecords: flatSubjects,
        subjectRecordType: subjectTypeKey,
        studyRecords,
        timeFrame: interval,
        upcomingBySubjectId,
        recordLabelDefinition: subjectRecordLabelDefinition,
    })

    debug('combining response data');
    var combinedSubjectResponseData =  await combineSubjectResponseData({
        db,

        subjectRecordType: subjectTypeKey,
        subjectRecords: flatSubjects,
        subjectRecordsCount: subjectCount,
        subjectAvailableDisplayFieldData,
        subjectDisplayFields,

        studyRecords,
        studyRecordLabelDefinition,
    });

    var groupIds = groupedSubjectRecords.map(it => it._id);

    debug('start fetch locations');
    // FIXME: its actually possible to fetch locations that the RG has
    // no permissions on when it contains subjects that are permitted
    var locationData = await fetchParentDataForGroups({
        db,
        groupByField,
        groupIds,
    });
    debug('end fetch locations');

    debug('start fetch upcoming location experiments');
    var upcomingLocationExperimentData = await fetchUpcomingExperimentData({
        db,
        locationIds: groupIds,
        after: now,
    });
    debug('end fetch upcoming location experiments');

    var groupedById = keyBy({
        items: groupedSubjectRecords,
        byProp: '_id',
    });

    var upcomingByLocationId = keyBy({
        items: upcomingLocationExperimentData.upcomingForIds,
        byProp: '_id',
    })

    //console.dir(locationData.records, { depth: null });

    var merged = locationData.records.map(it => ({
        ...it,
        _subjectRecords: groupedById[it._id].items,
        _upcomingExperiments: (
            upcomingByLocationId[it._id]
            ? upcomingByLocationId[it._id].upcoming
            : []
        ),
        _pastStudies: (
            it.state.internals.visits
            .sort((a,b) => (
                a.timestamp.getTime() > b.timestamp.getTime()
                ? 1 : -1 // reversed
            ))
            .map(it => ({ state: {
                _id: it.experimentId,
                type: it.experimentType,
                studyId: it.studyId,
                interval: { start: it.timestamp }
            }}))
            .slice(0,3)
            .reverse()
        )
    }));
    //console.dir(merged, { depth: null });

    context.body = ResponseBody({
        data: {
            mergedRecords: merged,
            subjectMetadata: {
                ...omit('records', combinedSubjectResponseData),
            },
            subjectExperimentMetadata: {
                ...omit('upcomingForIds', upcomingSubjectExperimentData),
            },
            locationMetadata: {
                ...omit('records', locationData),
            },
            locationExperimentMetadata: merge(
                omit('upcomingForIds', upcomingLocationExperimentData),
                omit('records', locationData),
            ),

            locationCount,
            subjectCount,
        }
    });

    await next();
}

module.exports = searchGrouped;
