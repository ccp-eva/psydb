'use strict';
var ajvFormats = require('ajv-formats'),
    validate = ajvFormats.get('date-time').validate;
// TODO: i suspect that the ajv-formats date-time format has a bug
// as it accepts 2020-10-10 10:00:00 ... which has not timeszone
// and as satted in the docs "timezone is mandatory"

var unmarshalDateTime = {
    modifying: true,
    schema: false,
    valid: true,
    validate: (data, dataPath, parentData, parentDataProperty) => {
        //console.log(data, dataPath, parentData, parentDataProperty);
        if (validate(data)) {
            parentData[parentDataProperty] = new Date(data);
        }
        //console.log(parentData[parentDataProperty]);
    }
}

module.exports = unmarshalDateTime;
