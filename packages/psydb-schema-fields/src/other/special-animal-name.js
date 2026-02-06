'use strict';
var { SaneString } = require('../common');

var SpecialAnimalName = ({
    additionalKeywords
}) => ({
    ...SaneString({
        additionalKeywords: {
            ...additionalKeywords,
            'ui:specialColumn': 'name',
        }
    }),
    systemType: 'SpecialAnimalName',
});

module.exports = SpecialAnimalName;
