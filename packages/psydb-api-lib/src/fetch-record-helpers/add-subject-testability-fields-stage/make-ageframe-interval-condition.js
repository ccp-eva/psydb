'use strict';
var datefns = require('date-fns');
var convertPointerToPath = require('../../convert-pointer-to-path');

var subtractAgeFrameEdge = ({ date, ageFrameEdge }) => (
    datefns.sub(date, { ...ageFrameEdge  })
)

var timeshift = (options) => {
    var {
        searchInterval,
        ageFrameInterval
    } = options;

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
            date: searchInterval.start,
            ageFrameEdge: ageFrameInterval.end
        }),
        end: subtractAgeFrameEdge({
            date: searchInterval.end,
            ageFrameEdge: ageFrameInterval.start
        }),
    }

    return timeShifted;
}

var makeAgeFrameIntervalCondition = (options) => {
    var {
        ageFrameTargetDefinition,
        searchInterval,
        ageFrameInterval,
    } = options;

    var { start, end } = timeshift({
        searchInterval,
        ageFrameInterval,
    });

    var { pointer } = ageFrameTargetDefinition;
    var path = '$' + convertPointerToPath(pointer);

    return { $and: [
        { $gte: [ path, start ]},
        { $lt: [ path, end ]},
    ]};
}

module.exports = makeAgeFrameIntervalCondition;
