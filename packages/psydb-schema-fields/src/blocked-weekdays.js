'use strict';
var ExactObject = require('./exact-object');

var days = [
    'mon', 'tue', 'wed', 'thu',
    'fri', 'sat', 'sun'
];

var BlockedWeekdays = () => ExactObject({
    systemType: 'BlockedWeekdays',
    reactType: 'checkbox-group',
    properties: days.reduce(
        (acc, day) => ({
            ...acc,
            [day]: {
                type: 'boolean',
                default: false 
            }
        }),
        {}
    ),
    required: days,
})

module.exports = BlockedWeekdays;
