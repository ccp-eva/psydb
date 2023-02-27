'use strict';
var { getTimezoneOffset } = require('date-fns-tz');

var swapTimezone = ({
    date,
    sourceTZ,
    targetTZ
}) => {
    // XXX: gemany has a wierd timezone thing occuring in 1894
    if (date.getTime() < new Date('1893-04-02T00:00:00.000Z').getTime()) {
        return new Date(0);
    }

    var sourceTZO = getTimezoneOffset(sourceTZ, date);
    var targetTZO = getTimezoneOffset(targetTZ, date);

    var out = new Date(date.getTime() + sourceTZO - targetTZO);
    return out;
}

module.exports = swapTimezone;
