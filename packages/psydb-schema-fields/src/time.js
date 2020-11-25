'use strict';
var Time = ({
    description,
    formatMinimum,
} = {}) => ({
    type: 'string',
    format: 'time',
    ...(formatMinimum ? { formatMinimum } : {}),
    ...(description ? { description } : {}),
});

module.exports = Time;
