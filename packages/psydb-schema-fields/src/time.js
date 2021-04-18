'use strict';
var Time = ({
    description,
    minimum,
} = {}) => ({
    systemType: 'Time',
    type: 'integer',
    ...(minimum ? { minimum } : {}),
    ...(description ? { description } : {}),
});

module.exports = Time;
