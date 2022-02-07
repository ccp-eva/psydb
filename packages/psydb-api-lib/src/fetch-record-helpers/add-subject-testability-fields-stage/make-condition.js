'use strict';
var datefns = require('date-fns');
var jsonpointer = require('jsonpointer');
var {
    hasIntersection,
    hasSubjectParticipatedIn
} = require('@mpieva/psydb-mongo-stages').expressions;

var makeAgeFrameFieldSubConditions = (
    require('./make-age-frame-field-sub-conditions')
);

var makeTestingPermissionSubConditions = (
    require('./make-testing-permission-sub-conditions')
);

var makeCondition = (options) => {
    var {
        experimentVariant,
        searchInterval,
        ageFrameFilters = [],
        ageFrameValueFilters = [],
        ageFrameTargetDefinition,

        studyRecord,
    } = options;

    var {
        excludedOtherStudyIds,
        researchGroupIds,
    } = studyRecord.state;

    var combinedTestingPermissions = { $or: (
        makeTestingPermissionSubConditions({
            researchGroupIds,
            experimentVariant
        })
    )};

    var combinedAgeFrameConditions = undefined;
    if (
        ageFrameTargetDefinition && ageFrameFilters.length > 0) {
        combinedAgeFrameConditions = { $or: (
            makeAgeFrameFieldSubConditions({
                searchInterval,
                ageFrameFilters,
                ageFrameValueFilters,
                ageFrameTargetDefinition,
            })
        )}
    }

    var expression = MongoExpression({
        excludedStudyIds: [
            // exclude study itself
            studyRecord._id,
            ...excludedOtherStudyIds,
        ],
        combinedTestingPermissions,
        combinedAgeFrameConditions
    });

    //console.dir({ expression }, { depth: null });
    return expression;
};

var MongoExpression = (options) => {
    var {
        excludedStudyIds,
        combinedTestingPermissions,
        combinedAgeFrameConditions
    } = options;

    var AND = [
        { $and: [
            { $not: hasParticipatedInExcludedStudies({
                excludedStudyIds
            })},
        ]},
        combinedTestingPermissions,
    ];

    if (combinedAgeFrameConditions) {
        AND.push(combinedAgeFrameConditions);
    }

    return ({
        $cond: {
            if: { $and: AND },
            then: true,
            else: false
        }
    })
}

var hasParticipatedInExcludedStudies = ({ excludedStudyIds }) => {
    return hasSubjectParticipatedIn({ studyIds: excludedStudyIds });
}

module.exports = makeCondition;
