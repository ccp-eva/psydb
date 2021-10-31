'use strict';
var datefns = require('date-fns');
var { groupBy } = require('@mpieva/psydb-common-lib');
var convertPointerToPath = require('../../convert-pointer-to-path');

var makeAgeFrameIntervalCondition = (
    require('./make-ageframe-interval-condition')
);
var makeAgeFrameValueConditions = (
    require('./make-ageframe-value-conditions')
);

var makeAgeFrameFieldSubConditions = (options) => {
    var {
        searchInterval,
        ageFrameFilters,
        ageFrameValueFilters,
        ageFrameTargetDefinition,
    } = options;

    var ageFrameValueFiltersById = groupBy({
        items: ageFrameValueFilters,
        byProp: 'ageFrameId',
    });

    var combinedAgeFrameConditions = [];
    for (var filter of ageFrameFilters) {
        var ageFrameValueFilterGroup = (
            ageFrameValueFiltersById[filter.ageFrameId]
        );

        var ageFrameConditions = [
            makeAgeFrameIntervalCondition({
                searchInterval,
                ageFrameInterval: filter.interval,
                ageFrameTargetDefinition,
            }),
            ...makeAgeFrameValueConditions({
                ageFrameValueFilters: ageFrameValueFilterGroup || []
            })
        ]


        /*for (var it of ageFrameGroup) {
            var {
                pointer,
                values: value
            } = it.state.conditions;

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
        }*/

        combinedAgeFrameConditions.push({ $and: ageFrameConditions });
    }

    return combinedAgeFrameConditions;
}

module.exports = makeAgeFrameFieldSubConditions;
