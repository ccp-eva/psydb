'use strict';
var ajvFormats = require('ajv-formats'),
    validateDate = ajvFormats.get('date').validate;
// TODO: i suspect that the ajv-formats date-time format has a bug
// as it accepts 2020-10-10 10:00:00 ... which has not timeszone
// and as satted in the docs "timezone is mandatory"

var unmarshalDateOnlyServerSide = {
    modifying: true,
    schema: false,
    valid: true,
    validate: (data, dataPath, parentData, parentDataProperty) => {
        //console.log(data, dataPath, parentData, parentDataProperty);
        if (validateDate(data)) {
            // NOTE: this depends on timezone settings of the server
            var d = new Date(data);
            d.setHours(0); // sets server tz local hours
            parentData[parentDataProperty] = d;
        }
        //console.log(parentData[parentDataProperty]);
    }
}

module.exports = unmarshalDateOnlyServerSide;
