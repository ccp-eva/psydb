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
    experimentVariant,
    searchInterval,
    ageFrameFilters,
    ageFrameValueFilters,
    ageFrameTargetDefinition,

    studyRecord,
    subjectTypeSettings,
}) => {
    var base = {
        $and: [
            { $not: { $in: [
                '$scientific.state.participatedInStudyIds',
                [ 
                    // exclude study itself
                    studyRecord._id,
                    // TODO ... exlcuded studies
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
    if (ageFrameTargetDefinition) {
        combinedAgeFrameConditions = makeAgeFrameFieldSubConditions({
            searchInterval,
            ageFrameFilters,
            ageFrameValueFilters,
            ageFrameTargetDefinition,

            /*conditionsByAgeFrameList: (
                subjectTypeSettings.conditionsByAgeFrame
            )*/
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
