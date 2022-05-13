'use strict';

var MatchIntervalOverlapStage = ({
    recordIntervalPath,
    start,
    end
}) => {
    recordIntervalPath = recordIntervalPath || 'state.interval';
    return ({ $match: {
        $and: [
            // db   :            |-------------|
            // ours :      sssssss
            //                    eeeeeeeeeeeeeeeeeeeeee
            { [`${recordIntervalPath}.start`]: { $lt: end } },
            { [`${recordIntervalPath}.start`]: { $gte: start } },
        ]
    }})
}

// TODO: i think this is the proper way of doing it
/*
            $or: [
                // our interval is completely contained
                { $and: [
                    { 'state.interval.start': { $lte: interval.start }},
                    { 'state.interval.end': { $gte: interval.end }},
                ]},
                // our interval is around
                { $and: [
                    { 'state.interval.start': { $gte: interval.start }},
                    { 'state.interval.end': { $lte: interval.end }},
                ]},
                // overlaps on the start
                { $and: [
                    { 'state.interval.start': { $lte: interval.start }},
                    { 'state.interval.end': { $gte: interval.start }},
                ]},
                // overlaps on the end
                { $and: [
                    { 'state.interval.start': { $lte: interval.end }},
                    { 'state.interval.end': { $gte: interval.end }},
                ]},
            ]
*/
module.exports = MatchIntervalOverlapStage;
