'use strict';

var makeAgeFrameFieldSubConditions = ({
    conditionsByAgeFrameList
}) => {
    var combinedAgeFrameConditions = [];
    for (var item of conditionsByAgeFrameList) {
        var ageFrameConditions = []
        var { ageFrame, conditions } = item;

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

        //console.log('AAAAAAAAAAAA');
        //console.log(ageFrame);
        //console.log(timeShifted);
        //throw new Error();

        var ageFrameFieldPath = (
            `$scientific.state.custom.${ageFrameFieldKey}`
        );
        ageFrameConditions.push({
            $and: [
                { $gte: [ ageFrameFieldPath, timeShifted.start ]},
                { $lt: [ ageFrameFieldPath, timeShifted.end ]},
            ]
        })

        /*console.dir({
                $and: [
                    { $gte: [ ageFrameFieldPath, timeShifted.start ]},
                    { $lt: [ ageFrameFieldPath, timeShifted.end ]},
                ]
            }, { depth: null });*/


        for (var condition of conditions) {
            //console.log(condition);
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
