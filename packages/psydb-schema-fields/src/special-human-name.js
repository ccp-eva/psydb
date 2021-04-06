'use strict';
var ExactObject = require('./exact-object'),
    SaneString = require('./sane-string');

var SpecialHumanName = ({
    additionalKeywords
} = {}) => ExactObject({
    systemType: 'SpecialHumanHame',
    properties: {
        lastname: SaneString(),
        firstname: SaneString(),
    },
    required: [
        'firstname',
        'lastname'
    ],
    
    'ui:widget': 'humanName',
    'ui:specialColumn': 'name',
    ...additionalKeywords,
});

module.exports = SpecialHumanName;
