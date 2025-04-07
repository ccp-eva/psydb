'use strict';
var { ExactObject } = require('../core-compositions');
var { DefaultBool } = require('../common');

var days = [
    'mon', 'tue', 'wed', 'thu',
    'fri', 'sat', 'sun'
];

var labels = {
    'mon': 'Montag',
    'tue': 'Dienstag',
    'wed': 'Mittwoch',
    'thu': 'Donnerstag',
    'fri': 'Freitag',
    'sat': 'Samstag',
    'sun': 'Sonntag',
}

var WeekdayBoolObject = ({
    ...additionalKeywords
}) => ExactObject({
    systemType: 'WeekdayBoolObject',
    properties: days.reduce(
        (acc, day) => ({
            ...acc,
            [day]: DefaultBool({ title: labels[day] }),
        }),
        {}
    ),
    required: days,
    ...additionalKeywords,
})

module.exports = WeekdayBoolObject;
