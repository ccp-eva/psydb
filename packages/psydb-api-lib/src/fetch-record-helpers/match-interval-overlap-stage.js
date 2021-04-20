'use strict';

var MatchIntervalOverlapStage = ({
    recordIntervalPath,
    start,
    end
}) => {
    recordIntervalPath = recordIntervalPath || 'state.interval';
    return ({ $match: {
        $or: [
            { [`${recordIntervalPath}.start`]: { $lt: end } },
            { [`${recordIntervalPath}.end`]: { $gt: start } },
        ]
    }})
}

module.exports = MatchIntervalOverlapStage;
