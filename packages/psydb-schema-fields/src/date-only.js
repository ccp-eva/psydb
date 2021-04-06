'use strict';
var DateOnly = ({
    additionalKeywords,
    ...other
} = {}) => ({
    type: 'string',
    format: 'date',
    default: '0000-00-00',
    unmarshalDateTime: true,
    ...additionalKeywords,
});

module.exports = DateOnly;

