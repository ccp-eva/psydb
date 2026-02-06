'use strict';
var DaysSinceBirth = ({ minimum, ...additionalKeywords } = {}) => ({
    systemType: 'DaysSinceBirth',
    type: 'integer',
    minimum: minimum || 0,
    ...additionalKeywords,
});

module.exports = DaysSinceBirth;
