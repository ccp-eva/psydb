'use strict';
var getOffsetString = require('./get-offset-string');

var swapTimezone = ({
    date,
    sourceTZ,
    targetTZ
}) => {
    // first create date string that can eb parsed back 'sv' works too
    var str = date.toLocaleString('sv', {
        timeZone: sourceTZ,
    });

    // then get the offset of target timezone at dates point in time
    var targetTZString = getOffsetString(date, targetTZ);

    // append the target timezone offset string and parse back
    var swapped = new Date(
        `${str} ${targetTZString}`
    );
    
    // fix milliseconds
    var millis = date.getUTCMilliseconds();
    swapped = new Date(swapped.getTime() + millis);

    return swapped;
}

module.exports = swapTimezone;
