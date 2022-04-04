'use strict';
var datefns = require('date-fns');
var jsonpointer = require('jsonpointer');
var {
    hasItems,
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
        enableFollowUpExperiments,
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
        currentStudyId: studyRecord._id,
        enableFollowUpExperiments,
        excludedStudyIds: [
            // exclude study itself
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
        currentStudyId,
        enableFollowUpExperiments,
        excludedStudyIds,
        combinedTestingPermissions,
        combinedAgeFrameConditions
    } = options;

    var AND = [
        { $and: [
            { $not: hasItems({
                $filter: {
                    input: '$scientific.state.internals.participatedInStudies',
                    cond: { $and: [
                        { $eq: [ '$$this.studyId', currentStudyId ] },

                        (
                            enableFollowUpExperiments
                            ? { $eq: [
                                '$$this.excludeFromMoreExperimentsInStudy',
                                true
                            ]}
                            : { $eq: [ '$$this.status', 'participated' ]}
                        )
                    ]}
                }
            })},
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
