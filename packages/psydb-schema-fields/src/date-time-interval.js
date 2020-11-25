'use strict';
var DateTime = require('./date-time');

var DateTimeInterval = ({
    description
} = {}) => ({
    type: 'object',
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
