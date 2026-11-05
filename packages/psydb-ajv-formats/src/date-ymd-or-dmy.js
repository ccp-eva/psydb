'use strict';
// NOTE: accepts 'yyyy-mm-dd' as well as 'dd.mm.yyyy' (and 'd.m.yyyy')
var ymdRX = /^(\d{4})-(\d{2})-(\d{2})$/;
var dmyRX = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;

var DAYS = [ 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
var isLeapYear = (year) => (
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
);

var pad = (n) => String(n).padStart(2, '0');

// returns normalized 'yyyy-mm-dd' or null when not a valid date
var normalize = (str) => {
    if (typeof str !== 'string') {
        return null;
    }

    var year, month, day;
    var ymd = str.match(ymdRX);
    var dmy = str.match(dmyRX);
    if (ymd) {
        ([ , year, month, day ] = ymd.map(Number));
    }
    else if (dmy) {
        ([ , day, month, year ] = dmy.map(Number));
    }
    else {
        return null;
    }

    var maxDay = (month === 2 && isLeapYear(year)) ? 29 : DAYS[month];
    if (month < 1 || month > 12 || day < 1 || day > maxDay) {
        return null;
    }

    return `${year}-${pad(month)}-${pad(day)}`;
}

var validate = (str) => normalize(str) !== null;

module.exports = { normalize, validate };
