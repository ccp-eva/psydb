'use strict';
var { SmartArray } = require('@mpieva/psydb-api-lib');

var MatchRunningPeriodOverlapStage = (bag) => {
    var { interval = {} } = bag;
    var { start, end } = interval;
    var path = 'state.runningPeriod';

    if (!start && !end) {
        return undefined;
    }

    return { $match: { $or: SmartArray([
        { $and: SmartArray([
            ( end && (
                { [`${path}.start`]: { $lte: end } } 
            )),
            { $or: [
                { [`${path}.end`]: { $type: 10 }},
                { [`${path}.end`]: { $exists: false }},
            ]}, 
        ])},
        { $or: SmartArray([
            start && (
                IntervalIncludes({ path, value: start })
            ),
            end && (
                IntervalIncludes({ path, value: end })
            ),
            (start && end) && (
                IntervalWithinOurs({ path, interval })
            ),
        ])}
    ])}}
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
