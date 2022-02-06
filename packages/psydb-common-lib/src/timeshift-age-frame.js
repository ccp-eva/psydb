'use strict';
var datefns = require('date-fns');

// NOTE: creates timeshifted interval based on how old a subject is
// in a given target interval; the output is a date interval inside the date
// of birth must be to fulfill the age frame
// 
// i.e. when would the person have to be born
// to be of a certain age at a certain target date
var timeshiftAgeFrame = ({ ageFrame, targetDate, targetInterval }) => {
    if (targetDate && targetInterval) {
        throw new Error(
            'you cannot pass both targetDate and targetInterval'
        );
    }

    if (targetDate) {
        targetInterval = { start: targetDate, end: targetDate };
    }
   
    // all subjects born before "start"
    // are too old (i.e. above ageFrame.end)
    // even at the earliest posisble test date (targetInterval.start)
    // a.k.a start is the earliest DoB we can test in the interval
    var start = (
        targetInterval.start && ageFrame.end
        ? subtractAgeFrameEdge({
            date: targetInterval.start,
            ageFrameEdge: ageFrame.end
        })
        : undefined
    );

    // all subjects born after "end"
    // are too young (i.e. below ageFrame.start)
    // even at the latest possible test time (targetInterval.end)
    var end = (
        targetInterval.end && ageFrame.start
        ? subtractAgeFrameEdge({
            date: targetInterval.end,
            ageFrameEdge: ageFrame.start
        })
        : undefined
    )

    // all DoBs inside the timeshifted interval are testable
    // at some point in the desired test interval
    var timeShifted = {
        ...(start && { start }),
        ...(end && { end }),
    }

    return timeShifted;
};

var subtractAgeFrameEdge = ({ date, ageFrameEdge }) => (
    datefns.sub(date, { ...ageFrameEdge  })
);

module.exports = timeshiftAgeFrame;
