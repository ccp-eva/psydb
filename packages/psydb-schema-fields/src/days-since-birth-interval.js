'use strict';
var ExactObject = require('./exact-object'),
    DaysSinceBirth = require('./days-since-birth');

var DaysSinceBirthInterval = ({
    startKeywords,
    endKeywords,
    ...additionalKeywords
} = {}) => ExactObject({
    systemType: 'DaysSinceBirthInterval',
    properties: {
        start: DaysSinceBirth({ ...startKeywords }),
        end: DaysSinceBirth({
            minimum: {
                $data: '1/start'
            },
            ...endKeywords
        })
    },
    required: [
        'start',
        'end',
    ],
    ...additionalKeywords,
});

module.exports = DaysSinceBirthInterval;
