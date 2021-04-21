'use strict'
var datefns = require('date-fns');

var AddSubjectTestabilityFieldsStage = ({
    timeFrameStart,
    timeFrameEnd,
    subjectRecordTypeRecord,
    studyRecords,
}) => {

    var subjectTypeSettingsByStudy = prepareSubjectTypeSettings({
        studyRecords,
        subjectRecordTypeRecord,
    });

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

    return ({ $addFields: conditionsByStudy });
}

var prepareSubjectTypeSettings = ({
    studyRecords,
    subjectRecordTypeRecord,
}) => {
    var subjectTypeSettingsByStudy = {};
    for (var study of studyRecords) {
        var subjectTypeSettingsItem = (
            study.state.subjectTypeSettings.find(it => (
                it.customRecordType === subjectRecordTypeRecord.type
            ))
        )
        
        if (!subjectTypeSettingsItem) {
            throw new Error('subject type is not included in study');
        }

        subjectTypeSettingsByStudy[study._id] = subjectTypeSettingsItem;
    }
    
    return subjectTypeSettingsByStudy;
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

module.exports = AddSubjectTestabilityFieldsStage;
