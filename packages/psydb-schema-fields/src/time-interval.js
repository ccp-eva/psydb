'use strict';
var Time = require('./time');

var TimeInterval = ({
    description,
} = {}) => ({
    type: 'object',
    properties: {
        start: Time(),
        end: Time({
            formatMinimum: { $data: '1/start' }
        }),
    },
    required: [
        'start',
        'end'
    ],
    ...(description ? { description } : {}),
});

module.exports = TimeInterval;
