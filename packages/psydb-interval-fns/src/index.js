'use strict';
var bu = require('./boundary-utils');

var fns = {};

// merges overlapping intervals of the set into one
fns.merge = ({ intervals }) => {
    var merged = [],
        current = undefined;

    // FIXME: for loop for performance?
    for (var i = 0; i < intervals.length; i += 1) {
        var interval = intervals[i];

        if (!current) {
            current = interval;
        }
        else {
            // FIXME: boundaries must be merged too
            if (current.end >= interval.start) {
                current.end = interval.end;
            }
            else {
                merged.push(current);
                current = interval;
            }
        }
    };

    // the loop above will never add the last interva, so we
    // do that here
    // the condition is prevent adding "undefined" to an empty set
    if (intervals.length > 0) {
        merged.push(current)
    };

    return merged;
};

fns.intersect = ({ setA, setB }) => {
    // get all the boundary points in a flat array
    // then sort them
    var bounds = [
        ...bu.create(setA, 'set'),
        ...bu.create(setB, 'other')
    ];

    bounds = bu.sort(bounds);
    
    // when we have two overlapping intervals opened (i.e depth is 2)
    // then the previous and the current boundary will form
    // an intersection interval
    var intersections = [];
    bu.each(bounds, (all, index, depth) => {
        if (depth === 2) {
            var prev = all[ index - 1 ];
            var current = all[ index ];
            
            var interval = {
                start: prev.value,
                end: current.value
            };

            intersections.push(interval);
        }
    });

    return intersections;
}

//fns.dayIntervalOf = (date, options = {}) => ({
//    start: datefns.startOfDay(date),
//    end: datefns.endOfDay(date),
//});

module.exports = fns;
