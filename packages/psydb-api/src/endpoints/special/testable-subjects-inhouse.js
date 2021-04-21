'use strict';
var debug = require('debug')(
    'psydb:api:endpoints:availableTestLocationsForStudy'
);

var datefns = require('date-fns');

var ApiError = require('@mpieva/psydb-api-lib/src/api-error'),
    Ajv = require('@mpieva/psydb-api-lib/src/ajv');

var {
    MatchIntervalOverlapStage,
    StripEventsStage,
} = require('@mpieva/psydb-api-lib/src/fetch-record-helpers');

var testableSubjectsInhouse = async (context, next) => {
    var { 
        db,
        permissions,
        request,
    } = context;

    var {
        subjectRecordType,
        studyIds,
        timeFrameStart,
        timeFrameEnd,
        customAgeFrameConditions,
        offset,
        limit,
    } = request.body;

    // TODO: check body + unmarshal
    timeFrameStart = new Date(timeFrameStart);
    timeFrameEnd = new Date(timeFrameEnd);

    var subjectRecordTypeRecord = await (
        db.collection('customRecordType').findOne(
            { collection: 'subject', type: subjectRecordType },
            { projection: { events: false }}
        )
    );

    if (!subjectRecordTypeRecord) {
        throw new ApiError(400, 'InvalidSubjectRecordType');
    }

    var studyRecords = await db.collection('study').aggregate([
        { $match: {
            _id: { $in: studyIds }
        }},
        StripEventsStage(),
    ]).toArray()

    var subjectTypeSettingsByStudy = {};
    for (var study of studyRecords) {
        var subjectTypeSettingsItem = (
            study.state.subjectTypeSettings.find(it => (
                it.customRecordType === subjectRecordType
            ))
        )
        
        if (!subjectTypeSettingsItem) {
            throw new ApiError(400, 'SubjectTypeMissingInSelectedStudy');
        }

        subjectTypeSettingsByStudy[study._id] = subjectTypeSettingsItem;
    }

    var conditionsByStudy = {};
    for (var study of studyRecords) {
        conditionsByStudy[`_testableIn_${study._id}`] = makeCondition({
            timeFrameStart,
            timeFrameEnd,
            subjectRecordTypeRecord,
            subjectTypeSettings: subjectTypeSettingsByStudy[study._id],
            studyRecord: study,
        });
    }

    var subjectRecords = await db.collection('subject').aggregate([
        { $match: {
            type: subjectRecordType,
        }},
        // TODO: optimization
        // first match children that ar in any of the timeshifted
        // age frames; this should reduce the size enough most of the time
        { $addFields: conditionsByStudy },
        // at least on of the condition fields must be true
        { $match: { $or: Object.keys(conditionsByStudy).map(key => ({
            [key]: true,
        }))}},
        StripEventsStage({ subChannels: ['gdpr', 'scientific']}),
    ]).toArray();

    console.dir(subjectRecords, { depth: null });


    
    /*var p = { $addFields: {
        _convertedAgeFrameField: {
            $trunc: {
                $divide: [
                    { $subtract: [new Date(), '$custom.FOO'] },
                    24 * HOUR
                ]
            }
        }
    }};*/

    await next();
}

var makeCondition = ({
    timeFrameStart,
    timeFrameEnd,
    subjectRecordTypeRecord,
    studyRecord,
    subjectTypeSettings,
}) => {
    var customFields = (
        subjectRecordTypeRecord.state.settings.subChannelFields.scientific
    );

    var ageFrameField = customFields.find(field => (
        field.props.isSpecialAgeFrameField === true
    ))

    var base = {
        $and: [
        // exclude study itself
            { $not: { $in: [
                '$scientific.state.participatedInStudyIds',
                [ 
                    studyRecord._id,
                    // ... exlcuded studies
                ]
            ]}},
        ]
    };

    var testingPermissions = {
        // is the child allowed to be tested by the studies researchgroups
        // we currently require at least one group
        $or: studyRecord.state.researchGroupIds.map(groupId => ({
            $gt: [
                { $size: {
                    $filter: {
                        input: '$scientific.state.testingPermissions.canBeTestedInhouse',
                        as: 'item',
                        cond: { $and: [
                            { $eq: [ '$$item.researchGroupId', groupId ]},
                            { $eq: [ '$$item.permission', 'yes' ]}
                        ]}
                    }
                }},
                0,
            ]
        }))

        // TODO: global conditions
    };

    if (ageFrameField) {
        console.log(subjectTypeSettings);
        var combinedAgeFrameConditions = [];
        for (var item of subjectTypeSettings.ageFrameSettings) {
            var ageFrameConditions = []
            var { ageFrame, conditionList } = item;

            var timeShifted = {
                // shifting time frame pack by the age frame boundaries
                // ... on the first test day whats the oldest child
                // we can test ? and on the last day of the testing
                // whats the youngest child we can test?
                // ... if we move the testing interval in the past
                // which children are born within the testinterval
                // expanded by the age frame
                start: datefns.sub(timeFrameStart, { days: ageFrame.end }),
                end: datefns.sub(timeFrameEnd, { days: ageFrame.start }),
            }

            var ageFrameFieldPath = (
                `$scientific.state.custom.${ageFrameField.key}`
            );
            ageFrameConditions.push({
                $and: [
                    { $gte: [ ageFrameFieldPath, timeShifted.start ]},
                    { $lt: [ ageFrameFieldPath, timeShifted.end ]},
                ]
            })

            for (var condition of conditionList) {
                console.log(condition);
                var conditionFieldPath = (
                    `$scientific.state.custom.${condition.field}`
                );
                ageFrameConditions.push({
                    [conditionFieldPath]: { $in: condition.values }
                })
            }
            
            combinedAgeFrameConditions.push({ $and: ageFrameConditions });
        }
    }

    var mongoCondOperation = {
        $cond: {
            if: {
                $and: [
                    base,
                    testingPermissions,
                    //{ $or: combinedAgeFrameConditions }
                ]
            },
            then: true,
            else: false
        }
    }

    console.dir(mongoCondOperation, { depth: null });
    return mongoCondOperation;
};

module.exports = testableSubjectsInhouse;
