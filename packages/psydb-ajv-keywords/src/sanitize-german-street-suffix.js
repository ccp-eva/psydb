'use strict';
var regex = /(str\.|strasse)/i;

var sanitizeGermanStreetSuffix = {
    modifying: true,
    schema: false,
    valid: true,
    validate: (data, dataPath, parentData, parentDataProperty) => {
        //console.log(data, dataPath, parentData, parentDataProperty);
        if (regex.test(String(data))) {
            data = data.replace(/str\./, 'straße');
            data = data.replace(/Str\./, 'Straße');
            data = data.replace(/strasse/, 'straße');
            data = data.replace(/Strasse/, 'Straße');
            parentData[parentDataProperty] = data
        }
        //console.log(parentData[parentDataProperty]);
    }
}

module.exports = sanitizeGermanStreetSuffix;
