'use strict';
var ExactObject = require('./exact-object'),
    Time = require('./time');

var TimeInterval = ({
    description,
} = {}) => (
    ExactObject({
        systemType: 'TimeInterval',
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
    })
);

module.exports = TimeInterval;
