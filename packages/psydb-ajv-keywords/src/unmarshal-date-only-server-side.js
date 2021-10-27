'use strict';
var ajvFormats = require('ajv-formats'),
    validateDateTime = ajvFormats.get('date-time').validate;
// TODO: i suspect that the ajv-formats date-time format has a bug
// as it accepts 2020-10-10 10:00:00 ... which has not timeszone
// and as satted in the docs "timezone is mandatory"

var splitISO = (value) => {
    var date, time, fraction;
    if (typeof value === 'string') {
        var match = value.match(/^(.*)T(\d\d:\d\d:\d\d)\.(\d{3})Z$/);
        if (match) {
            ([ date, time, fraction ] = match.slice(1))
        }
    }

    return { date, time, fraction };
}

var unmarshalDateOnlyServerSide = {
    modifying: true,
    schema: false,
    valid: true,
    validate: (data, dataPath, parentData, parentDataProperty) => {
        //console.log(data, dataPath, parentData, parentDataProperty);
        if (data && validateDateTime(data)) {
            var { date } = splitISO(data);
            var [ year, month, day ] = date.split('-');
            // NOTE: this depends on timezone settings of the server
            var d = new Date();
            d.setHours(0,0,0,0); // sets server tz local hours

            d.setFullYear(parseInt(year));
            d.setMonth(parseInt(month) - 1);
            d.setDate(parseInt(day));

            parentData[parentDataProperty] = d;
        }
        //console.log(parentData[parentDataProperty]);
    }
}

module.exports = unmarshalDateOnlyServerSide;
