'use strict';
var subject = require('./subject/entity-construction-data'),
    location = require('./location/entity-construction-data'),
    personnel = require('./personnel/entity-construction-data');

var entityConstructionData = {
    subject,
    location,
    personnel,


    study: {
        canHaveGdprPortion: false,
        hasCustomTypes: false
    }
}
