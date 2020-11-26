'use strict';
var SaneString = require('./sane-string');

var SpecialHumanName = ({
    additionalKeywords
}) => ({
    type: 'object',
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

module.exports = FullText;
