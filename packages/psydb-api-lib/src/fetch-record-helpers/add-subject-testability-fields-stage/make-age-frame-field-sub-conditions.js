'use strict';
var datefns = require('date-fns');

var makeAgeFrameFieldSubConditions = ({
    ageFrameFieldKey,
    conditionsByAgeFrameList,
    timeFrameStart,
    timeFrameEnd,
}) => {
    var combinedAgeFrameConditions = [];
    for (var item of conditionsByAgeFrameList) {
        var ageFrameConditions = []
        var { ageFrame, conditions } = item;

        var timeShifted = {
            // shifting time frame back by the age frame boundaries
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
            `$scientific.state.custom.${ageFrameFieldKey}`
        );
        ageFrameConditions.push({
            $and: [
                { $gte: [ ageFrameFieldPath, timeShifted.start ]},
                { $lt: [ ageFrameFieldPath, timeShifted.end ]},
            ]
        })

        for (var condition of conditions) {
            var conditionFieldPath = (
                `$scientific.state.custom.${condition.fieldKey}`
            );
            ageFrameConditions.push({
                $cond: {
                    if: { $isArray: conditionFieldPath },
                    then: { $gt: [
                        { $size: {
                            $ifNull: [
                                { $setIntersection: [
                                    conditionFieldPath,
                                    condition.values,
                                ]},
                                []
                            ]
                        }},
                        0
                    ]},
                    else: { $in: [
                        conditionFieldPath, condition.values
                    ]}
                }
            })
        }

        combinedAgeFrameConditions.push({ $and: ageFrameConditions });
    }

    return combinedAgeFrameConditions;
}

module.exports = makeAgeFrameFieldSubConditions;
