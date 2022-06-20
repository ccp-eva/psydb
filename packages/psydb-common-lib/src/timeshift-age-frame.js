'use strict';
// FIXME: esm handling like in field-stringifiers for ui use needed?
var datefns = require('date-fns');

var timeshiftAgeFrame = (bag) => {
    var passedProps = (
        [
            'targetDate',
            'targetInterval',
            'sourceDate',
            'sourceInterval'
        ]
        .filter(prop => !!bag[prop])
        //.map(prop => ({ prop, value: bag[prop]}))
    );
    if (passedProps > 1) {
        var joined = passedProps.join(',');
        throw new Error(
            `use only one interval/date prop, passed: ${joined}`
        );
    }

    var {
        ageFrame,
        
        targetDate,
        targetInterval,
        sourceDate,
        sourceInterval,
    } = bag;

    if (targetDate || targetInterval) {
        return shiftToThePast({
            ageFrame,
            targetDate,
            targetInterval,
        });
    }
    else if (sourceDate || sourceInterval) {
        return shiftToTheFuture({
            ageFrame,
            sourceDate,
            sourceInterval
        });
    }
    else {
        throw new Error('no date/interval provided');
    }
};

// creates timeshifted interval based on how old a subject is
// in a given target interval; the output is a date interval inside the date
// of birth must be to fulfill the age frame
// i.e. when would the person have to be born
// to be of a certain age at a certain target date
// FIXME: this is _not_ timezone or DST safe
// - if the target dates are summer but the shifted interval is winter
//   DST offset will not be correct
// - we assume the targetDates are already in the correct timezone
var shiftToThePast = (bag) => {
    var {
        ageFrame,
        targetDate,
        targetInterval,
    } = bag;

    if (targetDate) {
        targetInterval = { start: targetDate, end: targetDate };
    }

    // TODO: there mst be a better way than that
    var future = shiftToTheFuture({
        ageFrame,
        sourceInterval: targetInterval
    });
    //console.log({ future });

    var tmpStart = (
        future.start && ageFrame.start
        ? subtractAgeFrameEdge({
            date: future.start,
            ageFrameEdge: ageFrame.end
        })
        : undefined
    );
    var start = (
        future.start && ageFrame.start
        ? subtractAgeFrameEdge({
            date: tmpStart,
            ageFrameEdge: ageFrame.start
        })
        : undefined
    );

    var end = (
        targetInterval.end && ageFrame.start
        ? subtractAgeFrameEdge({
            date: targetInterval.end,
            ageFrameEdge: ageFrame.start
        })
        : undefined
    );

    var timeShifted = {
        ...(start && { start }),
        ...(end && { end }),
    }

    return timeShifted;
}

var subtractAgeFrameEdge = ({ date, ageFrameEdge }) => (
    datefns.sub(date, { ...ageFrameEdge  })
);

// this is used to answer the question:
// when is the the earliest/latest date in the future
// where the subject is in the given age frame
// aka. what is the earliest testable date/what is the latest testable date
// we mostly use it with sourceDate = dateOfBirth
// FIXME: this is _not_ timezone or DST safe
// - if the source dates are summer but the shifted interval is winter
//   DST offset will not be correct
// - we assume the sourceDates are already in the correct timezone
var shiftToTheFuture = (bag) => {
    var {
        ageFrame,
        sourceDate,
        sourceInterval,
    } = bag;

    if (sourceDate) {
        sourceInterval = { start: sourceDate, end: sourceDate };
    }
   
    // this is more starightforward than shiftToThePast
    // as we essentially only add the edges to the interval start/end
    // to know whats the minimum/maximum date where the subject is testable
    var start = (
        sourceInterval.start && ageFrame.start
        ? addAgeFrameEdge({
            date: sourceInterval.start,
            ageFrameEdge: ageFrame.start
        })
        : undefined
    );
    var end = (
        sourceInterval.end && ageFrame.end
        ? addAgeFrameEdge({
            date: sourceInterval.end,
            ageFrameEdge: ageFrame.end
        })
        : undefined
    );

    // all DoBs inside the timeshifted interval are testable
    // at some point in the desired test interval
    var timeShifted = {
        ...(start && { start }),
        ...(end && { end }),
    }

    return timeShifted;
}

var addAgeFrameEdge = ({ date, ageFrameEdge }) => (
    datefns.add(date, { ...ageFrameEdge })
)

module.exports = timeshiftAgeFrame;
