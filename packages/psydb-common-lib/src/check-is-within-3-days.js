'use strict';
var maybeUseESM = require('./maybe-use-esm');
var datefns = {
    add: maybeUseESM(require('date-fns/add')),
    //set: maybeUseESM(require('date-fns/set')),
}

// FIXME: im not sure if datefns.set is localtime or utc
var setLocalNoon = (date) => {
    var out = new Date(date.setHours(12, 0, 0, 0));
    return out;
}

var checkIsWithin3Days = (target, options = {}) => {
    var { referenceDate, forceNoon = true } = options;
    
    target = new Date(target);

    if (!referenceDate) {
        referenceDate = new Date();
    }
    if (forceNoon) {
        referenceDate = setLocalNoon(referenceDate);
        target = setLocalNoon(target);
    }


    var isTrue = (
        datefns.add(referenceDate, { days: 3 }).getTime() > target.getTime()
    );

    return isTrue;
}

module.exports = checkIsWithin3Days;
