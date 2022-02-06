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
    
    var timeShifted = {
        // shifting time frame back by the age frame boundaries
        // ... on the first test day whats the oldest child
        // we can test ? and on the last day of the testing
        // whats the youngest child we can test?
        // ... if we move the testing interval in the past
        // which children are born within the testinterval
        // expanded by the age frame
        //
        //start: datefns.sub(searchInterval.start, { days: ageFrame.end }),
        //end: datefns.sub(searchInterval.end, { days: ageFrame.start }),
        start: subtractAgeFrameEdge({
            date: targetInterval.start,
            ageFrameEdge: ageFrame.end
        }),
        end: subtractAgeFrameEdge({
            date: targetInterval.end,
            ageFrameEdge: ageFrame.start
        }),
    }

    return timeShifted;
};

var subtractAgeFrameEdge = ({ date, ageFrameEdge }) => (
    datefns.sub(date, { ...ageFrameEdge  })
);

module.exports = timeshiftAgeFrame;
