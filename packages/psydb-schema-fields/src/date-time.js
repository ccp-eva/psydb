'use strict';
var DateTime = ({
    ...additionalKeywords
} = {}) => ({
    systemType: 'DateTime',
    type: 'string',
    format: 'date-time',
    unmarshalDateTime: true,
    default: '0000-00-00T00:00:00Z',
    ...additionalKeywords,
});

module.exports = DateTime;

