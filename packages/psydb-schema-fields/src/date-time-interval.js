'use strict';
var ExactObject = require('./exact-object'),
    DateTime = require('./date-time');

var DateTimeInterval = ({
    description
} = {}) => ExactObject({
    systemType: 'DateTimeInterval',
    properties: {
        start: DateTime(),
        end: DateTime({
            formatMinimum: {
                $data: '2/start/$date'
            }
        })
    },
    required: [
        'start',
        'end',
    ],
    ...(description ? { description } : {})
});

module.exports = DateTimeInterval;
