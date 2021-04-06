'use strict';
var ExactObject = require('./exact-object'),
    DaysSinceBirth = require('./days-since-birth');

var DaysSinceBirthInterval = ({
    description
} = {}) => ExactObject({
    systemType: 'DaysSinceBirthInterval',
    properties: {
        start: DaysSinceBirth(),
        end: DaysSinceBirth({
            minimum: {
                $data: '1/start'
            }
        })
    },
    required: [
        'start',
        'end',
    ],
    ...(description ? { description } : {})
});

module.exports = DaysSinceBirthInterval;
