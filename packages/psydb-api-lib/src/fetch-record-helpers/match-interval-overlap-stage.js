'use strict';

var MatchIntervalOverlapStage = ({
    recordIntervalPath,
    start,
    end
}) => {
    recordIntervalPath = recordIntervalPath || 'state.interval';
    return ({ $match: {
        $and: [
            { [`${recordIntervalPath}.start`]: { $lt: end } },
            { [`${recordIntervalPath}.start`]: { $gte: start } },
        ]
    }})
}

module.exports = MatchIntervalOverlapStage;
