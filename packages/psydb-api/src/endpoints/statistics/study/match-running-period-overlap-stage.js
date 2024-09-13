'use strict';

var MatchRunningPeriodOverlapStage = (bag) => {
    var { interval } = ps;
    var { start, end } = interval;
    var path = 'state.runningPeriod';

    return { $match: { $or: [
        IntervalIncludes({ path, value: start }),
        IntervalIncludes({ path, value: end }),
        IntervalWithinOurs({ path, interval})
    ]}}
}

var IntervalIncludes = ({ path, value }) => {
    return { $and: [
        { [`${path}.start`]: { $lte: value }},
        { [`${path}.end`]: { $gte: value }},
    ]}
}

var IntervalWithinOurs = ({ path, interval }) => {
    return { $and: [
        { [`${path}.start`]: { $gte: interval.start }},
        { [`${path}.end`]: { $lte: interval.end }},
    ]}
}

module.exports = MatchRunningPeriodOverlapStage;
