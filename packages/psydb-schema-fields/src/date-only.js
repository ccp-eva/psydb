'use strict';
var DateOnly = ({
    additionalKeywords,
    ...other
} = {}) => ({
    systemType: 'DateOnly',
    type: 'string',
    format: 'date',
    default: '0000-00-00',
    unmarshalDateTime: true,
    ...additionalKeywords,
});

module.exports = DateOnly;

