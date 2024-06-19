'use strict';
var util = require('./util'),
    regexes = require('./regexes');
/*
var date = (str) => {
  // full-date from http://tools.ietf.org/html/rfc3339#section-5.6
  var matches = str.match(regexes.date);
  if (!matches) return false;

  var year = +matches[1];
  var month = +matches[2];
  var day = +matches[3];

  return month >= 1 && month <= 12 && day >= 1 &&
          day <= (month == 2 && isLeapYear(year) ? 29 : DAYS[month]);
}



var time = (str) => {};
function time(str, full) {
  var matches = str.match(TIME);
  if (!matches) return false;

  var hour = matches[1];
  var minute = matches[2];
  var second = matches[3];
  var timeZone = matches[5];
  return ((hour <= 23 && minute <= 59 && second <= 59) ||
          (hour == 23 && minute == 59 && second == 60)) &&
         (!full || timeZone);
}



var dateTime = (str) => {};
var DATE_TIME_SEPARATOR = /t|\s/i;
function date_time(str) {
  // http://tools.ietf.org/html/rfc3339#section-5.6
  var dateTime = str.split(DATE_TIME_SEPARATOR);
  return dateTime.length == 2 && date(dateTime[0]) && time(dateTime[1], true);
}

*/

module.exports = {
    mongodbObjectId: {
        validate: regexes.mongodbObjectId,
    },
    nanoidDefault: {
        validate: regexes.nanoidDefault,
    },
    germanPhoneNumber: {
        validate: regexes.germanPhoneNumber,
    },
    hexColor: {
        validate: regexes.hexColor,
    },
    emailOptional: {
        validate: regexes.emailOptional,
    }
    /*dateTime: {
        validate: dateTime,
        compare: util.compareDateTime,
    }*/
}
