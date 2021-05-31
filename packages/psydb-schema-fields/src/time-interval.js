'use strict';
var ExactObject = require('./exact-object'),
    Time = require('./time');

var TimeInterval = ({
    description,
    minStart = 0,
    startKeywords,
    endKeywords,
    ...additionalKeywords
} = {}) => (
    ExactObject({
        systemType: 'TimeInterval',
        properties: {
            start: Time({
                minimum: minStart,
                ...startKeywords
            }),
            end: Time({
                minimum: { $data: '1/start' },
                ...endKeywords,
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
