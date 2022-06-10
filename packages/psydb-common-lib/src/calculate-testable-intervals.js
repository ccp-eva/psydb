'use strict';
var datefns = require('date-fns');
var intervalfns = require('@mpieva/psydb-date-interval-fns');
var timeshiftAgeFrame = require('./timeshift-age-frame');

var calculateTestableIntervals = (bag) => {
    var {
        dateOfBirth,
        ageFrameIntervals,
        desiredTestInterval
    } = bag;

    var allShiftedDoBs = [];
    for (var afi of ageFrameIntervals) {
        var shifted = timeshiftAgeFrame({
            sourceInterval: {
                start: dateOfBirth,
                end: datefns.endOfDay(dateOfBirth)
            },
            ageFrame: afi,
        });
        //console.log({ shifted });
        allShiftedDoBs.push(shifted);
    }

    var merged = intervalfns.merge(allShiftedDoBs);

    if (desiredTestInterval) {
        var intersections = intervalfns.intersect(
            merged,
            [ desiredTestInterval ],
        );
        return intersections;
    }
    else {
        return merged;
    }
}

module.exports = calculateTestableIntervals;
