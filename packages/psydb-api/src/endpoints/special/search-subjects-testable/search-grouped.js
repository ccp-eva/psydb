'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsGrouped'
);

var inline = require('@cdxoo/inline-text');
var omit = require('@cdxoo/omit');
var datefns = require('date-fns');

var { keyBy } = require('@mpieva/psydb-common-lib');

var convertPointerToPath = require('@mpieva/psydb-api-lib/src/convert-pointer-to-path');

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
var fetchParentDataForGroups = require('./fetch-parent-data-for-groups');
var fetchUpcomingExperimentData = require('./fetch-upcoming-experiment-data');

var fromFacets = require('./from-facets');

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

    var subjectLocationFieldPointer = undefined;
    for (var it of labProcedureSettingRecords) {
        var { studyId, state } = it;
        var { subjectLocationFieldPointer: current } = state;
        if (subjectLocationFieldPointer === undefined) {
            subjectLocationFieldPointer = current;
        }
        else if (subjectLocationFieldPointer !== current) {
            throw new ApiError(400, {
                apiStatus: 'SubjectLocationFieldConflict',
                data: {
                    studyId,
                    expected: subjectLocationFieldPointer,
                    actual: current,
                }
            });
        }
    }
    
    var customFields = (
        subjectTypeRecord.state.settings.subChannelFields.scientific
    );

    var groupByFieldPath = convertPointerToPath(subjectLocationFieldPointer);

    var groupByField = customFields.find(field => (
        field.pointer === subjectLocationFieldPointer
    ));


    /*var groupByFieldKey = undefined;
    for (var it of studyRecords) {
        var selectionSettings = (
            it.state.selectionSettingsBySubjectType.find(s => (
                s.subjectRecordType === subjectRecordType
            ))
        );
        var { externalLocationGrouping } = selectionSettings;

        if (!externalLocationGrouping) {
            throw new ApiError(400, {
                apiStatus: 'ExternalLocationGrouoingNotEnabled',
                data: { message: inline`
                    study "${studyRecord._id}" has externalLocationGrouping
                    disabled for subject type "${subjectRecordType}"
                `}
            });
        }

        if (groupByFieldKey === undefined) {
            groupByFieldKey = externalLocationGrouping.fieldKey;
        }
        else {
            if (groupByFieldKey !== externalLocationGrouping.fieldKey) {
                throw new ApiError(400, {
                    apiStatus: 'ExternalLocationGrouoingFieldMismatch',
                    data: { message: inline`
                        externalLocationGrouping.fieldKey mismatch;
                        "${groupByFieldKey}" differs from
                        "${externalLocationGrouping.fieldKey}"
                    `}
                });
            }
        }
    }*/

    /*var customFields = (
        subjectRecordTypeRecord.state.settings.subChannelFields.scientific
    );

    var groupByField = customFields.find(field => (
        field.key === groupByFieldKey
    ));

    if (!groupByField) {
        throw new ApiError(400, {
            apiStatus: 'InvalidExternalLocationGroupingField',
            data: { message: inline`
                field with key "${groupByFieldKey}" could
                not be found in scientific fields of subject type
                "${subjectRecordType}"
            `}
        })
    }*/

    //var groupByFieldPath = `scientific.state.custom.${groupByFieldKey}`;

    var result = await db.collection('subject').aggregate([
        { $match: {
            type: subjectTypeKey,
            $and: [
                { [groupByFieldPath]: { $exists: true } },
                { [groupByFieldPath]: { $not: { $type: 10 }}}, // NOT NULL
            ]
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
                'scientific.state.internals.participatedInStudies': true,
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
    ]).toArray();

    var { groupedSubjectRecords, subjectCount, locationCount } = result[0];
    console.log(groupedSubjectRecords);

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
        subjectRecords: flatSubjects,
        subjectRecordType: subjectTypeKey,
        studyRecords,
        timeFrame: interval,
        upcomingBySubjectId,
        recordLabelDefinition: subjectRecordLabelDefinition,
    })

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

    // FIXME: its actually possible to fetch locations that the RG has
    // no permissions on when it contains subjects that are permitted
    var locationData = await fetchParentDataForGroups({
        db,
        groupByField,
        groupIds,
    });

    var upcomingLocationExperimentData = await fetchUpcomingExperimentData({
        db,
        locationIds: groupIds,
        after: now,
    });

    var groupedById = keyBy({
        items: groupedSubjectRecords,
        byProp: '_id',
    });

    var upcomingByLocationId = keyBy({
        items: upcomingLocationExperimentData.upcomingForIds,
        byProp: '_id',
    })

    var merged = locationData.records.map(it => ({
        ...it,
        _subjectRecords: groupedById[it._id].items,
        _upcomingExperiments: (
            upcomingByLocationId[it._id]
            ? upcomingByLocationId[it._id].upcoming
            : []
        )
    }))

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
            locationExperimentMetadata: {
                ...omit('upcomingForIds', upcomingLocationExperimentData),
            },

            locationCount,
            subjectCount,
        }
    });

    await next();
}

module.exports = searchGrouped;
