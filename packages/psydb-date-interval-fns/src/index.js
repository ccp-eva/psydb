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

var compareEnds = (a, b, options = {}) => {
    var { prefix = '' } = options;
    if (prefix && !prefix.startsWith('/')) {
        prefix = '/' + prefix;
    }
    
    var pointer = prefix;

    var aEnd = jsonpointer.get(a, pointer).end;
    var bEnd = jsonpointer.get(b, pointer).end;

    if (aEnd === null) {
        return 1;
    }
    if (bEnd === null) {
        return -1;
    }

    return new Date(aEnd).getTime() < new Date(bEnd).getTime() ? -1 : 1;
};

var sliceMillis = (interval, millis) => {
    var { start, end } = interval;

    start = new Date(start);
    end = new Date(end);

    var it = new Date(start);
    var out = [];
    while (it.getTime() < end.getTime()) {
        out.push({
            start: it, end: datefns.addMilliseconds(it, millis - 1)
        });
        it = datefns.addMilliseconds(it, millis)
    }

    out[0].start = start;
    out[out.length - 1].end = end;

    return out;
}

var sliceDays = (interval) => {
    var { start, end } = interval;

    start = new Date(start);
    end = new Date(end);

    var it = datefns.startOfDay(start);
    var out = [];
    while (it.getTime() < end.getTime()) {
        out.push({
            start: it, end: datefns.endOfDay(it)
        });
        it = datefns.startOfDay(datefns.add(it, { days: 1 }))
    }

    out[0].start = start;
    out[out.length - 1].end = end;

    return out;
}

var sliceMonths = (interval) => {
    var { start, end } = interval;

    start = new Date(start);
    end = new Date(end);

    var it = datefns.startOfMonth(start);
    var out = [];
    while (it.getTime() < end.getTime()) {
        out.push({
            start: it, end: datefns.endOfMonth(it)
        });
        it = datefns.startOfMonth(datefns.add(it, { months: 1 }))
    }

    out[0].start = start;
    out[out.length - 1].end = end;

    return out;
}

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
        dateFormat = 'P',
        timeFormat = 'p',
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
            startDate: datefns.format(start, dateFormat, { locale }),
            startTime: datefns.format(start, timeFormat, { locale }),
        }),
        ...(end !== undefined && {
            endDate: datefns.format(end, dateFormat, { locale }),
            endTime: datefns.format(end, timeFormat, { locale }),
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
        if (Number.isFinite(durationStart)) {
            start = new Date(interval.start.getTime() + durationStart);
        }
        else {
            start = datefns.add(interval.start, durationStart);
        }
    }
    if (durationEnd) {
        if (Number.isFinite(durationEnd)) {
            end = new Date(interval.end.getTime() + durationEnd);
        }
        else {
            end = datefns.add(interval.end, durationEnd);
        }
    }

    switch (as) {
        case 'tuple':
            return [ start, end ];
        case 'object':
        default:
            return { start, end };
    }
}

var closeEnd = (interval) => {
    var { start, end, ...rest } = interval;
    if (end instanceof Date) {
        end = new Date(end.getTime() + 1);
    }
    else {
        end = end + 1;
    }
    return { start, end, ...rest };
}

var openEnd = (interval) => {
    var { start, end, ...rest } = interval;
    if (end instanceof Date) {
        end = new Date(end.getTime() - 1);
    }
    else {
        end = end - 1;
    }
    return { start, end, ...rest };
}

var sanitizeInterval = (interval) => {
    var { start, end, ...keep } = interval;

    if (start !== undefined) {
        start = new Date(start);
    }
    if (end !== undefined) {
        end = new Date(end);
    }

    // FIXME: this creates a new object not sure if thats good in all cases
    return { start, end, ...keep };
}

var isotod = (isoStringInterval) => {
    var { start, end } = isoStringInterval;
    return {
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
    }
}

var isotoi = (isoStringInterval) => (
    dtoi(isotod(isoStringInterval))
)

module.exports = {
    checkHasOverlap,
    compareStarts,
    compareEnds,
   
    sliceMillis,
    sliceDays,
    sliceMonths,

    intersect,
    //width,
    dtoi,
    itod,
    isotod,
    isotoi,

    openEnd,
    closeEnd,
    /////////////
    dtos,
    format,
    merge,
    monthIntervalOf,
    weekIntervalOf,

    add,
}
