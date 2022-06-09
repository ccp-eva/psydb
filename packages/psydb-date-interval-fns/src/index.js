'use strict';
var datefns = require('date-fns');
var jsonpointer = require('jsonpointer');
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

module.exports = {
    checkHasOverlap,
    compareStarts,
    intersect,
    //width,
    dtoi,
    itod,
}
