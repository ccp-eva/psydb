'use strict';
var datefns = require('date-fns');
var { timeshiftAgeFrame } = require('@mpieva/psydb-common-lib');

var checkAgeFrameIntervalIsPlausible = (interval) => {
    console.log({ interval });
    var shifted = timeshiftAgeFrame({
        ageFrame: interval,
        sourceDate: new Date(0)
    });
    console.log({ shifted });
    if (shifted.start.getTime() < shifted.end.getTime()) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = {
    checkAgeFrameIntervalIsPlausible
}
