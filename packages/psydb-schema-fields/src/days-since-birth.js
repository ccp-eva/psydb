'use strict';
var DaysSinceBirth = ({ minimum } = {}) => ({
    type: 'integer',
    minimum: minimum || 0,
});

module.exports = DaysSinceBirth;
