'use strict';

var MatchIntervalAroundStage = (options) => {
    var {
        recordIntervalPath: path,
        recordIntervalEndCanBeNull,
        start,
        end,
    } = options;

    path = path || 'state.interval';

    var OR = [
        {
            // db   :      |--------|
            // ours :      eeeeeeeeeeeeeeeeeeeee
            //        sssssssssssssss
            [`${path}.start`]: { $lte: end },
            [`${path}.end`]: { $gte: start },
        },
        // FIXME: that looks redundant
        //{
        //    [`${path}.start`]: { $lte: end },
        //    [`${path}.end`]: { $gte: start },
        //},
    ];

    if (recordIntervalEndCanBeNull === true) {
        OR.push({
            [`${path}.start`]: { $lte: end },
            $or: [
                { [`${path}.end`]: { $exists: false }},
                { [`${path}.end`]: { $type: 10 }},
            ]
        })
    }

    var stage = { $match: { $or: OR }};
    return stage;
}

module.exports = MatchIntervalAroundStage;
