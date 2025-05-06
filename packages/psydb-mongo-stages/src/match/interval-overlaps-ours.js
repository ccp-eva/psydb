'use strict';
var { ejson } = require('@mpieva/psydb-core-utils');
var { SmartArray } = require('@mpieva/psydb-common-lib');

var MatchIntervalOverlapsOursStage = (bag) => {
    var { dbpath, interval = {} } = bag;
    var { start, end } = interval;
    //var path = 'state.runningPeriod';

    if (!start && !end) {
        return undefined;
    }

    var stage = { $match: { $or: SmartArray([
        { $and: SmartArray([
            ( end && { $or: [
                { [`${dbpath}.start`]: { $lte: end }},
                { [`${dbpath}.start`]: { $type: 10 }},
                { [`${dbpath}.start`]: { $exists: false }},
            ]}),
            ( start && { $or: [
                { [`${dbpath}.end`]: { $gte: start }},
                { [`${dbpath}.end`]: { $type: 10 }},
                { [`${dbpath}.end`]: { $exists: false }},
            ]}),
        ])},
        { $or: SmartArray([
            start && (
                IntervalIncludes({ dbpath, value: start })
            ),
            end && (
                IntervalIncludes({ dbpath, value: end })
            ),
            (start && end) && (
                IntervalWithinOurs({ dbpath, interval })
            ),
        ])}
    ])}};

    return stage;
}

var IntervalIncludes = ({ dbpath, value }) => {
    return { $and: [
        { [`${dbpath}.start`]: { $lte: value }},
        { [`${dbpath}.end`]: { $gte: value }},
    ]}
}

var IntervalWithinOurs = ({ dbpath, interval }) => {
    return { $and: [
        { [`${dbpath}.start`]: { $gte: interval.start }},
        { [`${dbpath}.end`]: { $lte: interval.end }},
    ]}
}

module.exports = MatchIntervalOverlapsOursStage;
