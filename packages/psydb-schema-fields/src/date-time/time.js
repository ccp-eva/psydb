'use strict';
var Time = ({
    minimum,
    ...additionalKeywords
} = {}) => ({
    systemType: 'Time',
    type: 'integer',
    minimum: minimum || 0,
    ...additionalKeywords,
});

module.exports = Time;
