'use strict';
var DateOnly = require('./date-only');

var SpecialDateOfBirth = ({
    additionalKeywords
}) => ({
    // TODO: figure out if we want that to be called "Date" bc reserved
    ...DateOnly({
        additionalKeywords: {
            ...additionalKeywords,
            'ui:specialColumn': 'dateOfBirth',
        }
    }),
    systemType: 'SpecialDateOfBirth',
});

module.exports = SpecialDateOfBirth;
