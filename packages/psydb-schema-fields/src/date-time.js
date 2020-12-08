'use strict';
var DateTime = ({
    additionalKeywords,
    ...other
} = {}) => ({
    type: 'string',
    format: 'date-time',
    unmarshalDateTime: true,
    ...additionalKeywords,
});

module.exports = DateTime;

