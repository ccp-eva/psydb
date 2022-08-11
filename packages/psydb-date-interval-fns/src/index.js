'use strict';
var datefns = require('date-fns');
var jsonpointer = require('jsonpointer');
var { arrify } = require('@mpieva/psydb-core-utils');
var intervalfns = require('@mpieva/psydb-interval-fns');

// theirs:           |-------------|
// ours:      ssssssssssssssssssssss
//                   eeeeeeeeeeeeeeeeeeeee
var checkHasOverlap = (theirs, ours) => (
    theirs.start.getTime() <= ours.end.getTime()
    && theirs.end.getTime() >= ours.start.getTime()
);

var compareStarts = (a, b, options = {}) => {
    var { prefix = '' } = options;
    if (prefix && !prefix.startsWith('/')) {
        prefix = '/' + prefix;
    }
    
    var pointer = prefix;

    var aStart = jsonpointer.get(a, pointer).start;
    var bStart = jsonpointer.get(b, pointer).start;

    return aStart.getTime() < bStart.getTime() ? -1 : 1;
};

var intersect = (setA, setB) => (
    intervalfns.intersect({
        setA: arrify(setA).map(dtoi),
        setB: arrify(setB).map(dtoi)
    }).map(itod)
);

//var width = (interval) => (
//    intervalfns.width(dtoi(interval))
//);

var dtoi = (source, options = {}) => {
    var { pointer = '', as } = options;
    var { start, end } = (
        pointer
        ? jsonpointer.get(source, pointer)
        : source
    );

    start = new Date(start).getTime();
    end = new Date(end).getTime();

    var converted = { ...source, start, end };

    switch (as) {
        case 'tuple':
            return [ start, end, converted ];
        case 'object':
        default:
            return converted;
    }
};

var itod = (source, options = {}) => {
    var { as } = options;
    var { start, end } = source;
    
    start = new Date(start);
    end = new Date(end);

    var converted = { ...source, start, end };
    
    switch (as) {
        case 'tuple':
            return [ start, end, converted ];
        case 'object':
        default:
            return converted;
    }
}

/////////////////////////////////////////////////////

var dtos = (source, options = {}) => {
    var { pointer = '', as } = options;
    var { start, end } = (
        pointer
        ? jsonpointer.get(source, pointer)
        : source
    );

    start = new Date(start).toISOString();
    end = new Date(end).toISOString();

    switch (as) {
        case 'tuple':
            return [ start, end ];
        case 'object':
        default:
            return { start, end };
    }
};

var format = (interval, options = {}) => {
    var {
        dateFormat = 'dd.MM.yyyy',
        timeFormat = 'HH:mm',
        offsetEnd = 1,
        locale,
    } = options;

    var { start, end } = interval;
    if (start !== undefined) {
        start = new Date(start);
    }
    if (end !== undefined) {
        end = new Date(end);
        // accomodate for .999Z since interval is half open [s, e)
        end = new Date(end.getTime() + offsetEnd);
    }

    return {
        ...(start !== undefined && {
            startDate: datefns.format(start, dateFormat),
            startTime: datefns.format(start, timeFormat),
        }),
        ...(end !== undefined && {
            endDate: datefns.format(end, dateFormat),
            endTime: datefns.format(end, timeFormat),
        })
    }
}

var merge = (intervals, options = {}) => (
    intervalfns.merge({ intervals: (
        arrify(intervals).map(dtoi)
    )}).map(itod)
);

var monthIntervalOf = (date, options = {}) => {
    var { as } = options;

    var start = datefns.startOfMonth(date);
    var end = datefns.endOfMonth(date);

    switch (as) {
        case 'tuple':
            return [ start, end ];
        case 'object':
        default:
            return { start, end };
    }
}

var weekIntervalOf = (date, options = {}) => {
    var { as, ...pass } = options;

    var start = datefns.startOfWeek(date, pass);
    var end = datefns.endOfWeek(date, pass);

    switch (as) {
        case 'tuple':
            return [ start, end ];
        case 'object':
        default:
            return { start, end };
    }
}

var add = (interval, options = {}) => {
    var {
        start: durationStart,
        end: durationEnd,
        both: durationBoth,
        as
    } = options;

    if (durationBoth) {
        durationStart = durationEnd = durationBoth;
    }
  
    var start = interval.start;
    var end = interval.end;
    if (durationStart) {
        start = datefns.add(interval.start, durationStart);
    }
    if (durationEnd) {
        end = datefns.add(interval.end, durationEnd);
    }

    switch (as) {
        case 'tuple':
            return [ start, end ];
        case 'object':
        default:
            return { start, end };
    }
}


module.exports = {
    checkHasOverlap,
    compareStarts,
    intersect,
    //width,
    dtoi,
    itod,

    /////////////
    dtos,
    format,
    merge,
    monthIntervalOf,
    weekIntervalOf,

    add
}
