'use strict';
var ExactObject = require('./exact-object'),
    Time = require('./time');

var TimeInterval = ({
    description,
    minStart = 0,
} = {}) => (
    ExactObject({
        systemType: 'TimeInterval',
        properties: {
            start: Time({ minimum: minStart }),
            end: Time({
                minimum: { $data: '1/start' }
            }),
        },
        required: [
            'start',
            'end'
        ],
        ...(description ? { description } : {}),
    })
);

module.exports = TimeInterval;
