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
        ageFrameValueFilters = [],
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
        ];

        if (
            Array.isArray(ageFrameValueFilterGroup)
            && ageFrameValueFilterGroup.length > 0
        ) {
            ageFrameConditions.push(
                ...makeAgeFrameValueConditions({
                    ageFrameValueFilters: ageFrameValueFilterGroup
                })
            )
        }

        combinedAgeFrameConditions.push({ $and: ageFrameConditions });
    }

    return combinedAgeFrameConditions;
}

module.exports = makeAgeFrameFieldSubConditions;
