'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:searchSubjectsGrouped'
);

var inline = require('@cdxoo/inline-text');
var omit = require('@cdxoo/omit');
var datefns = require('date-fns');

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
var fetchNextExperimentData = require('./fetch-next-experiment-data');

var fromFacets = require('./from-facets');

var searchGrouped = async (context, next) => {
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

    var groupByFieldKey = undefined;
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
    }

    var customFields = (
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
    }

    var groupByFieldPath = `scientific.state.custom.${groupByFieldKey}`;

    var result = await db.collection('subject').aggregate([
        { $match: {
            type: subjectRecordType,
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
                ...( studyIds.reduce((acc, id) => ({
                    ...acc, [`_testableIn_${id}`]: true,
                }), {}))
            }
        }),
        { $facet: {
            records: [
                { $group: {
                    _id: '$_groupByField',
                    items: { $push: '$$ROOT' }
                }},
                { $skip: offset },
                { $limit: limit }
            ],
            recordsCount: [{ $count: 'COUNT' }]
        }}
    ]).toArray();

    var [ groupedSubjectRecords, subjectRecordsCount ] = fromFacets(result);

    var flatSubjects = groupedSubjectRecords.reduce((acc, it) => ([
        ...acc, ...it.items
    ]), []);

    postprocessSubjectRecords({
        subjectRecords: flatSubjects,
        subjectRecordType,
        studyRecords,
        timeFrame: {
            start: timeFrameStart,
            end: timeFrameEnd
        },
        recordLabelDefinition: subjectRecordLabelDefinition,
    })

    var combinedSubjectResponseData =  await combineSubjectResponseData({
        db,

        subjectRecordType,
        subjectRecords: flatSubjects,
        subjectRecordsCount,
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

    var now = new Date();

    var nextExperimentData = await fetchNextExperimentData({
        db,
        locationIds: groupIds,
        after: now
    });

    context.body = ResponseBody({
        data: {
            subjectData: {
                ...omit('subjectRecords', combinedSubjectResponseData),
                groupedSubjectRecords,
            },
            locationData,
            nextExperimentData,
        }
    });

    await next();
}

module.exports = searchGrouped;
