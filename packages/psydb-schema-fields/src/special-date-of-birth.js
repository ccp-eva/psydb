'use strict';
var Date = require('./date');

var SpecialDateOfBirth = ({
    additionalKeywords
}) => (
    // TODO: figure out if we want that to be called "Date" bc reserved
    Date({
        additionalKeywords: {
            ...additionalKeywords,
            'ui:specialColumn': 'dateOfBirth',
        }
    })
);

module.exports = SpecialDateOfBirth;
