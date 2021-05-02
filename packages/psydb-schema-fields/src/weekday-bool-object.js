'use strict';
var ExactObject = require('./exact-object');
var DefaultBool = require('./default-bool');

var days = [
    'mon', 'tue', 'wed', 'thu',
    'fri', 'sat', 'sun'
];

var WeekdayBoolObject = ({
    ...additionalKeywords
}) => ExactObject({
    systemType: 'WeekdayBoolObject',
    properties: days.reduce(
        (acc, day) => ({
            ...acc,
            [day]: DefaultBool(),
        }),
        {}
    ),
    required: days,
    ...additionalKeywords,
})

module.exports = WeekdayBoolObject;
