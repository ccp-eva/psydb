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

var HOUR = 60 * 60 * 1000;

var unmarshalDateOnlyServerSide = {
    modifying: true,
    schema: false,
    //valid: false,
    validate: function (data, dataPath, parentData, parentDataProperty) {
        // dates can be null in this case dont do anything
        if (data === null) {
            return true;
        }

        //console.log(data);

        var {
            clientTimezone,
            serverTimezone,
        } = this;

        //console.log(data, dataPath, parentData, parentDataProperty);
        if (serverTimezone && clientTimezone) {
            var received = new Date(
                /z$/i.test(data) ? data : `${data}T00:00:00Z`
            );
            received = new Date(received.getTime() + 12 * HOUR); // XXX bs
            // FIXME:
            // on 1894-04-01 something wird happened
            // als all dates before 100 AD cannot be timezone corrected properly
            if (received.getUTCFullYear() <= 1894) {
                return false;
            }
            var swapped = swapTimezone({
                date: received,
                sourceTZ: clientTimezone,
                targetTZ: serverTimezone,
            });

            var dayStart = new Date(swapped);
            // XXX: this is not local but utc
            // but we enforce UTC in server process.env
            // so it curently doesnt matter
            dayStart.setUTCHours(0,0,0,0); // sets server tz local hours

            //console.log({ received, swapped, dayStart });
            
            
            parentData[parentDataProperty] = dayStart;
            //console.log({ clientTimezone, serverTimezone, dayStart });


            return true;
        }
        else {
            console.log({ context: this });
            return false;
        }
        console.log({ context: this });
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
