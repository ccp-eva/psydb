'use strict';
var maybeUseESM = require('./maybe-use-esm');
var intervalToDuration = maybeUseESM(require('date-fns/intervalToDuration'));

var calculateAge = (bag) => {
    var {
        base,
        relativeTo,
        asString = true
    } = bag;

    // FIXME: timezone correction
    base = new Date(base);
    relativeTo = new Date(relativeTo);

    var { years, months, days } = intervalToDuration({
        start: base, end: relativeTo
    });
   
    if (asString) {
        return `${years}/${months}/${days}`;
    }
    else {
        return { years, months, days };
    }
}

module.exports = calculateAge;
