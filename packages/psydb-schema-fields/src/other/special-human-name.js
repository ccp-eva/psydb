'use strict';
var { ExactObject } = require('../core-compositions');
var { SaneString } = require('../common');

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
