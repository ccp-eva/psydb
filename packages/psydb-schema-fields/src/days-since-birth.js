'use strict';
var DaysSinceBirth = ({ minimum } = {}) => ({
    systemType: 'DaysSinceBirth',
    type: 'integer',
    minimum: minimum || 0,
});

module.exports = DaysSinceBirth;
