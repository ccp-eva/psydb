'use strict';
var ajvFormats = require('ajv-formats'),
    validateDateTime = ajvFormats.get('date-time').validate;

var { swapTimezone } = require('@mpieva/psydb-timezone-helpers')

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
    //valid: false,
    validate: function (data, dataPath, parentData, parentDataProperty) {
        var {
            clientTimezone,
            serverTimezone,
        } = this;

        //console.log({ context: this });

        //console.log(data, dataPath, parentData, parentDataProperty);
        if (serverTimezone && clientTimezone) {
            var received = new Date(data);
            var swapped = swapTimezone({
                date: received,
                sourceTZ: clientTimezone,
                targetTZ: serverTimezone,
            });
            
            var dayStart = new Date(swapped);
            dayStart.setHours(0,0,0,0); // sets server tz local hours

            //console.log({ received, swapped, dayStart });
            
            
            parentData[parentDataProperty] = dayStart;

            return true;
        }
        else {
            return false;
        }
        return false;
        
        /*if (data && validateDateTime(data)) {
            var orig = new Date(data);
            // add 12
            //d = new Date(orig.getTime() + 12 * 60 * 60 * 1000)

            var { date } = splitISO(orig.toISOString());
            var [ year, month, day ] = date.split('-');
            // NOTE: this depends on timezone settings of the server
            var d = new Date();
            d.setHours(0,0,0,0); // sets server tz local hours

            d.setFullYear(parseInt(year));
            d.setMonth(parseInt(month) - 1);
            d.setDate(parseInt(day));


            parentData[parentDataProperty] = d;
        }
        //console.log(parentData[parentDataProperty]);*/
    }
}

module.exports = unmarshalDateOnlyServerSide;
