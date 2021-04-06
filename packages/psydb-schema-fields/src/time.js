'use strict';
var Time = ({
    description,
    formatMinimum,
} = {}) => ({
    systemType: 'Time',
    type: 'string',
    format: 'time',
    ...(formatMinimum ? { formatMinimum } : {}),
    ...(description ? { description } : {}),
});

module.exports = Time;
