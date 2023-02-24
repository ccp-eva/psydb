'use strict';
var { formatInTimeZone, zonedTimeToUtc } = require('date-fns-tz');

var swapTimezone = ({
    date,
    sourceTZ,
    targetTZ
}) => {
    // XXX: gemany has a wierd timezone thing occuring in 1894
    if (date.getTime() < new Date('1893-04-02T00:00:00.000Z').getTime()) {
        return new Date(0);
    }

    // XXX; even though we just gave it a UTC time we will not have an
    // incorrect timezoneoffset when system tz is not utc
    // i.e. if the javascript process thinks its 'Europe/Berlin' itl
    // be GMT+1 which seems to confuse date-fns-tz utcToZonedTime()
    // so we include timezone offset in formated string
    var format = "yyyy-MM-dd'T'HH:mm:ss.000xxxxx";

    var stringified = formatInTimeZone(date, sourceTZ, format);
    var _insanitized = new Date(stringified);
    //console.log({ stringified, _insanitized });
        


    var _utc2 = zonedTimeToUtc(_insanitized, targetTZ)
    
    var millis = date.getUTCMilliseconds();
    //console.log(millis);
    _utc2 = new Date(_utc2.getTime() + millis);
    //console.log({ date, _utc2 })

    return _utc2;
}

module.exports = swapTimezone;
