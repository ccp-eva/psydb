'use strict';

var getOffsetString = (date, timezone) => {
    // NOTE:
    // germany has dst since 1980 older dates will be CET all the time
    // and dates before 1970 will display GMT+01:00 all the time
    // i dont know the reason for the latter
    // NOTE: its important to have en-US here
    // i tried it with 'sv' and the negation indictor
    // of GMT-5 is some utf nonsense that 'new Date()' cant parse back
    // en-US at least uses ascii
    // sv: <Buffer 31 39 37 30 2d 30 31 2d 30 31 20 30 30 3a 30 30 3a 30 30 20 47 4d 54 e2 88 92 35>
    // us: <Buffer 31 39 37 30 2d 30 31 2d 30 31 20 30 30 3a 30 30 3a 30 30 20 47 4d 54 2d 35>
    var str = date.toLocaleString('en-US', {
        timeZone: timezone,
        timeZoneName: 'short'
    });
    var [ match, timezoneString ] = str.match(/(\S+)$/);
    console.log({ str });

    return timezoneString;
}

module.exports = getOffsetString;
