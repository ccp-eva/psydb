'use strict';
var ExactObject = require('./exact-object'),
    Time = require('./time');

var TimeInterval = ({
    description,
    minStart = 0,
    ...additionalKeywords
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
        ...additionalKeywords,
    })
);

module.exports = TimeInterval;
