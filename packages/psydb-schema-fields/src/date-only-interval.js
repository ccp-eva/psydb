'use strict';
var ExactObject = require('./exact-object'),
    DateOnly = require('./date-only');

var DateOnlyInterval = ({
    additionalStartKeywords,
    additionalEndKeywords,
    ...additionalKeywords
} = {}) => ExactObject({
    systemType: 'DateOnlyInterval',
    properties: {
        start: DateOnly({ ...additionalStartKeywords }),
        end: DateOnly({
            formatMinimum: {
                $data: '2/start/$date'
            },
            ...additionalEndKeywords,
        })
    },
    required: [
        'start',
        'end',
    ],
    ...additionalKeywords,
});

module.exports = DateOnlyInterval;
