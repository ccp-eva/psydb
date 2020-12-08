'use strict';
/*
var cmp = (a, b) => {
    if (a > b) {
        return 1;
    }
    else if (a < b) {
        return -1;
    }
    else {
        return 0;
    }
};

var isLeapYear = (year) => {
  // https://tools.ietf.org/html/rfc3339#appendix-C
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}


var compareTime = (t1, t2) => {
    if (!(t1 && t2)) {
        return undefined;
    }
    var a1 = regexes.time.exec(t1),
        a2 = regexes.time.exec(t2);

    if (!(a1 && a2)) {
        return undefined;
    }

    t1 = a1[1] + a1[2] + a1[3] + (a1[4] || "")
    t2 = a2[1] + a2[2] + a2[3] + (a2[4] || "")

    return cmp(t1, t2);
}

function compareDate(d1: string, d2: string): number | undefined {
  if (!(d1 && d2)) return undefined
  if (d1 > d2) return 1
  if (d1 < d2) return -1
  return 0
}

function compareDateTime(dt1: string, dt2: string): number | undefined {
  if (!(dt1 && dt2)) return undefined
  const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR)
  const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR)
  const res = compareDate(d1, d2)
  if (res === undefined) return undefined
  return res || compareTime(t1, t2)
}*/

module.exports = {
    /*isLeapYear,
    compareDate,
    compareTime,
    compareDateTime,*/
}
