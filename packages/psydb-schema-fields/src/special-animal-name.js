'use strict';
var SaneString = require('./sane-string');

var SpecialAnimalName = ({
    additionalKeywords
}) => (
    SaneString({
        additionalKeywords: {
            ...additionalKeywords,
            'ui:specialColumn': 'name',
        }
    })
);

module.exports = SpecialAnimalName;
