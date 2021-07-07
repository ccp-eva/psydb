'use strict';
var datefns = require('date-fns');
var jsonpointer = require('jsonpointer');

var makeAgeFrameFieldSubConditions = (
    require('./make-age-frame-field-sub-conditions')
);

var makeTestingPermissionSubConditions = (
    require('./make-testing-permission-sub-conditions')
);

var makeCondition = ({
    ageFrameFieldKey,
    timeFrameStart,
    timeFrameEnd,
    studyRecord,
    subjectTypeSettings,
    experimentVariant
}) => {
    var base = {
        $and: [
            { $not: { $in: [
                '$scientific.state.participatedInStudyIds',
                [ 
                    // exclude study itself
                    studyRecord._id,
                    // ... exlcuded studies
                ]
            ]}},
        ]
    };
    // TODO: global conditions


    var combinedTestingPermissions = makeTestingPermissionSubConditions({
        researchGroupIds: studyRecord.state.researchGroupIds,
        experimentVariant
    });

    var combinedAgeFrameConditions = [];
    if (ageFrameFieldKey) {
        combinedAgeFrameConditions = makeAgeFrameFieldSubConditions({
            ageFrameFieldKey,
            timeFrameStart,
            timeFrameEnd,
            conditionsByAgeFrameList: (
                subjectTypeSettings.conditionsByAgeFrame
            )
        });
    }

    var mongoCondOperation = {
        $cond: {
            if: {
                $and: [
                    base,
                    { $or: combinedTestingPermissions },
                    { $or: combinedAgeFrameConditions }
                ]
            },
            then: true,
            else: false
        }
    }

    //console.dir(mongoCondOperation, { depth: null });
    return mongoCondOperation;
};


module.exports = makeCondition;
